import * as Joi from 'joi';

export const CreateDepartmentSchema = Joi.object({
  organization_id: Joi.number().min(1).required(),
  name: Joi.string().min(1).required(),
  parent_id: Joi.number().allow('').optional(),
  comment: Joi.string().allow('').optional(),
});
