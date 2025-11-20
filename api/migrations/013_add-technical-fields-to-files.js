exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE files
    ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE files 
    DROP COLUMN updated_at;
  `);
};
