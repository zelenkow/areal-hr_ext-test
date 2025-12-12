import type { HrOperation, CreateHrOperationDto } from '@/types/hr-operation'
import { api } from '@/services/Api'

export const hrOperationApi = {
  getEmployeeOperations(employeeId: number) {
    return api.get<HrOperation[]>(`/hr-operations/employee/${employeeId}`)
  },

  createOperation(dto: CreateHrOperationDto) {
    return api.post<HrOperation, CreateHrOperationDto>('/hr-operations', dto)
  },
}
