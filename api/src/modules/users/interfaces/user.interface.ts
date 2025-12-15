export interface User {
  id: number;
  last_name: string;
  first_name: string;
  middle_name: string;
  login: string;
  password_hash: string;
  role: string;
  created_at: Date;
  deleted_at: Date | null;
  updated_at: Date;
}
