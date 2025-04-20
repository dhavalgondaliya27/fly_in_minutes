import { Router } from 'express';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const userRouter = Router();

// loginRouter.route('/user/login').post(loginUser);

export default userRouter;