exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE departments (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      comment TEXT,
      organization_id INTEGER NOT NULL,
      parent_id INTEGER NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMPTZ NULL,
      
      CONSTRAINT fk_departments_organization 
        FOREIGN KEY (organization_id) REFERENCES organizations(id)
        ON DELETE RESTRICT,
      CONSTRAINT fk_departments_parent 
        FOREIGN KEY (parent_id) REFERENCES departments(id)
        ON DELETE RESTRICT
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE departments;`);
};
