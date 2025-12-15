import * as Joi from 'joi';

export const CreateUserSchema = Joi.object({
  last_name: Joi.string().trim().min(1).max(100).required(),
  first_name: Joi.string().trim().min(1).max(100).required(),
  middle_name: Joi.string().trim().min(1).max(100).required(),
  login: Joi.string().trim().min(1).max(50).required(),
  password_hash: Joi.string().trim().min(1).max(255).required(),
  role: Joi.string().valid('admin', 'manager').required(),
});
