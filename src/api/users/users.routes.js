import { Router } from 'express';
import {
  createUser,
  emailExist,
  getCurrentUser,
  googleLogin,
  loginUser,
  verifyOtp,
} from './users.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.post('/email-exist', emailExist);
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/create', verifyJWT, createUser);
userRouter.post('/login', loginUser);
userRouter.get('/me', verifyJWT, getCurrentUser);
userRouter.post('/google', googleLogin);
export default userRouter;
