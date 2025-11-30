import * as Joi from 'joi';

export const UpdateOrganizationSchema = Joi.object({
  name: Joi.string().min(1).required(),
  comment: Joi.string().allow('').optional(),
}).unknown(true);
