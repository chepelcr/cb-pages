/**
 * Script to configure CORS settings for S3 bucket
 * 
 * This enables direct browser uploads to S3 via presigned URLs
 * 
 * Usage: npx tsx server/src/scripts/configureS3CORS.ts
 */

import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } from '@aws-sdk/client-s3';

async function configureS3CORS() {
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_S3_BUCKET;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !bucket || !accessKeyId || !secretAccessKey) {
    console.error('❌ Missing AWS configuration');
    console.error('Required environment variables:');
    console.error('  - AWS_REGION');
    console.error('  - AWS_S3_BUCKET');
    console.error('  - AWS_ACCESS_KEY_ID');
    console.error('  - AWS_SECRET_ACCESS_KEY');
    process.exit(1);
  }

  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  // CORS configuration for direct browser uploads
  const corsConfiguration = {
    CORSRules: [
      {
        AllowedHeaders: ['*'],
        AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
        AllowedOrigins: ['*'], // In production, replace with specific domain
        ExposeHeaders: ['ETag'],
        MaxAgeSeconds: 3000,
      },
    ],
  };

  try {
    console.log(`🔧 Configuring CORS for S3 bucket: ${bucket}`);
    console.log(`📍 Region: ${region}`);
    console.log();

    // Check existing CORS configuration
    console.log('📋 Checking existing CORS configuration...');
    try {
      const existingCors = await s3Client.send(new GetBucketCorsCommand({ Bucket: bucket }));
      console.log('✅ Current CORS configuration:');
      console.log(JSON.stringify(existingCors.CORSRules, null, 2));
      console.log();
    } catch (error: any) {
      if (error.name === 'NoSuchCORSConfiguration') {
        console.log('⚠️  No CORS configuration found');
      } else {
        console.log('⚠️  Could not retrieve CORS configuration:', error.message);
      }
      console.log();
    }

    // Apply new CORS configuration
    console.log('🚀 Applying new CORS configuration...');
    await s3Client.send(
      new PutBucketCorsCommand({
        Bucket: bucket,
        CORSConfiguration: corsConfiguration,
      })
    );

    console.log('✅ CORS configuration applied successfully!');
    console.log();
    console.log('📝 Applied CORS rules:');
    console.log(JSON.stringify(corsConfiguration.CORSRules, null, 2));
    console.log();
    console.log('⚠️  SECURITY NOTE:');
    console.log('   Current configuration allows ALL origins (*)');
    console.log('   For production, update AllowedOrigins to specific domains:');
    console.log('   - https://your-domain.com');
    console.log('   - https://your-domain.replit.app');
    console.log();
    console.log('🎉 S3 bucket is now configured for direct browser uploads!');
  } catch (error: any) {
    console.error('❌ Failed to configure CORS:', error);
    if (error.Code === 'AccessDenied') {
      console.error();
      console.error('⚠️  Access Denied - Please ensure your AWS credentials have s3:PutBucketCors permission');
    }
    process.exit(1);
  }
}

configureS3CORS()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
