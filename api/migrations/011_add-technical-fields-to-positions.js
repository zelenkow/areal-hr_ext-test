exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE positions 
    ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE positions  
    DROP COLUMN updated_at;
  `);
};