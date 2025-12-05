exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE employees 
    ALTER COLUMN birth_date TYPE VARCHAR(10),
    ALTER COLUMN passport_issue_date TYPE VARCHAR(10);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE employees
    ALTER COLUMN birth_date TYPE DATE,
    ALTER COLUMN passport_issue_date TYPE DATE;
  `);
};
