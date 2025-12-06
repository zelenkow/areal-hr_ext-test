export interface File {
  id: number;
  employee_id: number;
  name: string;
  file_path: string;
  created_at: Date;
  deleted_at: Date | null;
  updated_at: Date;
}
