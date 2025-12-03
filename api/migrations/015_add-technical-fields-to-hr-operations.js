exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE hr_operations
    ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN deleted_at TIMESTAMPTZ NULL;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE hr_operations
    DROP COLUMN updated_at,
    DROP COLUMN deleted_at;
  `);
};
