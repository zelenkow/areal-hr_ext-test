import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Department } from './interfaces/department.interface';
import { DatabaseService } from '../../database/database.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { CreateDepartmentSchema } from './schemas/create-department.schema';
import { UpdateDepartmentSchema } from './schemas/update-department.schema';

@Injectable()
export class DepartmentsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Department[]> {
    const query = `
      SELECT id, organization_id, name, parent_id, comment, created_at, deleted_at, updated_at
      FROM departments 
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `;
    const result = await this.databaseService.query(query);
    return result.rows as Department[];
  }

  async findOne(id: number): Promise<Department> {
    const query = `
      SELECT id, organization_id, name, parent_id, comment, created_at, deleted_at, updated_at
      FROM departments 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await this.databaseService.query(query, [id]);
    return result.rows[0] as Department;
  }

  async findByOrganization(organizationId: number): Promise<Department[]> {
    const query = `
      SELECT id, organization_id, name, parent_id, comment, created_at, deleted_at, updated_at
      FROM departments 
      WHERE organization_id = $1 AND deleted_at IS NULL
      ORDER BY name ASC
    `;

    const result = await this.databaseService.query(query, [organizationId]);
    return result.rows as Department[];
  }

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const { error, value } =
      CreateDepartmentSchema.validate(createDepartmentDto);

    if (error) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }

    const query = `
      INSERT INTO departments (organization_id, name, parent_id, comment) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, organization_id, name, parent_id, comment, created_at, deleted_at, updated_at
    `;

    try {
      const result = await this.databaseService.query(query, [
        value.organization_id,
        value.name,
        value.parent_id,
        value.comment,
      ]);
      return result.rows[0] as Department;
    } catch {
      throw new InternalServerErrorException('Failed to create department');
    }
  }

  async update(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const { error, value } =
      UpdateDepartmentSchema.validate(updateDepartmentDto);

    if (error) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }

    const current = await this.findOne(id);

    const changes = this.findChanges(current, value);

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
      RETURNING id, organization_id, name, parent_id, comment, created_at, deleted_at, updated_at 
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
      RETURNING id, organization_id, name, parent_id, comment, created_at, deleted_at, updated_at
    `;

    return { query, values };
  }
}
