exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE users
    ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE users 
    DROP COLUMN updated_at;
  `);
};
