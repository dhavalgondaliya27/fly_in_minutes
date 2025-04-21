import Joi from 'joi';

export const createUserSchema = Joi.object({
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  email: Joi.string().email().lowercase().trim().optional(),
  DOB: Joi.date().optional(),
  password: Joi.string().min(6).required().messages({
    'any.required': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
  }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
