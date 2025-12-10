import type { Employee } from '@/types/employee'

export const formatFullName = (employee: Employee): string => {
  const parts = [
    employee.last_name,
    employee.first_name,
    employee.middle_name
  ]
  return parts.join(' ')
}
