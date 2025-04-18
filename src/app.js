import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import ResponseEnhancer from './utils/responseEnhancer.js';
import mainRoute from './routes/index.js';
import session from 'express-session';
const app = express();

app.use(cors());
app.use(
  session({
    secret: 'FlySecret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(ResponseEnhancer);
app.get('/', (req, res) => {
  res.send('Fly is running ...');
});
app.use(mainRoute);

app.use(helmet());
app.use(compression());

export { app };
