import * as Joi from 'joi';

export const CreateHrOperationSchema = Joi.object({
  employee_id: Joi.number().integer().positive().required(),
  type: Joi.string().valid('hire').required(),
  department_id: Joi.number().integer().positive().required(),
  position_id: Joi.number().integer().positive().required(),
  salary: Joi.number().precision(2).positive().required(),
});
