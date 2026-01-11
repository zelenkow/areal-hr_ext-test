import * as Joi from 'joi';

export const CreateAuditLogSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  entity_type: Joi.string().trim().min(1).max(50).required(),
  entity_id: Joi.number().integer().positive().required(),
  old_data: Joi.object().optional(),
  new_data: Joi.object().required(),
});
