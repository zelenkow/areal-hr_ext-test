import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './modules/users/users.service';
import { AuditInterceptor } from './modules/audit_logs/audit-logs.interceptor';
import { AuditLogsService } from './modules/audit_logs/audit-logs.service';
import { DatabaseService } from './database/database.service';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: false,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    origin: ['http://localhost', 'http://localhost:5173'],
    credentials: true,
  });

  const auditService = app.get(AuditLogsService);
  const databaseService = app.get(DatabaseService);
  app.useGlobalInterceptors(
    new AuditInterceptor(auditService, databaseService),
  );

  const usersService = app.get(UsersService);
  await usersService.seedDefaultAdmin();

  await app.listen(3000);
}
bootstrap();
