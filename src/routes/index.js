import express from 'express';
const router = express.Router();

// Sample route
router.get('/ping', (req, res) => {
  res.send('pong');
});

const apiVersion = '/api/v1';

const mainRoutes = app => {
  app.use(apiVersion, router);  // ✅ Now properly attached
};

export default mainRoutes;
