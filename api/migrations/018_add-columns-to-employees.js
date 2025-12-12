exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE employees 
    ADD COLUMN hr_status VARCHAR(20) NOT NULL DEFAULT 'NOT_HIRED',
    ADD COLUMN current_department_id INTEGER NULL,
    ADD COLUMN current_position_id INTEGER NULL,
    ADD COLUMN current_salary NUMERIC(10,2) NULL;
    ALTER TABLE employees 
    ADD CONSTRAINT check_hr_status 
    CHECK (hr_status IN ('NOT_HIRED', 'ACTIVE', 'DISMISSED'));
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE employees
    DROP CONSTRAINT IF EXISTS check_hr_status,
    DROP COLUMN IF EXISTS current_salary,
    DROP COLUMN IF EXISTS current_position_id,
    DROP COLUMN IF EXISTS current_department_id,
    DROP COLUMN IF EXISTS hr_status;
  `);
};
