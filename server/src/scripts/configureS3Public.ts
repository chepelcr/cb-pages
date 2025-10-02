/**
 * Script to configure S3 bucket for public image hosting
 * 
 * This enables:
 * 1. Public ACLs for uploaded images
 * 2. Public bucket policy for read access
 * 3. CORS for direct browser uploads
 * 
 * Usage: npx tsx server/src/scripts/configureS3Public.ts
 */

import {
  S3Client,
  PutBucketPolicyCommand,
  PutBucketCorsCommand,
  PutPublicAccessBlockCommand,
  GetBucketPolicyCommand,
} from '@aws-sdk/client-s3';

async function configureS3Public() {
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

  try {
    console.log(`🔧 Configuring S3 bucket for public access: ${bucket}`);
    console.log(`📍 Region: ${region}`);
    console.log(`📍 CloudFront: ${process.env.CLOUDFRONT_DOMAIN || 'banderas-data.jcampos.dev'}`);
    console.log();

    // Step 1: Disable block public access settings
    console.log('1️⃣  Configuring public access block settings...');
    await s3Client.send(
      new PutPublicAccessBlockCommand({
        Bucket: bucket,
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: false,
          IgnorePublicAcls: false,
          BlockPublicPolicy: false,
          RestrictPublicBuckets: false,
        },
      })
    );
    console.log('✅ Public access block disabled');
    console.log();

    // Step 2: Set bucket policy for public read access
    console.log('2️⃣  Setting bucket policy for public read access...');
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${bucket}/*`,
        },
      ],
    };

    try {
      const existingPolicy = await s3Client.send(new GetBucketPolicyCommand({ Bucket: bucket }));
      console.log('📋 Current bucket policy:');
      console.log(existingPolicy.Policy);
      console.log();
    } catch (error: any) {
      if (error.name === 'NoSuchBucketPolicy') {
        console.log('⚠️  No existing bucket policy');
      }
      console.log();
    }

    await s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: bucket,
        Policy: JSON.stringify(bucketPolicy),
      })
    );
    console.log('✅ Bucket policy applied');
    console.log('📝 Policy allows public read access to all objects');
    console.log();

    // Step 3: Configure CORS
    console.log('3️⃣  Configuring CORS for browser uploads...');
    const corsConfiguration = {
      CORSRules: [
        {
          AllowedHeaders: ['*'],
          AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
          AllowedOrigins: ['*'],
          ExposeHeaders: ['ETag'],
          MaxAgeSeconds: 3000,
        },
      ],
    };

    await s3Client.send(
      new PutBucketCorsCommand({
        Bucket: bucket,
        CORSConfiguration: corsConfiguration,
      })
    );
    console.log('✅ CORS configuration applied');
    console.log();

    console.log('🎉 S3 bucket successfully configured!');
    console.log();
    console.log('✅ Configuration summary:');
    console.log('   • Public access: Enabled');
    console.log('   • Public read policy: Applied');
    console.log('   • CORS: Configured for browser uploads');
    console.log('   • ACL support: Enabled (objects can be set to public-read)');
    console.log();
    console.log('⚠️  SECURITY NOTE:');
    console.log('   Current configuration allows:');
    console.log('   • Public read access to all objects in the bucket');
    console.log('   • CORS from all origins (*)');
    console.log();
    console.log('   For production, consider:');
    console.log('   • Restricting CORS to specific domains');
    console.log('   • Using CloudFront for CDN and additional security');
    console.log('   • Implementing signed URLs for private content');
  } catch (error: any) {
    console.error('❌ Failed to configure S3:', error);
    if (error.Code === 'AccessDenied') {
      console.error();
      console.error('⚠️  Access Denied - Ensure your AWS credentials have these permissions:');
      console.error('   • s3:PutBucketPolicy');
      console.error('   • s3:PutBucketCors');
      console.error('   • s3:PutPublicAccessBlock');
    }
    process.exit(1);
  }
}

configureS3Public()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
