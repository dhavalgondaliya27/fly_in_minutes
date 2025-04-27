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

categoryRouter.post('/category/create', checkRole(['admin']), createCategory);
categoryRouter.get('/category/:categoryId', getCategoryById);
categoryRouter.get('/category/all', getAllCategories);
categoryRouter.put('/category/update/:categoryId', checkRole(['admin']), updateCategory);
categoryRouter.delete('/category/delete/:categoryId', checkRole(['admin']), deleteCategory);

export default categoryRouter;
