import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getSubCategoryByCategoryId,
} from './category.controller.js';
import { checkRole } from '../../middlewares/auth.middleware.js';
import { uploadFile } from '../../middlewares/upload.middleware.js'; // multer import

const categoryRouter = Router();

categoryRouter.post(
  '/create',
  checkRole('admin'),
  uploadFile.array('photos', 10),
  createCategory
);

categoryRouter.get('/all', getAllCategories);
categoryRouter.get('/:categoryId', getCategoryById);

categoryRouter.put(
  '/update/:categoryId',
  checkRole('admin'),
  uploadFile.array('photos', 10),
  updateCategory
);

categoryRouter.delete('/delete/:categoryId', checkRole('admin'), deleteCategory);
categoryRouter.get('/subcategory/:categoryId', getSubCategoryByCategoryId);

export default categoryRouter;
