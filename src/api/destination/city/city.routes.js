import { Router } from 'express';
import {
  createCity,
  getAllCities,
  getCityById,
  updateCity,
  deleteCity,
} from './city.controller.js';
import { verifyJWT, checkRole } from '../../../middlewares/auth.middleware.js';

const cityRouter = Router();

cityRouter.post('/create', verifyJWT, checkRole(['admin']), createCity);

cityRouter.get('/all', getAllCities);
cityRouter.get('/:cityId', getCityById);

cityRouter.put('/update/:cityId', verifyJWT, checkRole(['admin']), updateCity);

cityRouter.delete('/delete/:cityId', verifyJWT, checkRole(['admin']), deleteCity);

export default cityRouter;
