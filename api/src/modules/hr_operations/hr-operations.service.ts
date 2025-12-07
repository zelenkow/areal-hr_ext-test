import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { HrOperation } from './interfaces/hr-operation.interface';
import { DatabaseService } from '../../database/database.service';
import { CreateHrOperationDto } from './dto/create-hr-operation.dto';
import { UpdateHrOperationDto } from './dto/update-hr-operation.dto';
import { buildUpdateQuery } from '../../common/query.helper';

@Injectable()
export class HrOperationsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<HrOperation[]> {
    const query = `
      SELECT * 
      FROM hr_operations 
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    const result = await this.databaseService.query(query);
    return result.rows as HrOperation[];
  }

  async findOne(id: number): Promise<HrOperation> {
    const query = `
      SELECT * 
      FROM hr_operations 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await this.databaseService.query(query, [id]);
    return result.rows[0] as HrOperation;
  }

  async create(validatedDto: CreateHrOperationDto): Promise<HrOperation> {
    const checkQuery = `
      SELECT id 
      FROM hr_operations 
      WHERE employee_id = $1 AND deleted_at IS NULL
    `;

    const checkResult = await this.databaseService.query(checkQuery, [
      validatedDto.employee_id,
    ]);

    if (checkResult.rows.length > 0) {
      throw new BadRequestException('Employee already has HR record');
    }

    const query = `
      INSERT INTO hr_operations (
        employee_id, 
        type, 
        department_id, 
        position_id, 
        salary
      ) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    try {
      const result = await this.databaseService.query(query, [
        validatedDto.employee_id,
        validatedDto.type,
        validatedDto.department_id,
        validatedDto.position_id,
        validatedDto.salary,
      ]);
      return result.rows[0] as HrOperation;
    } catch {
      throw new InternalServerErrorException('Failed to create HR operation');
    }
  }

  async update(
    id: number,
    validatedDto: UpdateHrOperationDto,
  ): Promise<HrOperation> {
    const current = await this.findOne(id);

    const changes = this.prepareChanges(current, validatedDto);

    if (Object.keys(changes).length === 0) {
      return current;
    }

    const { query, values } = buildUpdateQuery('hr_operations', changes, id);

    try {
      const result = await this.databaseService.query(query, values);
      return result.rows[0] as HrOperation;
    } catch {
      throw new InternalServerErrorException('Failed to update HR operation');
    }
  }

  async remove(id: number): Promise<HrOperation> {
    const query = `
      UPDATE hr_operations 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = $1
      RETURNING *
    `;
    try {
      const result = await this.databaseService.query(query, [id]);
      return result.rows[0] as HrOperation;
    } catch {
      throw new InternalServerErrorException('Failed to delete HR operation');
    }
  }

  private prepareChanges(
    current: HrOperation,
    value: UpdateHrOperationDto,
  ): Partial<UpdateHrOperationDto> {
    const changes: Partial<UpdateHrOperationDto> = {};

    if (value.type === 'dismissal' && current.type !== 'dismissal') {
      changes.type = 'dismissal';
      changes.department_id = null;
      changes.position_id = null;
      changes.salary = null;
      return changes;
    }

    if (value.type === 'hire' && current.type !== 'hire') {
      if (
        value.department_id === undefined ||
        value.position_id === undefined ||
        value.salary === undefined
      ) {
        throw new BadRequestException(
          'For hire operation all fields must be provided: department_id, position_id, salary',
        );
      }

      changes.type = 'hire';
      changes.department_id = value.department_id;
      changes.position_id = value.position_id;
      changes.salary = value.salary;
      return changes;
    }

    if (current.type === 'hire') {
      if (
        value.department_id !== undefined &&
        value.department_id !== current.department_id
      ) {
        changes.department_id = value.department_id;
      }
      if (
        value.position_id !== undefined &&
        value.position_id !== current.position_id
      ) {
        changes.position_id = value.position_id;
      }
      if (value.salary !== undefined && value.salary !== current.salary) {
        changes.salary = value.salary;
      }
    }

    if (current.type === 'dismissal' && value.type !== 'hire') {
      throw new BadRequestException(
        'Cannot change fields for dismissed employee',
      );
    }
    return changes;
  }
}
