import mongoose from 'mongoose';
import appConfig from './appConfig.js';

const connectDB = async () => {
  try {
    const options = {
      connectTimeoutMS: 45000,
      socketTimeoutMS: 45000,
    };

    const connectionInstance = await mongoose.connect(
      `${appConfig.mongoURI}/${appConfig.mongoDBName}`,
      options
    );
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log('MONGODB connection FAILED !!', error);
    process.exit(1);
  }
};
export default connectDB;
