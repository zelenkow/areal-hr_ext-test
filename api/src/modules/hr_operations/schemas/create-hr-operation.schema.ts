import * as Joi from 'joi';

export const CreateHrOperationSchema = Joi.object({
  employee_id: Joi.number().integer().positive().required(),
  type: Joi.string()
    .valid('hire', 'transfer', 'salary_change', 'dismissal')
    .required(),

  department_id: Joi.number()
    .integer()
    .positive()
    .when('type', {
      is: Joi.valid('hire', 'transfer'),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),

  position_id: Joi.number()
    .integer()
    .positive()
    .when('type', {
      is: Joi.valid('hire'),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),

  salary: Joi.number()
    .precision(2)
    .positive()
    .when('type', {
      is: Joi.valid('hire', 'salary_change'),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
});
