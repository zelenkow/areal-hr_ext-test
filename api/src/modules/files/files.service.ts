import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { File } from './interfaces/file.interface';
import { DatabaseService } from '../../database/database.service';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FilesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmployeeId(employeeId: number): Promise<File[]> {
    const query = `
      SELECT * 
      FROM files 
      WHERE employee_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;

    const result = await this.databaseService.query<File>(query, [employeeId]);
    return result.rows;
  }

  async findOne(id: number): Promise<File> {
    const query = `
      SELECT * 
      FROM files 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await this.databaseService.query<File>(query, [id]);
    return result.rows[0];
  }

  async create(
    validatedDto: CreateFileDto & {
      file_path: string;
    },
  ): Promise<File> {
    const query = `
      INSERT INTO files (employee_id, name, file_path) 
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    try {
      const result = await this.databaseService.query<File>(query, [
        validatedDto.employee_id,
        validatedDto.name,
        validatedDto.file_path,
      ]);
      return result.rows[0];
    } catch {
      throw new InternalServerErrorException('Failed to create file');
    }
  }

  async remove(id: number): Promise<File> {
    const query = `
      UPDATE files 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = $1
      RETURNING *
    `;
    try {
      const result = await this.databaseService.query<File>(query, [id]);
      return result.rows[0];
    } catch {
      throw new InternalServerErrorException('Failed to delete file');
    }
  }
}
