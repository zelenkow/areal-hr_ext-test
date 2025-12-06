import * as Joi from 'joi';

export const CreateFileSchema = Joi.object({
  employee_id: Joi.number().min(1).required(),
  name: Joi.string().trim().min(1).max(255).required(),
  file_path: Joi.string().trim().min(1).max(500).required(),
});
