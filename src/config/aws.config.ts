import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
    region: process.env.AWS_REGION || 'ap-south-1',
    s3: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        bucket: process.env.AWS_S3_BUCKET || 'bharatdrama-videos',
        videoPath: 'videos/',
        thumbnailPath: 'thumbnails/',
    },
    cloudFront: {
        distributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID,
        domainName: process.env.AWS_CLOUDFRONT_DOMAIN,
    },
    mediaConvert: {
        endpoint: process.env.AWS_MEDIACONVERT_ENDPOINT,
        roleArn: process.env.AWS_MEDIACONVERT_ROLE_ARN,
    },
    kms: {
        keyId: process.env.AWS_KMS_KEY_ID, // For DRM protection
    },
}));
