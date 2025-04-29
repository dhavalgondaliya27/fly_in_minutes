import { generateToken } from '../../utils/jwt.js';
import { createUserSchema, loginUserSchema } from './user.validator.js';
import { User } from './users.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import verifyGoogleToken from '../../services/google.js';

const emailExist = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  if (!email) {
    return res.error(400, 'Email is required');
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    if (userExist.google_id !== null) {
      return res.success(200, null, 'Email already exists, please login with google');
    } else if (userExist.password) {
      return res.success(200, null, 'Please Enter Password');
    } else {
      userExist.otp = otp;
      userExist.otpExpiration = Date.now() + 1000 * 60 * 5;
      await userExist.save();
      //send email
      // await sendEmail(email, otp);
      return res.success(200, null, 'Otp sent successfully');
    }
  }
  await User.create({
    email,
    otp,
    otpExpiration: Date.now() + 1000 * 60 * 5,
  });
  //send email
  // await sendEmail(email, otp);
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
  const accessToken = generateToken(user);
  return res.success(200, { accessToken }, 'Otp verified successfully');
});

const createUser = asyncHandler(async (req, res) => {
  const { error } = createUserSchema.validate(req.body);

  if (error) {
    return res.error(400, error.message);
  }
  const userId = req.user._id;
  const { firstName, lastName, email, DOB, password } = req.body;
  const username = email.split('@')[0];
  const user = await User.findById(userId);
  if (!user) {
    return res.error(404, 'User not found');
  }
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.DOB = DOB;
  user.password = password;
  user.username = username;

  await user.save();
  return res.success(200, user, 'User create successfully');
});

const loginUser = asyncHandler(async (req, res) => {
  const { error } = loginUserSchema.validate(req.body);
  if (error) {
    return res.error(400, error.message);
  }

  const { email, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: email }, { username: email }],
  });

  if (!user) {
    return res.error(404, 'User not found');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.error(400, 'Please enter valid password');
  }

  const accessToken = generateToken(user);

  return res.success(200, { user, accessToken }, 'User login successfully');
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
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
  
  const accessToken = generateToken(user);
  return res.success(
    200,
    {
      user,
      accessToken,
    },
    'User logged in successfully'
  );
});

export { emailExist, verifyOtp, createUser, loginUser, getCurrentUser, googleLogin };
