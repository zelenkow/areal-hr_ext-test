exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE departments 
    ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE departments  
    DROP COLUMN updated_at;
  `);
};