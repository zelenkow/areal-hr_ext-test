import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { File } from './interfaces/file.interface';
import { DatabaseService } from '../../database/database.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { buildUpdateQuery } from '../../common/query.helper';

@Injectable()
export class FilesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<File[]> {
    const query = `
      SELECT * 
      FROM files 
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    const result = await this.databaseService.query(query);
    return result.rows as File[];
  }

  async findOne(id: number): Promise<File> {
    const query = `
      SELECT * 
      FROM files 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await this.databaseService.query(query, [id]);
    return result.rows[0] as File;
  }

  async create(validatedDto: CreateFileDto): Promise<File> {
    const query = `
      INSERT INTO files (employee_id, name, file_path) 
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    try {
      const result = await this.databaseService.query(query, [
        validatedDto.employee_id,
        validatedDto.name,
        validatedDto.file_path,
      ]);
      return result.rows[0] as File;
    } catch {
      throw new InternalServerErrorException('Failed to create file');
    }
  }

  async update(id: number, validatedDto: UpdateFileDto): Promise<File> {
    const current = await this.findOne(id);
    const changes = this.findChanges(current, validatedDto);

    if (Object.keys(changes).length === 0) {
      return current;
    }

    const { query, values } = buildUpdateQuery('files', changes, id);

    try {
      const result = await this.databaseService.query(query, values);
      return result.rows[0] as File;
    } catch {
      throw new InternalServerErrorException('Failed to update file');
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
      const result = await this.databaseService.query(query, [id]);
      return result.rows[0] as File;
    } catch {
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  private findChanges(
    current: File,
    value: UpdateFileDto,
  ): Partial<UpdateFileDto> {
    const changes: Partial<UpdateFileDto> = {};

    if (
      value.employee_id !== undefined &&
      value.employee_id !== current.employee_id
    ) {
      changes.employee_id = value.employee_id;
    }

    if (value.name !== undefined && value.name !== current.name) {
      changes.name = value.name;
    }

    if (
      value.file_path !== undefined &&
      value.file_path !== current.file_path
    ) {
      changes.file_path = value.file_path;
    }

    return changes;
  }
}
