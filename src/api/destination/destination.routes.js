import { Router } from 'express';
import {
  createDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
} from './destination.controller.js';
import { checkRole, verifyJWT } from '../../middlewares/auth.middleware.js';

const destinationRouter = Router();

destinationRouter.post(
  '/create',
  verifyJWT,
  checkRole(['admin']),
  createDestination
);

destinationRouter.get('/all', getAllDestinations);
destinationRouter.get('/:destinationId', getDestinationById);

destinationRouter.put(
  '/update/:destinationId',
  verifyJWT,
  checkRole(['admin']),
  updateDestination
);

destinationRouter.delete(
  '/delete/:destinationId',
  verifyJWT,
  checkRole(['admin']),
  deleteDestination
);

export default destinationRouter;
