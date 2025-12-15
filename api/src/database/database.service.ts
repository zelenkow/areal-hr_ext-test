import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');

    this.pool = new Pool({
      connectionString: databaseUrl,
    });
  }

  async query<T>(
    text: string,
    params?: (string | number | null | Date)[],
  ): Promise<QueryResult<T>> {
    const client = await this.pool.connect();
    try {
      const result = await client.query<T>(text, params);
      return result;
    } finally {
      client.release();
    }
  }
}
