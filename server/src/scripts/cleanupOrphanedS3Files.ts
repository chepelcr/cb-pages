/**
 * Cleanup script for orphaned S3 files
 * 
 * This script identifies and deletes S3 objects that are not referenced
 * in the database, cleaning up failed or abandoned uploads.
 * 
 * Usage: npx tsx server/src/scripts/cleanupOrphanedS3Files.ts [--dry-run] [--older-than-hours=24]
 */

import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { db } from '../../db';
import { galleryItems, shields, leadershipPeriods, siteConfig } from '../../../shared/schema';

interface CleanupOptions {
  dryRun: boolean;
  olderThanHours: number;
}

async function getAllReferencedS3Keys(): Promise<Set<string>> {
  const referencedKeys = new Set<string>();

  // Get all S3 keys from gallery items
  const galleryKeys = await db.select({ imageS3Key: galleryItems.imageS3Key, thumbnailS3Key: galleryItems.thumbnailS3Key })
    .from(galleryItems);
  galleryKeys.forEach((item: { imageS3Key: string | null; thumbnailS3Key: string | null }) => {
    if (item.imageS3Key) referencedKeys.add(item.imageS3Key);
    if (item.thumbnailS3Key) referencedKeys.add(item.thumbnailS3Key);
  });

  // Get all S3 keys from shields
  const shieldKeys = await db.select({ imageS3Key: shields.imageS3Key })
    .from(shields);
  shieldKeys.forEach((item: { imageS3Key: string | null }) => {
    if (item.imageS3Key) referencedKeys.add(item.imageS3Key);
  });

  // Get all S3 keys from leadership periods
  const leadershipKeys = await db.select({ imageS3Key: leadershipPeriods.imageS3Key })
    .from(leadershipPeriods);
  leadershipKeys.forEach((item: { imageS3Key: string | null }) => {
    if (item.imageS3Key) referencedKeys.add(item.imageS3Key);
  });

  // Get all S3 keys from site config
  const configKeys = await db.select({ logoS3Key: siteConfig.logoS3Key, faviconS3Key: siteConfig.faviconS3Key })
    .from(siteConfig);
  configKeys.forEach((item: { logoS3Key: string | null; faviconS3Key: string | null }) => {
    if (item.logoS3Key) referencedKeys.add(item.logoS3Key);
    if (item.faviconS3Key) referencedKeys.add(item.faviconS3Key);
  });

  return referencedKeys;
}

async function listAllS3Objects(s3Client: S3Client, bucket: string): Promise<Array<{ key: string; lastModified: Date }>> {
  const objects: Array<{ key: string; lastModified: Date }> = [];
  let continuationToken: string | undefined;

  do {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      ContinuationToken: continuationToken,
    });

    const response = await s3Client.send(command);
    
    if (response.Contents) {
      response.Contents.forEach(obj => {
        if (obj.Key && obj.LastModified) {
          objects.push({
            key: obj.Key,
            lastModified: obj.LastModified,
          });
        }
      });
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return objects;
}

async function cleanupOrphanedFiles(options: CleanupOptions) {
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_S3_BUCKET;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !bucket || !accessKeyId || !secretAccessKey) {
    console.error('Missing AWS configuration. Ensure AWS_REGION, AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY are set.');
    process.exit(1);
  }

  const s3Client = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });

  console.log('🔍 Fetching referenced S3 keys from database...');
  const referencedKeys = await getAllReferencedS3Keys();
  console.log(`✅ Found ${referencedKeys.size} referenced S3 keys in database`);

  console.log('🔍 Listing all S3 objects...');
  const allObjects = await listAllS3Objects(s3Client, bucket);
  console.log(`✅ Found ${allObjects.length} total objects in S3`);

  // Filter orphaned objects
  const cutoffDate = new Date(Date.now() - options.olderThanHours * 60 * 60 * 1000);
  const orphanedObjects = allObjects.filter(obj => {
    const isReferenced = referencedKeys.has(obj.key);
    const isOldEnough = obj.lastModified < cutoffDate;
    return !isReferenced && isOldEnough;
  });

  console.log(`\n📊 Cleanup Summary:`);
  console.log(`   Total S3 objects: ${allObjects.length}`);
  console.log(`   Referenced in DB: ${referencedKeys.size}`);
  console.log(`   Orphaned (older than ${options.olderThanHours}h): ${orphanedObjects.length}`);

  if (orphanedObjects.length === 0) {
    console.log('\n✨ No orphaned files to clean up!');
    return;
  }

  if (options.dryRun) {
    console.log('\n🔍 DRY RUN - Would delete the following files:');
    orphanedObjects.forEach(obj => {
      console.log(`   - ${obj.key} (last modified: ${obj.lastModified.toISOString()})`);
    });
    console.log('\nRun without --dry-run to actually delete these files.');
    return;
  }

  // Delete orphaned objects in batches of 1000 (S3 limit)
  console.log('\n🗑️  Deleting orphaned files...');
  const batchSize = 1000;
  let deletedCount = 0;

  for (let i = 0; i < orphanedObjects.length; i += batchSize) {
    const batch = orphanedObjects.slice(i, i + batchSize);
    
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: batch.map(obj => ({ Key: obj.key })),
        Quiet: true,
      },
    });

    try {
      const result = await s3Client.send(deleteCommand);
      const batchDeletedCount = batch.length - (result.Errors?.length || 0);
      deletedCount += batchDeletedCount;
      
      if (result.Errors && result.Errors.length > 0) {
        console.error(`⚠️  Failed to delete ${result.Errors.length} files:`);
        result.Errors.forEach(err => console.error(`   - ${err.Key}: ${err.Message}`));
      }
      
      console.log(`   Deleted batch ${Math.floor(i / batchSize) + 1}: ${batchDeletedCount} files`);
    } catch (error) {
      console.error(`❌ Error deleting batch:`, error);
    }
  }

  console.log(`\n✅ Cleanup complete! Deleted ${deletedCount} orphaned files.`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: CleanupOptions = {
  dryRun: args.includes('--dry-run'),
  olderThanHours: 24, // Default: only delete files older than 24 hours
};

// Parse --older-than-hours argument
const olderThanArg = args.find(arg => arg.startsWith('--older-than-hours='));
if (olderThanArg) {
  const hours = parseInt(olderThanArg.split('=')[1], 10);
  if (!isNaN(hours) && hours > 0) {
    options.olderThanHours = hours;
  }
}

// Run cleanup
cleanupOrphanedFiles(options)
  .then(() => {
    console.log('\n👋 Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
