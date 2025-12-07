export interface AuditLog {
  id: number;
  user_id: number;
  entity_type: string;
  entity_id: number;
  field_name: string;
  old_value: string;
  new_value: string;
  created_at: Date;
  deleted_at: Date | null;
  updated_at: Date;
}
