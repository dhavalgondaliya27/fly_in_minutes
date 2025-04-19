import { User } from './users.model';
import { asyncHandler } from '../../utils/asyncHandler.js';



//joi validation
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

//user login
const loginUser = asyncHandler(async (req, res) => {
  const { error } = loginSchema?.validate(req.body);
  if (error) {
    return res.status(400).json(new ApiError(400, null, error.message));
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json(new ApiError(404, null, 'User does not exist'));
  }
  if (user.password === undefined) {
    return res.status(404).json(new ApiError(404, null, 'login with google'));
  }
  const isPasswordValid = await bcryptjs.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json(new ApiError(401, null, 'Password is incorrect'));
  }

  // const hashedPassword = await bcrypt.hash(password, 10);
  // console.log(hashedPassword)
  await user.save();
  let tokens;
  try {
    tokens = await generateAccessToken(user?.email, user?.password);
  } catch (error) {
    res.status(500).json(new ApiError(500, error, 'Failed to generate access token'));
  }
  const { access_token, refresh_token } = tokens;
  // const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refresh_token;
  await user.save();

  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken -resetPasswordToken -resetPasswordExpires -otp -otpExpiration'
  );
  const successResponse = new ApiResponse(
    200,
    {
      user: loggedInUser,
      accessToken: access_token,
      refreshToken: refresh_token,
    },
    'User logged in successfully'
  );

  const hundredYears = 100 * 365 * 24 * 60 * 60 * 1000;

  const options = {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: hundredYears,
  };

  return res
    .header('Authorization', access_token)
    .cookie('refreshToken', refresh_token, options)
    .json(successResponse);
});

export { loginUser };
