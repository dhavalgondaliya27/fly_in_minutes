import jwt from "jsonwebtoken";
import appConfig from '../config/appConfig.js';

const generateToken = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, appConfig.jwtSecret, { expiresIn: appConfig.tokenExpire });

  return accessToken;
};

const decodeToken = async (token) => {
  return jwt.verify(token, appConfig.jwtSecret);
};

export { generateToken, decodeToken };