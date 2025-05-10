import { generateAccessToken, generateRefreshToken } from '../../utils/jwt.js';
import { createUserSchema, loginUserSchema } from './user.validator.js';
import { User } from './users.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import verifyGoogleToken from '../../services/google.js';
import forgotPasswordEmail from '../../services/email/forgot_email.js';
import jwt from 'jsonwebtoken';
import appConfig from '../../config/appConfig.js';
import bcrypt from 'bcrypt';
import sendOtpEmail from '../../services/email/send_otp.js';

const emailExist = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  if (!email) {
    return res.error(400, 'Email is required');
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    if (userExist.googleId !== null) {
      return res.success(200, null, 'Email already exists, please login with google');
    } else if (userExist.password) {
      return res.success(200, null, 'Please Enter Password');
    } else {
      userExist.otp = otp;
      userExist.otpExpiration = Date.now() + 1000 * 60 * 5;
      await userExist.save();
      //send email
      await sendOtpEmail(email, otp);
      return res.success(200, null, 'Otp sent successfully');
    }
  }
  await User.create({
    email,
    otp,
    otpExpiration: Date.now() + 1000 * 60 * 5,
  });
  //send email
  await sendOtpEmail(email, otp);
  return res.success(200, null, 'Otp sent successfully');
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.error(400, 'Email and otp are required');
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.error(400, 'User not found');
  }
  if (user.otp !== otp) {
    return res.error(400, 'Invalid otp');
  }
  if (user.otpExpiration < Date.now()) {
    return res.error(400, 'Otp expired');
  }
  user.otp = null;
  user.otpExpiration = null;
  await user.save();
  return res.success(200, null, 'Otp verified successfully');
});

const createUser = asyncHandler(async (req, res) => {
  const { error } = createUserSchema.validate(req.body);

  if (error) {
    return res.error(400, error.message);
  }
  const { firstName, lastName, email, DOB, password } = req.body;
  const username = email.split('@')[0];
  const user = await User.findOne({ email }).select('-password -refreshToken');
  if (!user) {
    return res.error(404, 'User not found');
  }
  user.firstName = firstName;
  user.lastName = lastName;
  user.DOB = DOB;
  user.password = password;
  user.username = username;

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const option = {
    httpOnly: false,
    secure: true,
    sameSite: 'Strict',
    maxAge: 100 * 365 * 24 * 60 * 60 * 1000,
  };
  res.cookie('refreshToken', refreshToken, option);
  user.refreshToken = refreshToken;
  await user.save();
  return res.success(200, { user, accessToken }, 'User create successfully');
});

const loginUser = asyncHandler(async (req, res) => {
  const { error } = loginUserSchema.validate(req.body);
  if (error) {
    return res.error(400, error.message);
  }

  const { email, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: email }, { username: email }],
  }).select(('+refreshToken'));

  if (!user) {
    return res.error(404, 'User not found');
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.error(400, 'Invalid password');
  }

  const accessToken = generateAccessToken(user);
  const option = {
    httpOnly: false,
    secure: true,
    sameSite: 'Strict',
    maxAge: 100 * 365 * 24 * 60 * 60 * 1000,
  };
  res.cookie('refreshToken', user.refreshToken, option);

  return res.success(200, { user, accessToken }, 'User login successfully');
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    return res.error(401, 'User not found');
  }
  return res.success(200, user, 'User login successfully');
});

const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.error(400, 'Token is required');
  }

  const googleUser = await verifyGoogleToken(token);
  if (!googleUser) {
    return res.error(401, null, 'Invalid token');
  }

  const { sub: googleId, email, given_name: firstName, family_name: lastName } = googleUser;

  let user = await User.findOne({ googleId });
  // If user not found by google_id, check by email
  if (!user) {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.password) {
      return res.success(
        200,
        null,
        'User already exists with this email. Please login with email and password'
      );
    }
    const username = email.split('@')[0];

    // Create new user
    user = await User.create({
      firstName,
      lastName,
      username,
      googleId,
      email,
    });
  }
  const accessToken = generateAccessToken(user);
  return res.success(
    200,
    {
      user,
      accessToken,
    },
    'User logged in successfully'
  );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.error(404, 'User not found');
  }

  if (user.googleId) {
    return res.error(400, 'Login with google account');
  }

  const resetToken = jwt.sign({ userId: user._id }, appConfig.jwtSecret, {
    expiresIn: '1h',
  });

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  await forgotPasswordEmail(email, resetToken);

  res.success(200, null, 'Password reset email sent');
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  let decoded;
  decoded = jwt.verify(token, appConfig.jwtSecret);
  const user = await User.findOne({
    _id: decoded.userId,
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.error(401, 'Invalid or expired token');
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return res.success(200, null, 'Password reset successfully');
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.error(401, 'Refresh token is required');
  }
  const decoded = jwt.verify(refreshToken, appConfig.jwtSecret);
  if (!decoded) {
    return res.error(401, 'Invalid refresh token');
  }
  const user = await User.findById(decoded._id).select('+refreshToken');
  if (!user) {
    return res.error(401, 'User not found');
  }
  if (user.refreshToken !== refreshToken) {
    return res.error(401, 'Invalid refresh token');
  }
  const accessToken = generateAccessToken(user);
  return res.success(200, { accessToken }, 'Access token refreshed');
});

export {
  emailExist,
  verifyOtp,
  createUser,
  loginUser,
  getCurrentUser,
  googleLogin,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
};
