import * as Joi from 'joi';

export const UpdateHrOperationSchema = Joi.object({
  type: Joi.string().valid('hire', 'dismissal').optional(),
  department_id: Joi.number().integer().positive().allow(null).optional(),
  position_id: Joi.number().integer().positive().allow(null).optional(),
  salary: Joi.number().precision(2).positive().allow(null).optional(),
});
