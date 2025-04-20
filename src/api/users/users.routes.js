import { Router } from 'express';
import { createUser, getCurrentUser, loginUser } from './users.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.post('/user/create', createUser)
userRouter.post('/user/login',loginUser)
userRouter.get("/user/me", verifyJWT, getCurrentUser)
export default userRouter;