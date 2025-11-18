exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE audit_log (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      entity_type VARCHAR(50) NOT NULL,
      entity_id INTEGER NOT NULL,
      field_name VARCHAR(100) NOT NULL,
      old_value TEXT,
      new_value TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      
      CONSTRAINT fk_audit_log_user 
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE RESTRICT
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE audit_log;`);
};