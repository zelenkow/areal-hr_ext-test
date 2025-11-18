export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      last_name VARCHAR(100) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      middle_name VARCHAR(100),
      login VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMPTZ NULL
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`DROP TABLE users;`);
};