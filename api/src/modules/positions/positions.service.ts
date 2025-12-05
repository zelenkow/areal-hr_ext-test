import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Position } from './interfaces/position.interface';
import { DatabaseService } from '../../database/database.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
export class PositionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Position[]> {
    const query = `
      SELECT *
      FROM positions 
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `;
    const result = await this.databaseService.query(query);
    return result.rows as Position[];
  }

  async findOne(id: number): Promise<Position> {
    const query = `
      SELECT *
      FROM positions 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await this.databaseService.query(query, [id]);
    return result.rows[0] as Position;
  }

  async create(validateDto: CreatePositionDto): Promise<Position> {
    const query = `
      INSERT INTO positions (name) 
      VALUES ($1) 
      RETURNING *
    `;

    try {
      const result = await this.databaseService.query(query, [
        validateDto.name,
      ]);
      return result.rows[0] as Position;
    } catch {
      throw new InternalServerErrorException('Failed to create position');
    }
  }

  async update(id: number, validateDto: UpdatePositionDto): Promise<Position> {
    const current = await this.findOne(id);

    const changes = this.findChanges(current, validateDto);

    if (Object.keys(changes).length === 0) {
      return current;
    }

    const { query, values } = this.buildUpdateQuery(changes, id);

    try {
      const result = await this.databaseService.query(query, values);
      return result.rows[0] as Position;
    } catch {
      throw new InternalServerErrorException('Failed to update position');
    }
  }

  async remove(id: number): Promise<Position> {
    const query = `
      UPDATE positions 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = $1
      RETURNING *
    `;

    try {
      const result = await this.databaseService.query(query, [id]);
      return result.rows[0] as Position;
    } catch {
      throw new InternalServerErrorException('Failed to delete position');
    }
  }

  private findChanges(
    current: Position,
    value: UpdatePositionDto,
  ): Partial<UpdatePositionDto> {
    const changes: Partial<UpdatePositionDto> = {};

    if (value.name !== undefined && value.name !== current.name) {
      changes.name = value.name;
    }

    return changes;
  }

  private buildUpdateQuery(
    changes: Partial<UpdatePositionDto>,
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

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE positions
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    return { query, values };
  }
}
