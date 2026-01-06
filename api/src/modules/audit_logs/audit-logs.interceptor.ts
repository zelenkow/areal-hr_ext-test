import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { AuditLogsService } from './audit-logs.service';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private auditService: AuditLogsService,
    private databaseService: DatabaseService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { user, method, params, url } = request;

    if (url.startsWith('/auth')) {
      return next.handle();
    }

    if (!['POST', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const entity = this.getEntityType(url);
    const entityId = params.id;

    let oldData = null;
    if ((method === 'PATCH' || method === 'DELETE') && entityId) {
      oldData = await this.getCurrentEntityData(entity, entityId);
    } else if (method === 'POST' && entity === 'hr-operations') {
      const employeeId = request.body?.employee_id;
      if (employeeId) {
        oldData = await this.getEmployeeStateForHr(employeeId);
      }
    }

    return next.handle().pipe(
      tap(async (response) => {
        await this.auditService.log({
          user_id: user.id,
          entity_type: entity,
          entity_id: entityId || response.id,
          old_data: oldData,
          new_data: response,
        });
      }),
    );
  }

  private async getEmployeeStateForHr(employeeId: number) {
    const query = `
      SELECT 
        hr_status,
        current_department_id,
        current_position_id, 
        current_salary
      FROM employees 
      WHERE id = $1
    `;
    const result = await this.databaseService.query(query, [employeeId]);
    return result.rows[0];
  }

  private async getCurrentEntityData(entity: string, id: number) {
    const query = `SELECT * FROM ${entity} WHERE id = $1`;
    const result = await this.databaseService.query(query, [id]);
    return result.rows[0];
  }

  private getEntityType(url: string): string {
    const match = url.match(/^\/([^\/]+)/);
    const result = match ? match[1] : 'unknown';
    return result;
  }
}
