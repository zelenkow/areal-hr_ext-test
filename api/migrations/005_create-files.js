export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE files (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER NOT NULL,
      name VARCHAR(255) NOT NULL,
      file_path VARCHAR(500) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMPTZ NULL,
      
      CONSTRAINT fk_files_employee 
        FOREIGN KEY (employee_id) REFERENCES employees(id)
        ON DELETE RESTRICT
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`DROP TABLE files;`);
};