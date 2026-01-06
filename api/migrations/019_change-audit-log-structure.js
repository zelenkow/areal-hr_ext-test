exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE audit_log
    DROP COLUMN field_name,
    DROP COLUMN old_value,
    DROP COLUMN new_value
  `);

  pgm.sql(`
    ALTER TABLE audit_log 
    ADD COLUMN old_data JSONB,
    ADD COLUMN new_data JSONB
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE audit_log 
    DROP COLUMN old_data,
    DROP COLUMN new_data
  `);

  pgm.sql(`
    ALTER TABLE audit_log 
    ADD COLUMN field_name VARCHAR(100),
    ADD COLUMN old_value TEXT,
    ADD COLUMN new_value TEXT
  `);
};
