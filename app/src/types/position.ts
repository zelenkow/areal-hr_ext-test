export interface Position {
  id: number
  name: string
  created_at: Date
  deleted_at: Date | null
  updated_at: Date
}

export interface CreatePositionDto {
  name: string
}

export interface UpdatePositionDto {
  name?: string
}
