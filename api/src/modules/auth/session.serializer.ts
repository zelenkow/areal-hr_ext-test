import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../users/interfaces/user.interface';

type Payload = Pick<User, 'id' | 'login' | 'role'>;
type Callback = (err: null, payload: Payload) => void;

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: Callback) {
    done(null, {
      id: user.id,
      login: user.login,
      role: user.role,
    });
  }
  deserializeUser(payload: Payload, done: Callback) {
    done(null, payload);
  }
}
