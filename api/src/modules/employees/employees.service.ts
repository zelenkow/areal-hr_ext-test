import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Employee } from './interfaces/employee.interface';
import { DatabaseService } from '../../database/database.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { buildUpdateQuery } from '../../common/query.helper';

@Injectable()
export class EmployeesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Employee[]> {
    const query = `
      SELECT * 
      FROM employees 
      WHERE deleted_at IS NULL
      ORDER BY last_name ASC, first_name ASC
    `;
    const result = await this.databaseService.query(query);
    return result.rows as Employee[];
  }

  async findOne(id: number): Promise<Employee> {
    const query = `
      SELECT * 
      FROM employees 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await this.databaseService.query(query, [id]);
    return result.rows[0] as Employee;
  }

  async create(validatedDto: CreateEmployeeDto): Promise<Employee> {
    const query = `
      INSERT INTO employees (
        last_name, 
        first_name, 
        middle_name, 
        birth_date, 
        passport_series, 
        passport_number, 
        passport_issue_date, 
        passport_issue_code, 
        passport_issued_by, 
        registration_region,
        registration_city, 
        registration_street, 
        registration_house, 
        registration_building, 
        registration_apartment
      ) 
      VALUES ($1, $2, $3,$4,$5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    try {
      const result = await this.databaseService.query(query, [
        validatedDto.last_name,
        validatedDto.first_name,
        validatedDto.middle_name,
        validatedDto.birth_date,
        validatedDto.passport_series,
        validatedDto.passport_number,
        validatedDto.passport_issue_date,
        validatedDto.passport_issue_code,
        validatedDto.passport_issued_by,
        validatedDto.registration_region,
        validatedDto.registration_city,
        validatedDto.registration_street,
        validatedDto.registration_house,
        validatedDto.registration_building,
        validatedDto.registration_apartment,
      ]);
      return result.rows[0] as Employee;
    } catch {
      throw new InternalServerErrorException('Failed to create employee');
    }
  }

  async update(id: number, validatedDto: UpdateEmployeeDto): Promise<Employee> {
    const current = await this.findOne(id);
    const changes = this.findChanges(current, validatedDto);

    if (Object.keys(changes).length === 0) {
      return current;
    }

    const { query, values } = buildUpdateQuery('employees', changes, id);

    try {
      const result = await this.databaseService.query(query, values);
      return result.rows[0] as Employee;
    } catch {
      throw new InternalServerErrorException('Failed to update employee');
    }
  }

  async remove(id: number): Promise<Employee> {
    const query = `
      UPDATE employees 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = $1
      RETURNING *
    `;
    try {
      const result = await this.databaseService.query(query, [id]);
      return result.rows[0] as Employee;
    } catch {
      throw new InternalServerErrorException('Failed to delete employee');
    }
  }

  private findChanges(
    current: Employee,
    value: UpdateEmployeeDto,
  ): Partial<UpdateEmployeeDto> {
    const changes: Partial<UpdateEmployeeDto> = {};

    if (
      value.last_name !== undefined &&
      value.last_name !== current.last_name
    ) {
      changes.last_name = value.last_name;
    }

    if (
      value.first_name !== undefined &&
      value.first_name !== current.first_name
    ) {
      changes.first_name = value.first_name;
    }

    if (
      value.middle_name !== undefined &&
      value.middle_name !== current.middle_name
    ) {
      changes.middle_name = value.middle_name;
    }

    if (
      value.birth_date !== undefined &&
      value.birth_date !== current.birth_date
    ) {
      changes.birth_date = value.birth_date;
    }

    if (
      value.passport_series !== undefined &&
      value.passport_series !== current.passport_series
    ) {
      changes.passport_series = value.passport_series;
    }

    if (
      value.passport_number !== undefined &&
      value.passport_number !== current.passport_number
    ) {
      changes.passport_number = value.passport_number;
    }

    if (
      value.passport_issue_date !== undefined &&
      value.passport_issue_date !== current.passport_issue_date
    ) {
      changes.passport_issue_date = value.passport_issue_date;
    }

    if (
      value.passport_issue_code !== undefined &&
      value.passport_issue_code !== current.passport_issue_code
    ) {
      changes.passport_issue_code = value.passport_issue_code;
    }

    if (
      value.passport_issued_by !== undefined &&
      value.passport_issued_by !== current.passport_issued_by
    ) {
      changes.passport_issued_by = value.passport_issued_by;
    }

    if (
      value.registration_region !== undefined &&
      value.registration_region !== current.registration_region
    ) {
      changes.registration_region = value.registration_region;
    }

    if (
      value.registration_city !== undefined &&
      value.registration_city !== current.registration_city
    ) {
      changes.registration_city = value.registration_city;
    }

    if (
      value.registration_street !== undefined &&
      value.registration_street !== current.registration_street
    ) {
      changes.registration_street = value.registration_street;
    }

    if (
      value.registration_house !== undefined &&
      value.registration_house !== current.registration_house
    ) {
      changes.registration_house = value.registration_house;
    }

    if (
      value.registration_building !== undefined &&
      value.registration_building !== current.registration_building
    ) {
      changes.registration_building = value.registration_building;
    }

    if (
      value.registration_apartment !== undefined &&
      value.registration_apartment !== current.registration_apartment
    ) {
      changes.registration_apartment = value.registration_apartment;
    }

    return changes;
  }
}
