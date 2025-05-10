import jwt from 'jsonwebtoken';
import appConfig from '../config/appConfig.js';

const generateAccessToken = user => {
  const payload = {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  const accessToken = jwt.sign(payload, appConfig.jwtSecret, { expiresIn: appConfig.tokenExpire });

  return accessToken;
};

const generateRefreshToken = user => {
  const payload = {
    _id: user._id,
    type: 'refresh',
  };
  const refreshToken = jwt.sign(payload, appConfig.jwtSecret, {
    expiresIn: appConfig.refreshTokenExpire,
  });
  return refreshToken;
};

const decodeToken = async token => {
  return jwt.verify(token, appConfig.jwtSecret);
};

export { generateAccessToken, generateRefreshToken, decodeToken };
