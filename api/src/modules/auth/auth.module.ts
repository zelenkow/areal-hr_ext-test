import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { SessionGuard } from './guards/session.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      session: true,
    }),
  ],

  controllers: [AuthController],
  providers: [LocalStrategy, SessionSerializer, SessionGuard],
})
export class AuthModule {}
