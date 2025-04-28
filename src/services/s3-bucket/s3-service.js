import AWS from 'aws-sdk';
import appConfig from '../../config/appConfig.js';

const s3 = new AWS.S3({
  accessKeyId: appConfig.awsAccessKey,
  secretAccessKey: appConfig.awsSecretKey,
  region: appConfig.awsRegion,
});

// Upload File
const uploadFile = async (fileContent, key, mimeType) => {
  const params = {
    Bucket: appConfig.awsS3BucketName,
    Key: key,
    Body: fileContent,
    ContentType: mimeType,
    ACL: 'private',
  };

  return s3.upload(params).promise();
};

// Delete File
const deleteFile = async key => {
  const params = {
    Bucket: appConfig.awsS3BucketName,
    Key: key,
  };

  return s3.deleteObject(params).promise();
};

// Get Signed URL (to view private files temporarily)
const getSignedUrl = (key, expiresIn = 60 * 5) => {
  // 5 minutes
  const params = {
    Bucket: appConfig.awsS3BucketName,
    Key: key,
    Expires: expiresIn,
  };

  return s3.getSignedUrlPromise('getObject', params);
};
export { getSignedUrl, uploadFile, deleteFile };
