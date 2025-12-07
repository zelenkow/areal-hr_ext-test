import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { PositionsModule } from './modules/positions/positions.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { FilesModule } from './modules/files/files.module';
import { HrOperationsModule } from './modules/hr_operations/hr-operations.module';
import { AuditLogsModule } from './modules/audit_logs/audit-logs.module';
import { DatabaseModule } from './database/database.module';

const envFilePath = `../.env`;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    DatabaseModule,
    OrganizationsModule,
    DepartmentsModule,
    PositionsModule,
    EmployeesModule,
    FilesModule,
    HrOperationsModule,
    AuditLogsModule,
  ],
})
export class AppModule {}
