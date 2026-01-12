import type { AuditLog, LogWithDiff } from '@/types/audit-log'
import { api } from '@/services/Api'

export const auditLogApi = {
  getLogs() {
    return api.get<AuditLog[]>('/audit-logs')
  },

  getLogById(id: number) {
    return api.get<AuditLog>(`/audit-logs/${id}`)
  },

  getLogWithDiff(id: number) {
    return api.get<LogWithDiff>(`/audit-logs/${id}/diff`)
  }
}
