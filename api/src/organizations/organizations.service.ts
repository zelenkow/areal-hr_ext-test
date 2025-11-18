import { Injectable} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    const query = `
      SELECT id, name, comment, created_at
      FROM organizations 
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `;
    
    const result = await this.databaseService.query(query);
    return result.rows;
  }

  async findOne(id: number) {
    const query = `
      SELECT id, name, comment, created_at
      FROM organizations 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    
    const result = await this.databaseService.query(query, [id]);
    return result.rows[0];
  }

  async create(createOrganizationDto: CreateOrganizationDto) {
    const query = `
      INSERT INTO organizations (name, comment) 
      VALUES ($1, $2) 
      RETURNING id, name, comment, created_at
    `;
    
    const result = await this.databaseService.query(query, [
      createOrganizationDto.name, 
      createOrganizationDto.comment
    ]);
    
    return result.rows[0];
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    const query = `
      UPDATE organizations 
      SET name = $1, comment = $2 
      WHERE id = $3
      RETURNING id, name, comment
    `;
    
    const result = await this.databaseService.query(query, [
      updateOrganizationDto.name,
      updateOrganizationDto.comment, 
      id
    ]);
    
    return result.rows[0];
  }

  async remove(id: number) {
    const query = `
      UPDATE organizations 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = $1
      RETURNING id, name
    `;
    
    const result = await this.databaseService.query(query, [id]);
    return { deletedId: result.rows[0].id };
  }
}