import { Router } from 'express';
import {
  createCity,
  getAllCities,
  getCityById,
  updateCity,
  deleteCity,
} from './city.controller.js';
import { checkRole } from '../../../middlewares/auth.middleware.js';

const cityRouter = Router();

cityRouter.post('/create', checkRole('admin'), createCity);

cityRouter.get('/all', getAllCities);
cityRouter.get('/:cityId', getCityById);

cityRouter.put('/update/:cityId', checkRole('admin'), updateCity);

cityRouter.delete('/delete/:cityId', checkRole('admin'), deleteCity);

export default cityRouter;
