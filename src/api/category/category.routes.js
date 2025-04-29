import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from './category.controller.js';
import { checkRole, verifyJWT } from '../../middlewares/auth.middleware.js';
import { uploadFile } from '../../middlewares/upload.middleware.js'; // multer import

const categoryRouter = Router();

categoryRouter.post(
  '/create',
  verifyJWT,
  checkRole('admin'),
  uploadFile.array('photos', 10),
  createCategory
);

categoryRouter.get('/all', getAllCategories);
categoryRouter.get('/:categoryId', getCategoryById);

categoryRouter.put(
  '/update/:categoryId',
  verifyJWT,
  checkRole('admin'),
  uploadFile.array('photos', 10), // Use multer for file uploads
  updateCategory
);

categoryRouter.delete('/delete/:categoryId', verifyJWT, checkRole('admin'), deleteCategory);

export default categoryRouter;
