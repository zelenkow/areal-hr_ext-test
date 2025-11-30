import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Organization } from './interfaces/organization.interface';
import { DatabaseService } from '../../database/database.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { CreateOrganizationSchema } from './schemas/create-organization.schema';
import { UpdateOrganizationSchema } from './schemas/update-organization.schema';

@Injectable()
export class OrganizationsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Organization[]> {
    const query = `
      SELECT id, name, comment, created_at, updated_at
      FROM organizations 
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `;
    const result = await this.databaseService.query(query);
    return result.rows as Organization[];
  }

  async findOne(id: number): Promise<Organization> {
    const query = `
      SELECT id, name, comment, created_at, updated_at
      FROM organizations 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await this.databaseService.query(query, [id]);
    return result.rows[0] as Organization;
  }

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const { error } = CreateOrganizationSchema.validate(createOrganizationDto);
    if (error) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }
    const query = `
      INSERT INTO organizations (name, comment) 
      VALUES ($1, $2) 
      RETURNING id, name, comment, created_at, updated_at
    `;

    try {
      const result = await this.databaseService.query(query, [
        createOrganizationDto.name,
        createOrganizationDto.comment,
      ]);
      return result.rows[0] as Organization;
    } catch {
      throw new InternalServerErrorException('Failed to create organization');
    }
  }

  async update(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const { error } = UpdateOrganizationSchema.validate(updateOrganizationDto);
    if (error) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }
    const query = `
      UPDATE organizations 
      SET name = $1, comment = $2 
      WHERE id = $3
      RETURNING id, name, comment, created_at, updated_at
    `;

    try {
      const result = await this.databaseService.query(query, [
        updateOrganizationDto.name,
        updateOrganizationDto.comment,
        id,
      ]);
      return result.rows[0] as Organization;
    } catch {
      throw new InternalServerErrorException('Failed to update organization');
    }
  }

  async remove(id: number): Promise<Organization> {
    const query = `
      UPDATE organizations 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = $1
      RETURNING id, name, comment, created_at, updated_at, deleted_at
    `;
    try {
      const result = await this.databaseService.query(query, [id]);
      return result.rows[0] as Organization;
    } catch {
      throw new InternalServerErrorException('Failed to delete organization');
    }
  }
}
