import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    const result = await this.databaseService.query(`
      SELECT id, name, comment, created_at 
      FROM organizations 
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `);
    return result.rows;
  }

  async create(createOrganizationDto: CreateOrganizationDto) {
    const result = await this.databaseService.query(`
      INSERT INTO organizations (name, comment) 
      VALUES ($1, $2) 
      RETURNING id, name, comment, created_at
    `, [createOrganizationDto.name, createOrganizationDto.comment]);
    
    return result.rows[0];
  }
}