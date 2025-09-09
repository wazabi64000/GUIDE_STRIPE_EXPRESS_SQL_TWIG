import Joi from "joi";

export const addToCartSchema = Joi.object({
  productId: Joi.number().integer().min(1).required(),
  quantity: Joi.number().integer().min(1).max(10).required(),
});
