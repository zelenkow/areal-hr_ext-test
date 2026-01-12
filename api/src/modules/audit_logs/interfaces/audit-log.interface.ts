export interface AuditLog {
  id: number;
  user_id: number;
  entity_type: string;
  entity_id: number;
  old_data: Record<string, any> | null;
  new_data: Record<string, any> | null;
  created_at: Date;
  deleted_at: Date | null;
  updated_at: Date;
}
