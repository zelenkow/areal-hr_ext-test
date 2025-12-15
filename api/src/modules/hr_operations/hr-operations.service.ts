import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HrOperation } from './interfaces/hr-operation.interface';
import { DatabaseService } from '../../database/database.service';
import { CreateHrOperationDto } from './dto/create-hr-operation.dto';
import { EmployeeStatus } from './enums/employee-status.enum';
import { Employee } from '../employees/interfaces/employee.interface';

@Injectable()
export class HrOperationsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmployeeId(employeeId: number): Promise<HrOperation[]> {
    const query = `
      SELECT * 
      FROM hr_operations 
      WHERE employee_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    const result = await this.databaseService.query<HrOperation>(query, [
      employeeId,
    ]);
    return result.rows;
  }

  async create(validatedDto: CreateHrOperationDto): Promise<HrOperation> {
    const employeeQuery = `
      SELECT hr_status, current_department_id, current_position_id, current_salary 
      FROM employees 
      WHERE id = $1
    `;
    const employeeResult = await this.databaseService.query<Employee>(
      employeeQuery[validatedDto.employee_id],
    );
    const employee = employeeResult.rows[0];

    this.validateTransition(employee.hr_status, validatedDto.type);

    const changes = this.findHrChanges(employee, validatedDto);

    if (
      validatedDto.type !== 'dismissal' &&
      Object.keys(changes).length === 1
    ) {
      throw new BadRequestException('No changes detected for operation');
    }

    const operationQuery = `
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
      const operationResult = await this.databaseService.query(operationQuery, [
        validatedDto.employee_id,
        validatedDto.type,
        changes.department_id,
        changes.position_id,
        changes.salary,
      ]);
      const operation = operationResult.rows[0] as HrOperation;

      await this.updateEmployeeState(validatedDto.employee_id, validatedDto);
      return operation;
    } catch {
      throw new InternalServerErrorException('Failed to create operation');
    }
  }

  private validateTransition(
    currentStatus: EmployeeStatus,
    operationType: string,
  ) {
    const allowed: Record<string, string[]> = {
      [EmployeeStatus.NOT_HIRED]: ['hire'],
      [EmployeeStatus.ACTIVE]: ['transfer', 'salary_change', 'dismissal'],
      [EmployeeStatus.DISMISSED]: ['hire'],
    };

    if (!allowed[currentStatus]?.includes(operationType)) {
      throw new BadRequestException(
        `Operation "${operationType}" not allowed for status "${currentStatus}"`,
      );
    }
  }

  private async updateEmployeeState(
    employeeId: number,
    dto: CreateHrOperationDto,
  ) {
    let updateFields: {
      hr_status?: 'ACTIVE' | 'DISMISSED';
      current_department_id?: number | null;
      current_position_id?: number | null;
      current_salary?: number | null;
    } = {};

    switch (dto.type) {
      case 'hire':
        updateFields = {
          hr_status: 'ACTIVE',
          current_department_id: dto.department_id,
          current_position_id: dto.position_id,
          current_salary: dto.salary,
        };
        break;
      case 'transfer':
        updateFields = {
          current_department_id: dto.department_id,
        };
        break;
      case 'salary_change':
        updateFields = {
          current_salary: dto.salary,
        };
        break;
      case 'dismissal':
        updateFields = {
          hr_status: 'DISMISSED',
          current_department_id: null,
          current_position_id: null,
          current_salary: null,
        };
        break;
    }

    if (Object.keys(updateFields).length > 0) {
      const updateQuery = `
        UPDATE employees 
        SET ${Object.keys(updateFields)
          .map((k, i) => `${k} = $${i + 2}`)
          .join(', ')}
        WHERE id = $1
      `;

      await this.databaseService.query(updateQuery, [
        employeeId,
        ...Object.values(updateFields),
      ]);
    }
  }

  private findHrChanges(
    employee: any,
    dto: CreateHrOperationDto,
  ): Partial<CreateHrOperationDto> {
    const changes: Partial<CreateHrOperationDto> = { type: dto.type };

    switch (dto.type) {
      case 'transfer':
        if (
          dto.department_id !== undefined &&
          dto.department_id !== employee.current_department_id
        ) {
          changes.department_id = dto.department_id;
        }
        break;

      case 'salary_change':
        if (
          dto.salary !== undefined &&
          dto.salary !== employee.current_salary
        ) {
          changes.salary = dto.salary;
        }
        break;

      case 'hire':
        changes.department_id = dto.department_id;
        changes.position_id = dto.position_id;
        changes.salary = dto.salary;
        break;
    }
    return changes;
  }
}
