import Joi from "joi";

export const createCategorySchema = Joi.object({
  category_name: Joi.string().required(),
  parent_category_id: Joi.string().optional(),
  category_photo: Joi.array().items(Joi.string()).optional(),
});

export const updateCategorySchema = Joi.object({
  category_name: Joi.string().optional(),
  parent_category_id: Joi.string().optional(),
  category_photo: Joi.array().items(Joi.string()).optional(),
});
