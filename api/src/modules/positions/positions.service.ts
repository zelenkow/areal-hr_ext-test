import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Position } from './interfaces/position.interface';
import { DatabaseService } from '../../database/database.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { CreatePositionSchema } from './schemas/create-position.schema';
import { UpdatePositionSchema } from './schemas/update-position.schema';

@Injectable()
export class PositionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Position[]> {
    const query = `
      SELECT id, name, created_at, updated_at
      FROM positions 
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `;
    const result = await this.databaseService.query(query);
    return result.rows as Position[];
  }

  async findOne(id: number): Promise<Position> {
    const query = `
      SELECT id, name, created_at, updated_at
      FROM positions 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await this.databaseService.query(query, [id]);
    return result.rows[0] as Position;
  }

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    const { error } = CreatePositionSchema.validate(createPositionDto);
    if (error) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }
    const query = `
      INSERT INTO positions (name) 
      VALUES ($1) 
      RETURNING id, name, created_at, updated_at
    `;

    try {
      const result = await this.databaseService.query(query, [
        createPositionDto.name,
      ]);
      return result.rows[0] as Position;
    } catch {
      throw new InternalServerErrorException('Failed to create position');
    }
  }

  async update(
    id: number,
    updatePositionDto: UpdatePositionDto,
  ): Promise<Position> {
    const { error } = UpdatePositionSchema.validate(updatePositionDto);
    if (error) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }
    const query = `
      UPDATE positions 
      SET name = $1
      WHERE id = $2
      RETURNING id, name, created_at, updated_at
    `;

    try {
      const result = await this.databaseService.query(query, [
        updatePositionDto.name,
        id,
      ]);
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
      RETURNING id, name, created_at, updated_at, deleted_at
    `;

    try {
      const result = await this.databaseService.query(query, [id]);
      return result.rows[0] as Position;
    } catch {
      throw new InternalServerErrorException('Failed to delete position');
    }
  }
}
