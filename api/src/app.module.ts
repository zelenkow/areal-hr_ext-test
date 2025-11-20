import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrganizationsModule } from './modules/organizations/organizations.module';
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
  ],
})
export class AppModule {}
