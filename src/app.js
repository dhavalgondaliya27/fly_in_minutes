import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import ResponseEnhancer from './utils/responseEnhancer.js';
import mainRoute from './api/route.js';
import session from 'express-session';
import { uploadFile } from './middlewares/upload.middleware.js'; // Your multer import

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);

app.use(
  session({
    secret: 'FlySecret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// No need for express-fileupload anymore, only multer is used

app.use(cookieParser());

app.use(ResponseEnhancer);
app.get('/', (req, res) => {
  res.send('Fly is running ...');
});
mainRoute(app);

app.use((req, res) => {
  return res.error(404, 'Route not found');
});

app.use(helmet());
app.use(compression());

export { app };
  