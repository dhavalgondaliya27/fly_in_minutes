import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from './category.controller.js';
import { checkRole, verifyJWT } from '../../middlewares/auth.middleware.js';

const categoryRouter = Router();

categoryRouter.post('/create', checkRole(['admin']), createCategory);
categoryRouter.get('/all', getAllCategories);
categoryRouter.get('/:categoryId', getCategoryById);
categoryRouter.put('/update/:categoryId', checkRole(['admin']), updateCategory);
categoryRouter.delete('/delete/:categoryId', checkRole(['admin']), deleteCategory);

export default categoryRouter;
