export interface Department {
  id: number
  organization_id: number
  name: string
  parent_id: number | null
  comment: string
  created_at: Date
  deleted_at: Date | null
  updated_at: Date
}

export interface CreateDepartmentDto {
  organization_id: number
  name: string
  parent_id?: number
  comment: string
}

export interface UpdateDepartmentDto {
  name?: string
  comment?: string
}
