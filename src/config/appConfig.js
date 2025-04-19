import dotenv from 'dotenv';
dotenv.config({
  path: '../../.env',
});
const appConfig = {
  port: process.env.PORT || 9001,
  mongoURI: process.env.MONGO_URI,
  mongoDBName: process.env.DB_NAME,
  jwtSecret: process.env.JWT_SECRET,
  tokenExpire: '30d',
};

export default appConfig;
