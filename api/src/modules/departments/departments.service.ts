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
      SELECT id, organization_id, name, parent_id, comment, created_at, updated_at
      FROM departments 
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `;

    try {
      const result = await this.databaseService.query(query);

      return result.rows as Department[];
    } catch {
      throw new InternalServerErrorException('Failed to fetch departments');
    }
  }

  async findOne(id: number): Promise<Department> {
    const query = `
      SELECT id, organization_id, name, parent_id, comment, created_at, updated_at
      FROM departments 
      WHERE id = $1 AND deleted_at IS NULL
    `;

    try {
      const result = await this.databaseService.query(query, [id]);

      return result.rows[0] as Department;
    } catch {
      throw new InternalServerErrorException('Failed to fetch department');
    }
  }

  async findByOrganization(organizationId: number): Promise<Department[]> {
    const query = `
      SELECT id, organization_id, name, parent_id, comment, created_at, updated_at
      FROM departments 
      WHERE organization_id = $1 AND deleted_at IS NULL
      ORDER BY name ASC
    `;

    try {
      const result = await this.databaseService.query(query, [organizationId]);
      return result.rows as Department[];
    } catch {
      throw new InternalServerErrorException(
        'Failed to fetch departments by organization',
      );
    }
  }

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const query = `
      INSERT INTO departments (organization_id, name, parent_id, comment) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, organization_id, name, parent_id, comment, created_at, updated_at
    `;

    try {
      const result = await this.databaseService.query(query, [
        createDepartmentDto.organization_id,
        createDepartmentDto.name,
        createDepartmentDto.parent_id,
        createDepartmentDto.comment,
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
    const query = `
      UPDATE departments 
      SET name = $1, comment = $2
      WHERE id = $3
      RETURNING id, organization_id, name, parent_id, comment, created_at, updated_at
    `;

    try {
      const result = await this.databaseService.query(query, [
        updateDepartmentDto.name,
        updateDepartmentDto.comment,
        id,
      ]);
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
      RETURNING id, organization_id, name, parent_id, comment, created_at, updated_at
    `;

    try {
      const result = await this.databaseService.query(query, [id]);
      return result.rows[0] as Department;
    } catch {
      throw new InternalServerErrorException('Failed to delete department');
    }
  }
}
