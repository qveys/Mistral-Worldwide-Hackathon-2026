import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'node:fs';
import path from 'node:path';
import type { z } from 'zod';
import { logger } from '../lib/logger.js';
import type { RoadmapSchema } from '../lib/schema.js';

type Roadmap = z.infer<typeof RoadmapSchema>;

const S3_BUCKET = process.env['S3_BUCKET_NAME'];
const USE_S3 = !!S3_BUCKET;
const LOCAL_DATA_DIR = path.resolve(process.cwd(), 'data');
const PROJECT_INDEX_FILE = path.join(LOCAL_DATA_DIR, '.project_index.json');
const S3_INDEX_KEY = 'projects/.project_index.json';

const s3 = USE_S3 ? new S3Client({ region: process.env['AWS_REGION'] || 'eu-west-3' }) : null;

type ProjectIndex = Record<string, string>;
type ProjectAccessResult =
    | { status: 'not_found' }
    | { status: 'forbidden' }
    | { status: 'found'; project: Roadmap };

let indexWriteQueue: Promise<void> = Promise.resolve();

function parseProjectIndex(raw: string, source: 'local' | 's3'): ProjectIndex {
    try {
        const parsed = JSON.parse(raw) as unknown;
        return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
            ? (parsed as ProjectIndex)
            : {};
    } catch (error) {
        logger.error('StorageService', 'Failed to parse project index JSON, using empty index', {
            source,
            error: error instanceof Error ? error.message : String(error),
        });
        return {};
    }
}

async function withIndexWriteLock<T>(operation: () => Promise<T>): Promise<T> {
    const run = indexWriteQueue.then(operation, operation);
    indexWriteQueue = run.then(
        () => undefined,
        () => undefined
    );
    return run;
}

async function readIndex(): Promise<ProjectIndex> {
    if (USE_S3 && s3) {
        try {
            const response = await s3.send(
                new GetObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: S3_INDEX_KEY,
                })
            );
            const body = await response.Body?.transformToString();
            if (!body) return {};
            return parseProjectIndex(body, 's3');
        } catch (error) {
            if ((error as { name?: string }).name === 'NoSuchKey') return {};
            logger.error('StorageService', 'Failed to read project index from S3', {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    if (!fs.existsSync(PROJECT_INDEX_FILE)) return {};
    const content = fs.readFileSync(PROJECT_INDEX_FILE, 'utf-8');
    return parseProjectIndex(content, 'local');
}

async function writeIndex(index: ProjectIndex): Promise<void> {
    const json = JSON.stringify(index, null, 2);
    if (USE_S3 && s3) {
        await s3.send(
            new PutObjectCommand({
                Bucket: S3_BUCKET,
                Key: S3_INDEX_KEY,
                Body: json,
                ContentType: 'application/json',
            })
        );
        return;
    }
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
        fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    const tempPath = `${PROJECT_INDEX_FILE}.tmp`;
    fs.writeFileSync(tempPath, json, 'utf-8');
    fs.renameSync(tempPath, PROJECT_INDEX_FILE);
}

/**
 * Save a project roadmap for the given user. Uses S3 if configured, fallback to local filesystem.
 * Stores under data/{userId}/{projectId}.json and updates the project index.
 */
export async function saveProject(
    userId: string,
    projectId: string,
    roadmap: Roadmap
): Promise<void> {
    const json = JSON.stringify(roadmap, null, 2);

    if (USE_S3 && s3) {
        try {
            await s3.send(
                new PutObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: `projects/${userId}/${projectId}.json`,
                    Body: json,
                    ContentType: 'application/json',
                }),
            );
            await withIndexWriteLock(async () => {
                const index = await readIndex();
                index[projectId] = userId;
                await writeIndex(index);
            });
            logger.info('StorageService', 'Project saved to S3', { projectId, userId });
        } catch (error) {
            logger.error('StorageService', 'S3 save failed', {
                projectId,
                userId,
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    } else {
        const userDir = path.join(LOCAL_DATA_DIR, userId);
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }
        const filePath = path.join(userDir, `${projectId}.json`);
        fs.writeFileSync(filePath, json, 'utf-8');
        await withIndexWriteLock(async () => {
            const index = await readIndex();
            index[projectId] = userId;
            await writeIndex(index);
        });
        logger.info('StorageService', 'Project saved locally', { projectId, userId, filePath });
    }
}

/**
 * Retrieve a project roadmap with a single index read while preserving
 * not_found vs forbidden outcomes.
 */
export async function getProjectForUser(
    projectId: string,
    requestUserId: string
): Promise<ProjectAccessResult> {
    const index = await readIndex();
    const ownerId = index[projectId];
    if (ownerId === undefined) return { status: 'not_found' };
    if (ownerId !== requestUserId) return { status: 'forbidden' };

    if (USE_S3 && s3) {
        try {
            const response = await s3.send(
                new GetObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: `projects/${ownerId}/${projectId}.json`,
                }),
            );
            const body = await response.Body?.transformToString();
            if (!body) return { status: 'not_found' };
            return { status: 'found', project: JSON.parse(body) as Roadmap };
        } catch (error) {
            if ((error as { name?: string }).name === 'NoSuchKey') return { status: 'not_found' };
            logger.error('StorageService', 'S3 get failed', {
                projectId,
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }

    const filePath = path.join(LOCAL_DATA_DIR, ownerId, `${projectId}.json`);
    if (!fs.existsSync(filePath)) return { status: 'not_found' };
    const content = fs.readFileSync(filePath, 'utf-8');
    return { status: 'found', project: JSON.parse(content) as Roadmap };
}
