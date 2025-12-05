import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Department } from './interfaces/department.interface';
import { DatabaseService } from '../../database/database.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Department[]> {
    const query = `
      SELECT *
      FROM departments 
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `;
    const result = await this.databaseService.query(query);
    return result.rows as Department[];
  }

  async findOne(id: number): Promise<Department> {
    const query = `
      SELECT *
      FROM departments 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await this.databaseService.query(query, [id]);
    return result.rows[0] as Department;
  }

  async create(validateDto: CreateDepartmentDto): Promise<Department> {
    const query = `
      INSERT INTO departments (organization_id, name, parent_id, comment) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;

    try {
      const result = await this.databaseService.query(query, [
        validateDto.organization_id,
        validateDto.name,
        validateDto.parent_id,
        validateDto.comment,
      ]);
      return result.rows[0] as Department;
    } catch {
      throw new InternalServerErrorException('Failed to create department');
    }
  }

  async update(
    id: number,
    validateDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const current = await this.findOne(id);

    const changes = this.findChanges(current, validateDto);

    if (Object.keys(changes).length === 0) {
      return current;
    }

    const { query, values } = this.buildUpdateQuery(changes, id);

    try {
      const result = await this.databaseService.query(query, values);
      return result.rows[0] as Department;
    } catch {
      throw new InternalServerErrorException('Failed to update department');
    }
  }

  async remove(id: number): Promise<Department> {
    const query = `
      UPDATE departments 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = $1
      RETURNING *
    `;

    try {
      const result = await this.databaseService.query(query, [id]);
      return result.rows[0] as Department;
    } catch {
      throw new InternalServerErrorException('Failed to delete department');
    }
  }

  private findChanges(
    current: Department,
    value: UpdateDepartmentDto,
  ): Partial<UpdateDepartmentDto> {
    const changes: Partial<UpdateDepartmentDto> = {};

    if (value.name !== undefined && value.name !== current.name) {
      changes.name = value.name;
    }

    if (value.comment !== undefined && value.comment !== current.comment) {
      changes.comment = value.comment;
    }

    return changes;
  }

  private buildUpdateQuery(
    changes: Partial<UpdateDepartmentDto>,
    id: number,
  ): { query: string; values: (string | number)[] } {
    const fields: string[] = [];
    const values: (string | number)[] = [];
    let paramIndex = 1;

    if (changes.name !== undefined) {
      fields.push(`name = $${paramIndex}`);
      values.push(changes.name);
      paramIndex++;
    }

    if (changes.comment !== undefined) {
      fields.push(`comment = $${paramIndex}`);
      values.push(changes.comment);
      paramIndex++;
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE departments 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    return { query, values };
  }
}
