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
      SELECT id, name, comment, created_at, deleted_at, updated_at
      FROM organizations 
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `;
    const result = await this.databaseService.query(query);
    return result.rows as Organization[];
  }

  async findOne(id: number): Promise<Organization> {
    const query = `
      SELECT id, name, comment, created_at, deleted_at, updated_at
      FROM organizations 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await this.databaseService.query(query, [id]);
    return result.rows[0] as Organization;
  }

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const { error, value } = CreateOrganizationSchema.validate(
      createOrganizationDto,
    );

    if (error) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }

    const query = `
      INSERT INTO organizations (name, comment) 
      VALUES ($1, $2) 
      RETURNING id, name, comment, created_at, deleted_at, updated_at
    `;

    try {
      const result = await this.databaseService.query(query, [
        value.name,
        value.comment,
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
    const { error, value } = UpdateOrganizationSchema.validate(
      updateOrganizationDto,
    );

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
      RETURNING id, name, comment, created_at, deleted_at, updated_at
    `;
    try {
      const result = await this.databaseService.query(query, [id]);
      return result.rows[0] as Organization;
    } catch {
      throw new InternalServerErrorException('Failed to delete organization');
    }
  }

  private findChanges(
    current: Organization,
    value: UpdateOrganizationDto,
  ): Partial<UpdateOrganizationDto> {
    const changes: Partial<UpdateOrganizationDto> = {};

    if (value.name !== undefined && value.name !== current.name) {
      changes.name = value.name;
    }

    if (value.comment !== undefined && value.comment !== current.comment) {
      changes.comment = value.comment;
    }
    return changes;
  }

  private buildUpdateQuery(
    changes: Partial<UpdateOrganizationDto>,
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
      UPDATE organizations 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, name, comment, created_at, deleted_at, updated_at
    `;
    return { query, values };
  }
}
