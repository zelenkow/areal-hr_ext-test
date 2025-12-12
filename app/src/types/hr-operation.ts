export interface HrOperation {
  id: number
  employee_id: number
  type: string
  department_id: number | null
  position_id: number | null
  salary: number | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface CreateHrOperationDto {
  employee_id: number
  type: string
  department_id: number | null
  position_id: number | null
  salary: number | null
}
