import { Router } from 'express';
import {
  createUser,
  emailExist,
  getCurrentUser,
  loginUser,
  verifyOtp,
} from './users.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.post('/user/email-exist', emailExist);
userRouter.post('/user/verify-otp', verifyOtp);
userRouter.post('/user/create', verifyJWT, createUser);
userRouter.post('/user/login', loginUser);
userRouter.get('/user/me', verifyJWT, getCurrentUser);
export default userRouter;
