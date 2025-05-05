import Joi from "joi";

export const createDestinationSchema = Joi.object({
  destination_name: Joi.string().required()
});