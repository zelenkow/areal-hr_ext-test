import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { DatabaseService } from '../../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<User[]> {
    const query = `
      SELECT id, last_name, first_name, middle_name, login, role, created_at, updated_at
      FROM users 
      WHERE deleted_at IS NULL
      ORDER BY last_name ASC, first_name ASC
    `;
    const result = await this.databaseService.query(query);
    return result.rows as User[];
  }

  async findOne(id: number): Promise<User> {
    const query = `
      SELECT id, last_name, first_name, middle_name, login, role, created_at, updated_at
      FROM users 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await this.databaseService.query(query, [id]);
    return result.rows[0] as User;
  }

  async create(validatedDto: CreateUserDto): Promise<User> {
    const hashedPassword = await argon2.hash(validatedDto.password_hash, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
    });

    const query = `
      INSERT INTO users (
        last_name, 
        first_name, 
        middle_name,
        login,
        password_hash,
        role
      ) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, last_name, first_name, middle_name, login, role, created_at, updated_at
    `;

    try {
      const result = await this.databaseService.query(query, [
        validatedDto.last_name,
        validatedDto.first_name,
        validatedDto.middle_name,
        validatedDto.login,
        hashedPassword,
        validatedDto.role,
      ]);
      return result.rows[0] as User;
    } catch {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async update(id: number, validatedDto: UpdateUserDto): Promise<User> {
    const current = await this.findOne(id);
    const changes = this.findChanges(current, validatedDto);

    if (Object.keys(changes).length === 0) {
      return current;
    }

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(changes).forEach(([key, value]) => {
      fields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    });

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(id);
    const wherefield = `WHERE id = $${paramIndex}`;

    const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      ${wherefield}
      RETURNING id, last_name, first_name, middle_name, login, role, created_at, updated_at
    `;

    try {
      const result = await this.databaseService.query(query, values);
      return result.rows[0] as User;
    } catch {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: number): Promise<User> {
    const query = `
      UPDATE users 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = $1
      RETURNING id, last_name, first_name, middle_name, login, role, created_at, updated_at, deleted_at
    `;
    try {
      const result = await this.databaseService.query(query, [id]);
      return result.rows[0] as User;
    } catch {
      throw new InternalServerErrorException('Failed to delete employee');
    }
  }

  private findChanges(
    current: User,
    value: UpdateUserDto,
  ): Partial<UpdateUserDto> {
    const changes: Partial<UpdateUserDto> = {};
    const fields: (keyof UpdateUserDto)[] = [
      'last_name',
      'first_name',
      'middle_name',
      'login',
      'role',
    ];

    fields.forEach((field) => {
      if (value[field] !== undefined && value[field] !== current[field]) {
        changes[field] = value[field];
      }
    });

    return changes;
  }
}
