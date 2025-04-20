import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required',
  }),

  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password is required',
  }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
