export interface Organization {
  id: number
  name: string
  comment: string
  created_at: Date
  deleted_at: Date | null
  updated_at: Date
}

export interface CreateOrganizationDto {
  name: string
  comment: string
}

export interface UpdateOrganizationDto {
  name?: string
  comment?: string
}
