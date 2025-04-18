import dotenv from 'dotenv';
import { app } from './app.js';
import connectDB from './config/database.js';
import appConfig from './config/appConfig.js';
console.log('appConfig', appConfig);
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5051, () => {
      console.log(`🚀 Server is running at port no : ${appConfig.port}`);
    });
  })
  .catch(err => {
    console.log('MONGO db connection failed !!!! ', err);
  });
