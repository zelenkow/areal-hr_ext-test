import * as Joi from 'joi';

export const UpdateEmployeeSchema = Joi.object({
  last_name: Joi.string().trim().min(1).max(100).optional(),
  first_name: Joi.string().trim().min(1).max(100).optional(),
  middle_name: Joi.string().trim().min(1).max(100).optional(),
  birth_date: Joi.string()
    .pattern(/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/)
    .optional(),
  passport_series: Joi.string().length(4).optional(),
  passport_number: Joi.string().length(6).optional(),
  passport_issue_date: Joi.string()
    .pattern(/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/)
    .optional(),
  passport_issue_code: Joi.string().length(7).optional(),
  passport_issued_by: Joi.string().trim().min(1).max(500).optional(),
  registration_region: Joi.string().trim().min(1).max(100).optional(),
  registration_city: Joi.string().trim().min(1).max(100).optional(),
  registration_street: Joi.string().trim().min(1).max(200).optional(),
  registration_house: Joi.string().trim().min(1).max(20).optional(),
  registration_building: Joi.string().trim().allow('').optional(),
  registration_apartment: Joi.string().trim().allow('').optional(),
});
