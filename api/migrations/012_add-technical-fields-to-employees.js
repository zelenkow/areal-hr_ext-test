exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE employees
    ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE employees 
    DROP COLUMN updated_at;
  `);
};
