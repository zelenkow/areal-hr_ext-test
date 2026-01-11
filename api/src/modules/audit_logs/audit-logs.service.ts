import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuditLog } from './interfaces/audit-log.interface';
import { DatabaseService } from '../../database/database.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@Injectable()
export class AuditLogsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<AuditLog[]> {
    const query = `
      SELECT * 
      FROM audit_log 
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    const result = await this.databaseService.query<AuditLog>(query);
    return result.rows;
  }

  async findOne(id: number): Promise<AuditLog> {
    const query = `
      SELECT * 
      FROM audit_log 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await this.databaseService.query<AuditLog>(query, [id]);
    return result.rows[0];
  }

  async create(validatedDto: CreateAuditLogDto): Promise<AuditLog> {
    const query = `
      INSERT INTO audit_log (
        user_id, 
        entity_type, 
        entity_id, 
        field_name, 
        old_value, 
        new_value
      ) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    try {
      const result = await this.databaseService.query<AuditLog>(query, [
        validatedDto.user_id,
        validatedDto.entity_type,
        validatedDto.entity_id,
        validatedDto.field_name,
        validatedDto.old_value,
        validatedDto.new_value,
      ]);
      return result.rows[0];
    } catch {
      throw new InternalServerErrorException('Failed to create audit log');
    }
  }

  async log(data: any): Promise<void> {
    const query = `
      INSERT INTO audit_log (
        user_id,  
        entity_type, 
        entity_id,
        old_data, 
        new_data
      ) 
      VALUES ($1, $2, $3, $4, $5)
    `;

    const params = [
      data.user_id,
      data.entity_type,
      data.entity_id,
      data.old_data ? JSON.stringify(data.old_data) : null,
      JSON.stringify(data.new_data),
    ];

    await this.databaseService.query(query, params);
  }

  async findOneWithDiff(id: number): Promise<any> {
    const log = await this.findOne(id);

    const changes = this.calculateDiff(log.old_data, log.new_data);

    return { changes };
  }

  private calculateDiff(oldData: any, newData: any): any[] {
    const changes = [];

    if (!oldData && newData) {
      for (const field in newData) {
        changes.push({
          field: field,
          old: '',
          new: newData[field],
        });
      }
      return changes;
    }

    if (oldData && newData) {
      const allFields = new Set([
        ...Object.keys(oldData || {}),
        ...Object.keys(newData || {}),
      ]);

      for (const field of allFields) {
        const oldValue = oldData[field];
        const newValue = newData[field];

        if (oldValue !== newValue) {
          changes.push({
            field: field,
            old: oldValue,
            new: newValue,
          });
        }
      }
    }

    return changes;
  }
}
