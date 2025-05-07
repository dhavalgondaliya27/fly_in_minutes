import dotenv from 'dotenv';
dotenv.config({
  path: '../../.env',
});
const appConfig = {
  port: process.env.PORT || 9090,
  mongoURI: process.env.MONGO_URI,
  mongoDBName: process.env.DB_NAME,
  jwtSecret: process.env.JWT_SECRET,
  tokenExpire: '30d',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_REGION,
  awsS3BucketName: process.env.AWS_S3_BUCKET_NAME,
  emailSender: process.env.EMAIL_SENDER,
  emailPassword: process.env.EMAIL_PASSWORD,
};

export default appConfig;
