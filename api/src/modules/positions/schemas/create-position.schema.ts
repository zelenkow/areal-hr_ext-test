import * as Joi from 'joi';

export const CreatePositionSchema = Joi.object({
  name: Joi.string().min(1).required(),
});
