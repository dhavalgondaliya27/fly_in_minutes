import { Router } from 'express';
import {
  createUser,
  emailExist,
  forgotPassword,
  getCurrentUser,
  googleLogin,
  loginUser,
  refreshAccessToken,
  resetPassword,
  verifyOtp,
} from './users.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.post('/email-exist', emailExist);
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/create', createUser);
userRouter.post('/login', loginUser);
userRouter.get('/me', verifyJWT, getCurrentUser);
userRouter.post('/google', googleLogin);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/refresh-token', refreshAccessToken);
export default userRouter;
