export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE employees (
      id SERIAL PRIMARY KEY,
      last_name VARCHAR(100) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      middle_name VARCHAR(100),
      birth_date DATE NOT NULL,
      passport_series VARCHAR(4) NOT NULL,
      passport_number VARCHAR(6) NOT NULL,
      passport_issue_date DATE NOT NULL,
      passport_issue_code VARCHAR(7) NOT NULL,
      passport_issued_by VARCHAR(500) NOT NULL,
      registration_region VARCHAR(100) NOT NULL,
      registration_city VARCHAR(100) NOT NULL,
      registration_street VARCHAR(200) NOT NULL,
      registration_house VARCHAR(20) NOT NULL,
      registration_building VARCHAR(20),
      registration_apartment VARCHAR(20),
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMPTZ NULL
    );   
  `);
};

export const down = (pgm) => {
  pgm.sql(`DROP TABLE employees;`);
};