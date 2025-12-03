exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE hr_operations (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER NOT NULL,
      type VARCHAR(20) NOT NULL,
      department_id INTEGER,
      position_id INTEGER,
      salary DECIMAL(10,2),
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      
      CONSTRAINT fk_hr_operations_employee 
        FOREIGN KEY (employee_id) REFERENCES employees(id)
        ON DELETE RESTRICT,
      CONSTRAINT fk_hr_operations_department 
        FOREIGN KEY (department_id) REFERENCES departments(id)
        ON DELETE RESTRICT,
      CONSTRAINT fk_hr_operations_position 
        FOREIGN KEY (position_id) REFERENCES positions(id)
        ON DELETE RESTRICT
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE hr_operations;`);
};
