import { getCloudinarySignatureData } from '../utils/cloudinaryClient.js';

export const getCloudinarySignature = async (req, res, next) => {
  try {
    const payload = getCloudinarySignatureData();
    return res.json(payload);
  } catch (error) {
    return next(error);
  }
};
