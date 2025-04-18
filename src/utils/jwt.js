import jwt from "jsonwebtoken";
import {jwtSecret, tokenExpire} from '../config/appConfig.js';

const generateToken = (user) => {
  const payload = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: tokenExpire });

  return accessToken;
};

const decodeToken = async (token) => {
  return jwt.verify(token, jwtSecret);
};

export { generateToken, decodeToken };