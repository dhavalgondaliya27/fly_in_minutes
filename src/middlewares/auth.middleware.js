import { User } from '../api/users/users.model.js';
import { decodeToken } from '../utils/jwt.js';

export const verifyJWT = async (req, res, next) => {
  try {
    let token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.error(401, 'Unauthorized request');
    }

    const decodedUser = await decodeToken(token);

    if (!decodedUser) {
      return res.error(400, 'Invalid token payload');
    }

    const user = await User.findById(decodedUser._id);
    if (!user) {
      return res.error(404, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    return res.error(500, error?.message || 'Something went wrong');
  }
};
