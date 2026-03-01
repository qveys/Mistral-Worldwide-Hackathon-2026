import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'node:fs';
import path from 'node:path';
import { logger } from '../lib/logger.js';
const S3_BUCKET = process.env['S3_BUCKET_NAME'];
const USE_S3 = !!S3_BUCKET;
const LOCAL_DATA_DIR = path.resolve(process.cwd(), 'data');
const PROJECT_INDEX_FILE = path.join(LOCAL_DATA_DIR, '.project_index.json');
const S3_INDEX_KEY = 'projects/.project_index.json';
const s3 = USE_S3 ? new S3Client({ region: process.env['AWS_REGION'] || 'eu-west-3' }) : null;
async function readIndex() {
    if (USE_S3 && s3) {
        try {
            const response = await s3.send(new GetObjectCommand({
                Bucket: S3_BUCKET,
                Key: S3_INDEX_KEY,
            }));
            const body = await response.Body?.transformToString();
            if (!body)
                return {};
            const parsed = JSON.parse(body);
            return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
                ? parsed
                : {};
        }
        catch (error) {
            if (error.name === 'NoSuchKey')
                return {};
            logger.error('StorageService', 'Failed to read project index from S3', {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    if (!fs.existsSync(PROJECT_INDEX_FILE))
        return {};
    const content = fs.readFileSync(PROJECT_INDEX_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
        ? parsed
        : {};
}
async function writeIndex(index) {
    const json = JSON.stringify(index, null, 2);
    if (USE_S3 && s3) {
        await s3.send(new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: S3_INDEX_KEY,
            Body: json,
            ContentType: 'application/json',
        }));
        return;
    }
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
        fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PROJECT_INDEX_FILE, json, 'utf-8');
}
/**
 * Save a project roadmap for the given user. Uses S3 if configured, fallback to local filesystem.
 * Stores under data/{userId}/{projectId}.json and updates the project index.
 */
export async function saveProject(userId, projectId, roadmap) {
    const json = JSON.stringify(roadmap, null, 2);
    if (USE_S3 && s3) {
        try {
            await s3.send(new PutObjectCommand({
                Bucket: S3_BUCKET,
                Key: `projects/${userId}/${projectId}.json`,
                Body: json,
                ContentType: 'application/json',
            }));
            const index = await readIndex();
            index[projectId] = userId;
            await writeIndex(index);
            logger.info('StorageService', 'Project saved to S3', { projectId, userId });
        }
        catch (error) {
            logger.error('StorageService', 'S3 save failed', {
                projectId,
                userId,
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    else {
        const userDir = path.join(LOCAL_DATA_DIR, userId);
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }
        const filePath = path.join(userDir, `${projectId}.json`);
        fs.writeFileSync(filePath, json, 'utf-8');
        const index = await readIndex();
        index[projectId] = userId;
        await writeIndex(index);
        logger.info('StorageService', 'Project saved locally', { projectId, userId, filePath });
    }
}
/**
 * Retrieve a project roadmap by ID. Returns null if not found or if requestUserId is not the owner.
 */
export async function getProject(projectId, requestUserId) {
    const index = await readIndex();
    const ownerId = index[projectId];
    if (ownerId === undefined)
        return null;
    if (ownerId !== requestUserId)
        return null;
    if (USE_S3 && s3) {
        try {
            const response = await s3.send(new GetObjectCommand({
                Bucket: S3_BUCKET,
                Key: `projects/${ownerId}/${projectId}.json`,
            }));
            const body = await response.Body?.transformToString();
            if (!body)
                return null;
            return JSON.parse(body);
        }
        catch (error) {
            if (error.name === 'NoSuchKey')
                return null;
            logger.error('StorageService', 'S3 get failed', {
                projectId,
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    const filePath = path.join(LOCAL_DATA_DIR, ownerId, `${projectId}.json`);
    if (!fs.existsSync(filePath))
        return null;
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
}
/**
 * Return the owner userId for a project, or null if the project is not in the index.
 * Used by controllers to return 404 vs 403 (not found vs forbidden).
 */
export async function getProjectOwner(projectId) {
    const index = await readIndex();
    const ownerId = index[projectId];
    return ownerId ?? null;
}
//# sourceMappingURL=storage.service.js.map