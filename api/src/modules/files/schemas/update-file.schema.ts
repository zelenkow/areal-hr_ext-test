import * as Joi from 'joi';

export const UpdateFileSchema = Joi.object({
  employee_id: Joi.number().min(1).optional(),
  name: Joi.string().trim().min(1).max(255).optional(),
  file_path: Joi.string().trim().min(1).max(500).optional(),
});
