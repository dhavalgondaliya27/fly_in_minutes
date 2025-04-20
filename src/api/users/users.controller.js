import { generateToken } from '../../utils/jwt.js';
import { createUserSchema, loginUserSchema } from './user.validator.js';
import { User } from './users.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const createUser = asyncHandler(async (req, res) => {
  const { error } = createUserSchema.validate(req.body);

  if (error) {
    return res.error(400, error.message);
  }
  const { email, password } = req.body;
  const username = email.split('@')[0];
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.error(400, 'Username or email already exists');
  }

  const user = await User.create({
    username,
    email,
    password,
  });
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

export { createUser, loginUser, getCurrentUser };
