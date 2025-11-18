exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE organizations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      comment TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMPTZ NULL
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE organizations;`);
};

