import * as Joi from 'joi';

export const UpdatePositionSchema = Joi.object({
  name: Joi.string().min(1).required(),
}).unknown(true);
