import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { AuthenticatedUser } from './types/auth.types';

type SerializeCallback = (err: any, payload?: { id: number }) => void;
type DeserializeCallback = (err: any, user?: AuthenticatedUser) => void;
type SessionPayload = { id: number };

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: AuthenticatedUser, done: SerializeCallback) {
    done(null, { id: user.id });
  }

  async deserializeUser(payload: SessionPayload, done: DeserializeCallback) {
    const user = await this.usersService.findOne(payload.id);
    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      login: user.login,
      role: user.role,
      last_name: user.last_name,
      first_name: user.first_name,
      middle_name: user.middle_name,
    };

    done(null, authenticatedUser);
  }
}
