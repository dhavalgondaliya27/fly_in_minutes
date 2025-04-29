import { Router } from 'express';
import {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoryByCategoryId,
  getAllSubCategory,
} from './sub-category.controller.js';
import { checkRole } from '../../../middlewares/auth.middleware.js';

const subCategoryRouter = Router();

subCategoryRouter.post('/create', checkRole('admin'), createSubCategory);
subCategoryRouter.get('/all', checkRole('admin'), getAllSubCategory);
subCategoryRouter.put('/:subCategoryId', checkRole('admin'), updateSubCategory);
subCategoryRouter.delete('/:subCategoryId', checkRole('admin'), deleteSubCategory);
subCategoryRouter.get('/:categoryId', getSubCategoryByCategoryId);

export default subCategoryRouter;
