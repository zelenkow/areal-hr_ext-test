import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Position } from './interfaces/position.interface';
import { DatabaseService } from '../../database/database.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { buildUpdateQuery } from '../../common/query.helper';

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
    const result = await this.databaseService.query<Position>(query);
    return result.rows;
  }

  async findOne(id: number): Promise<Position> {
    const query = `
      SELECT *
      FROM positions 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await this.databaseService.query<Position>(query, [id]);
    return result.rows[0];
  }

  async create(validateDto: CreatePositionDto): Promise<Position> {
    const query = `
      INSERT INTO positions (name) 
      VALUES ($1) 
      RETURNING *
    `;

    try {
      const result = await this.databaseService.query<Position>(query, [
        validateDto.name,
      ]);
      return result.rows[0];
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

    const { query, values } = buildUpdateQuery('positions', changes, id);

    try {
      const result = await this.databaseService.query<Position>(query, values);
      return result.rows[0];
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
      const result = await this.databaseService.query<Position>(query, [id]);
      return result.rows[0];
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
}
