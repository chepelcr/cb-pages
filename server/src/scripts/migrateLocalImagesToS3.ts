/**
 * Migration script to move existing local images to S3
 * 
 * This script uploads existing images from the local `uploads/` directory
 * to S3 and updates the database with S3 URLs and keys.
 * 
 * Usage: npx tsx server/src/scripts/migrateLocalImagesToS3.ts [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { createS3StorageService } from '../services/S3StorageService';
import { db } from '../../db';
import { galleryItems, shields, leadershipPeriods, siteConfig } from '../../../shared/schema';
import { eq } from 'drizzle-orm';

interface MigrationOptions {
  dryRun: boolean;
}

async function uploadFileToS3(
  s3Service: ReturnType<typeof createS3StorageService>,
  localPath: string,
  s3Folder: string
): Promise<{ url: string; key: string } | null> {
  try {
    if (!fs.existsSync(localPath)) {
      console.warn(`⚠️  Local file not found: ${localPath}`);
      return null;
    }

    const fileBuffer = fs.readFileSync(localPath);
    const fileName = path.basename(localPath);
    const ext = path.extname(fileName);
    
    // Determine MIME type
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };
    const mimeType = mimeTypes[ext.toLowerCase()] || 'image/jpeg';

    // Generate presigned upload URL
    const { uploadUrl, fileKey, publicUrl } = await s3Service.generatePresignedUploadUrl(
      mimeType,
      s3Folder
    );

    // Upload file to S3
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: fileBuffer,
      headers: {
        'Content-Type': mimeType,
      },
    });

    if (!response.ok) {
      console.error(`❌ Failed to upload ${localPath} to S3: ${response.statusText}`);
      return null;
    }

    return { url: publicUrl, key: fileKey };
  } catch (error) {
    console.error(`❌ Error uploading ${localPath}:`, error);
    return null;
  }
}

async function migrateGalleryItems(s3Service: ReturnType<typeof createS3StorageService>, options: MigrationOptions) {
  console.log('\n📸 Migrating gallery items...');
  
  const items = await db.select().from(galleryItems);
  let migratedCount = 0;
  let skippedCount = 0;

  for (const item of items) {
    // Skip if already has S3 key
    if (item.imageS3Key) {
      console.log(`   ⏭️  Skipping ${item.title} (already has S3 key)`);
      skippedCount++;
      continue;
    }

    // Check if imageUrl is a local path
    if (!item.imageUrl || item.imageUrl.startsWith('http')) {
      skippedCount++;
      continue;
    }

    const localPath = path.join(process.cwd(), 'uploads', item.imageUrl.replace('/uploads/', ''));
    
    if (options.dryRun) {
      console.log(`   🔍 Would migrate: ${item.title} (${localPath})`);
      continue;
    }

    const result = await uploadFileToS3(s3Service, localPath, 'gallery');
    
    if (result) {
      await db.update(galleryItems)
        .set({ imageUrl: result.url, imageS3Key: result.key })
        .where(eq(galleryItems.id, item.id));
      
      console.log(`   ✅ Migrated: ${item.title}`);
      migratedCount++;
    }
  }

  console.log(`   📊 Gallery: ${migratedCount} migrated, ${skippedCount} skipped`);
}

async function migrateShields(s3Service: ReturnType<typeof createS3StorageService>, options: MigrationOptions) {
  console.log('\n🛡️  Migrating shields...');
  
  const items = await db.select().from(shields);
  let migratedCount = 0;
  let skippedCount = 0;

  for (const item of items) {
    // Skip if already has S3 key
    if (item.imageS3Key) {
      console.log(`   ⏭️  Skipping ${item.title} (already has S3 key)`);
      skippedCount++;
      continue;
    }

    // Check if imageUrl is a local path
    if (!item.imageUrl || item.imageUrl.startsWith('http')) {
      skippedCount++;
      continue;
    }

    const localPath = path.join(process.cwd(), 'uploads', item.imageUrl.replace('/uploads/', ''));
    
    if (options.dryRun) {
      console.log(`   🔍 Would migrate: ${item.title} (${localPath})`);
      continue;
    }

    const result = await uploadFileToS3(s3Service, localPath, 'shields');
    
    if (result) {
      await db.update(shields)
        .set({ imageUrl: result.url, imageS3Key: result.key })
        .where(eq(shields.id, item.id));
      
      console.log(`   ✅ Migrated: ${item.title}`);
      migratedCount++;
    }
  }

  console.log(`   📊 Shields: ${migratedCount} migrated, ${skippedCount} skipped`);
}

async function migrateLeadership(s3Service: ReturnType<typeof createS3StorageService>, options: MigrationOptions) {
  console.log('\n👔 Migrating leadership periods...');
  
  const items = await db.select().from(leadershipPeriods);
  let migratedCount = 0;
  let skippedCount = 0;

  for (const item of items) {
    // Skip if already has S3 key
    if (item.imageS3Key) {
      console.log(`   ⏭️  Skipping ${item.year} (already has S3 key)`);
      skippedCount++;
      continue;
    }

    // Skip if no image
    if (!item.imageUrl || item.imageUrl.startsWith('http')) {
      skippedCount++;
      continue;
    }

    const localPath = path.join(process.cwd(), 'uploads', item.imageUrl.replace('/uploads/', ''));
    
    if (options.dryRun) {
      console.log(`   🔍 Would migrate: ${item.year} (${localPath})`);
      continue;
    }

    const result = await uploadFileToS3(s3Service, localPath, 'leadership');
    
    if (result) {
      await db.update(leadershipPeriods)
        .set({ imageUrl: result.url, imageS3Key: result.key })
        .where(eq(leadershipPeriods.id, item.id));
      
      console.log(`   ✅ Migrated: ${item.year}`);
      migratedCount++;
    }
  }

  console.log(`   📊 Leadership: ${migratedCount} migrated, ${skippedCount} skipped`);
}

async function migrateSiteConfig(s3Service: ReturnType<typeof createS3StorageService>, options: MigrationOptions) {
  console.log('\n⚙️  Migrating site configuration...');
  
  const config = await db.select().from(siteConfig).limit(1);
  
  if (config.length === 0) {
    console.log('   ⏭️  No site config found');
    return;
  }

  const item = config[0];
  let migratedCount = 0;
  const updates: any = {};

  // Migrate logo
  if (item.logoUrl && !item.logoUrl.startsWith('http') && !item.logoS3Key) {
    const localPath = path.join(process.cwd(), 'uploads', item.logoUrl.replace('/uploads/', ''));
    
    if (options.dryRun) {
      console.log(`   🔍 Would migrate logo: ${localPath}`);
    } else {
      const result = await uploadFileToS3(s3Service, localPath, 'site-config');
      if (result) {
        updates.logoUrl = result.url;
        updates.logoS3Key = result.key;
        console.log(`   ✅ Migrated logo`);
        migratedCount++;
      }
    }
  }

  // Migrate favicon
  if (item.faviconUrl && !item.faviconUrl.startsWith('http') && !item.faviconS3Key) {
    const localPath = path.join(process.cwd(), 'uploads', item.faviconUrl.replace('/uploads/', ''));
    
    if (options.dryRun) {
      console.log(`   🔍 Would migrate favicon: ${localPath}`);
    } else {
      const result = await uploadFileToS3(s3Service, localPath, 'site-config');
      if (result) {
        updates.faviconUrl = result.url;
        updates.faviconS3Key = result.key;
        console.log(`   ✅ Migrated favicon`);
        migratedCount++;
      }
    }
  }

  if (!options.dryRun && Object.keys(updates).length > 0) {
    await db.update(siteConfig)
      .set(updates)
      .where(eq(siteConfig.id, item.id));
  }

  console.log(`   📊 Site config: ${migratedCount} items migrated`);
}

async function migrateLocalImagesToS3(options: MigrationOptions) {
  console.log('🚀 Starting local image migration to S3...\n');
  
  if (options.dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }

  try {
    const s3Service = createS3StorageService();
    
    await migrateGalleryItems(s3Service, options);
    await migrateShields(s3Service, options);
    await migrateLeadership(s3Service, options);
    await migrateSiteConfig(s3Service, options);
    
    console.log('\n✅ Migration complete!');
    
    if (options.dryRun) {
      console.log('\nRun without --dry-run to perform the actual migration.');
    } else {
      console.log('\n💡 Next steps:');
      console.log('   1. Verify images are accessible in your application');
      console.log('   2. Run cleanup script to remove orphaned files: npx tsx server/src/scripts/cleanupOrphanedS3Files.ts --dry-run');
      console.log('   3. After verifying, you can safely delete the local uploads/ directory');
    }
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: MigrationOptions = {
  dryRun: args.includes('--dry-run'),
};

// Run migration
migrateLocalImagesToS3(options)
  .then(() => {
    console.log('\n👋 Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
