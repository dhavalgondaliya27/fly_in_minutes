import { Router } from 'express';
import {
  createDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
} from './destination.controller.js';
import { checkRole } from '../../middlewares/auth.middleware.js';

const destinationRouter = Router();

destinationRouter.post(
  '/create',
  checkRole('admin'),
  createDestination
);

destinationRouter.get('/all', getAllDestinations);
destinationRouter.get('/:destinationId', getDestinationById);

destinationRouter.put(
  '/update/:destinationId',
  checkRole('admin'),
  updateDestination
);

destinationRouter.delete(
  '/delete/:destinationId',
  checkRole('admin'),
  deleteDestination
);

export default destinationRouter;
