import { Module } from '@nestjs/common';
import { OrganizationsModule } from './organizations/organizations.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    OrganizationsModule,
  ],
})
export class AppModule {}
