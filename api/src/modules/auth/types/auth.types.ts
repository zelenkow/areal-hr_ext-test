import { User } from '../../users/interfaces/user.interface';

export type AuthenticatedUser = Pick<
  User,
  'id' | 'login' | 'role' | 'last_name' | 'first_name' | 'middle_name'
>;
