/**
 * Centralized S3 URL validation utilities
 */

export interface S3UrlParts {
  bucket: string;
  region: string;
  key: string;
  isValid: boolean;
}

/**
 * Validates and parses an S3 URL to ensure it's from the configured bucket
 * @param url The S3 URL to validate
 * @returns Parsed S3 URL parts or null if invalid
 * @throws Error if AWS S3 configuration is missing
 */
export function validateAndParseS3Url(url: string): S3UrlParts | null {
  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION;

  if (!bucket || !region) {
    throw new Error('AWS S3 configuration is missing (AWS_S3_BUCKET or AWS_REGION)');
  }

  if (!url || typeof url !== 'string') {
    return null;
  }

  // Parse URL to validate structure
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return null;
  }

  // Enforce HTTPS
  if (parsedUrl.protocol !== 'https:') {
    return null;
  }

  // Support both path-style and virtual-hosted-style S3 URLs
  // Path-style: https://s3.region.amazonaws.com/bucket/key
  // Virtual-hosted-style: https://bucket.s3.region.amazonaws.com/key
  
  let extractedBucket: string | null = null;
  let extractedRegion: string | null = null;
  let key: string | null = null;

  // Check for virtual-hosted-style
  const virtualHostedPattern = new RegExp(`^([^.]+)\\.s3\\.([^.]+)\\.amazonaws\\.com$`);
  const virtualMatch = parsedUrl.hostname.match(virtualHostedPattern);
  
  if (virtualMatch) {
    extractedBucket = virtualMatch[1];
    extractedRegion = virtualMatch[2];
    key = parsedUrl.pathname.substring(1); // Remove leading /
  } else {
    // Check for path-style
    const pathStylePattern = new RegExp(`^s3\\.([^.]+)\\.amazonaws\\.com$`);
    const pathMatch = parsedUrl.hostname.match(pathStylePattern);
    
    if (pathMatch) {
      extractedRegion = pathMatch[1];
      const pathParts = parsedUrl.pathname.substring(1).split('/');
      extractedBucket = pathParts[0];
      key = pathParts.slice(1).join('/');
    }
  }

  // Validate bucket and region match configuration
  if (extractedBucket !== bucket || extractedRegion !== region) {
    return null;
  }

  // Validate key doesn't contain path traversal
  if (!key || key.includes('..') || key.startsWith('/')) {
    return null;
  }

  return {
    bucket: extractedBucket,
    region: extractedRegion,
    key,
    isValid: true,
  };
}

/**
 * Extracts the S3 key from a validated S3 URL
 * @param url The S3 URL
 * @returns The S3 key or null if invalid
 */
export function extractS3Key(url: string): string | null {
  const parsed = validateAndParseS3Url(url);
  return parsed ? parsed.key : null;
}
