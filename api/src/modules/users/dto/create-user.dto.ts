export class CreateUserDto {
  last_name: string;
  first_name: string;
  middle_name: string;
  login: string;
  password_hash: string;
  role: string;
}
