import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from '@/types/department'
import { api } from '@/services/Api'

export const departmentApi = {
  getDepartments() {
    return api.get<Department[]>('/departments')
  },

  getDepartmentById(id: number) {
    return api.get<Department>(`/departments/${id}`)
  },

  createDepartment(dto: CreateDepartmentDto) {
    return api.post<Department, CreateDepartmentDto>('/departments', dto)
  },

  updateDepartment(id: number, dto: UpdateDepartmentDto) {
    return api.patch<Department, UpdateDepartmentDto>(`/departments/${id}`, dto)
  },

  deleteDepartment(id: number) {
    return api.delete<Department>(`/departments/${id}`)
  },
}
