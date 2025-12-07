import * as Joi from 'joi';

export const CreateAuditLogSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  entity_type: Joi.string().trim().min(1).max(50).required(),
  entity_id: Joi.number().integer().positive().required(),
  field_name: Joi.string().trim().min(1).max(100).required(),
  old_value: Joi.string().trim().allow('').required(),
  new_value: Joi.string().trim().min(1).required(),
});
