import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'node:fs';
import path from 'node:path';
import { logger } from '../lib/logger.js';
const S3_BUCKET = process.env['S3_BUCKET_NAME'];
const USE_S3 = !!S3_BUCKET;
const LOCAL_DATA_DIR = path.resolve(process.cwd(), 'data');
const s3 = USE_S3 ? new S3Client({ region: process.env['AWS_REGION'] || 'eu-west-3' }) : null;
/**
 * Save a project roadmap. Uses S3 if configured, fallback to local filesystem.
 */
export async function saveProject(projectId, roadmap) {
    const json = JSON.stringify(roadmap, null, 2);
    if (USE_S3 && s3) {
        try {
            await s3.send(new PutObjectCommand({
                Bucket: S3_BUCKET,
                Key: `projects/${projectId}.json`,
                Body: json,
                ContentType: 'application/json',
            }));
            logger.info('StorageService', 'Project saved to S3', { projectId });
        }
        catch (error) {
            logger.error('StorageService', 'S3 save failed', {
                projectId,
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    else {
        // Fallback: local filesystem
        if (!fs.existsSync(LOCAL_DATA_DIR)) {
            fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
        }
        const filePath = path.join(LOCAL_DATA_DIR, `${projectId}.json`);
        fs.writeFileSync(filePath, json, 'utf-8');
        logger.info('StorageService', 'Project saved locally', { projectId, filePath });
    }
}
/**
 * Retrieve a project roadmap by ID. Returns null if not found.
 */
export async function getProject(projectId) {
    if (USE_S3 && s3) {
        try {
            const response = await s3.send(new GetObjectCommand({
                Bucket: S3_BUCKET,
                Key: `projects/${projectId}.json`,
            }));
            const body = await response.Body?.transformToString();
            if (!body)
                return null;
            return JSON.parse(body);
        }
        catch (error) {
            if (error.name === 'NoSuchKey') {
                return null;
            }
            logger.error('StorageService', 'S3 get failed', {
                projectId,
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    else {
        const filePath = path.join(LOCAL_DATA_DIR, `${projectId}.json`);
        if (!fs.existsSync(filePath))
            return null;
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    }
}
//# sourceMappingURL=storage.service.js.map