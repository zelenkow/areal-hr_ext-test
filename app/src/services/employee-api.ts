import type {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from '@/types/employee'
import { api } from '@/services/Api'

export const employeeApi = {
  getEmployees() {
    return api.get<Employee[]>('/employees')
  },

  getEmployeeById(id: number) {
    return api.get<Employee>(`/employees/${id}`)
  },

  createEmployee(dto: CreateEmployeeDto) {
    return api.post<Employee, CreateEmployeeDto>('/employees', dto)
  },

  updateEmployee(id: number, dto: UpdateEmployeeDto) {
    return api.patch<Employee, UpdateEmployeeDto>(
      `/employees/${id}`,
      dto
    )
  },

  deleteEmployee(id: number) {
    return api.delete<Employee>(`/employees/${id}`)
  }
}
