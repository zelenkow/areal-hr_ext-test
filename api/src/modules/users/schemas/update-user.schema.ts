import * as Joi from 'joi';

export const UpdateUserSchema = Joi.object({
  last_name: Joi.string().trim().min(1).max(100).optional(),
  first_name: Joi.string().trim().min(1).max(100).optional(),
  middle_name: Joi.string().trim().min(1).max(100).optional(),
  login: Joi.string().trim().min(1).max(50).optional(),
  role: Joi.string().valid('admin', 'manager').optional(),
});
