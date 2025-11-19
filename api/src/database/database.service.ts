import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor() {
    const databaseUrl = 'postgres://postgres:password@postgres:5432/hr_system'; // Хардкод для удобства проверки
    
    this.pool = new Pool({
      connectionString: databaseUrl,
    });
  }

  async query(text: string, params?: any[]) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }
}