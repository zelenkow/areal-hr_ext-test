import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { PositionsModule } from './modules/positions/positions.module';
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
  ],
})
export class AppModule {}
