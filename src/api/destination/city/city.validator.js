import Joi from "joi";

export const createCitySchema = Joi.object({
  city_name: Joi.string().required(),
  category_id: Joi.array().items(Joi.string()).required(),
  destination_id: Joi.string().required(),
});

export const updateCitySchema = Joi.object({
  city_name: Joi.string().optional(),
  category_id: Joi.array().items(Joi.string()).optional(),
  destination_id: Joi.string().optional(),
});