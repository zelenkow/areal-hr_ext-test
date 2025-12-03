exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE organizations 
    ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE organizations 
    DROP COLUMN updated_at;
  `);
};
