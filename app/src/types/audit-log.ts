export interface AuditLog {
  id: number
  user_id: number
  entity_type: string
  entity_id: number
  entity_name: string
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  created_at: string
}

export interface LogChange {
  field: string
  old: unknown
  new: unknown
}

export interface LogWithDiff {
  log: AuditLog
  changes: LogChange[]
}
