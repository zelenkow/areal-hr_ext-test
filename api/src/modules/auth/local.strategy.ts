import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthenticatedUser } from './types/auth.types';
import * as argon2 from 'argon2';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      usernameField: 'login',
    });
  }

  async validate(login: string, password: string): Promise<AuthenticatedUser> {
    const user = await this.usersService.findByLogin(login);

    if (!user) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const isPasswordValid = await argon2.verify(user.password_hash, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid login or password');
    }

    return {
      id: user.id,
      login: user.login,
      role: user.role,
      last_name: user.last_name,
      first_name: user.first_name,
      middle_name: user.middle_name,
    };
  }
}
