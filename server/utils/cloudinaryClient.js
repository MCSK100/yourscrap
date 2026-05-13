import crypto from 'crypto';

export const getCloudinarySignatureData = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const timestamp = Math.floor(Date.now() / 1000);

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary configuration is missing');
  }

  const signature = crypto
    .createHash('sha1')
    .update(`timestamp=${timestamp}${apiSecret}`)
    .digest('hex');

  return {
    signature,
    timestamp,
    cloud_name: cloudName,
    api_key: apiKey
  };
};
