export interface Employee {
  id: number
  last_name: string
  first_name: string
  middle_name: string
  birth_date: string
  passport_series: string
  passport_number: string
  passport_issue_date: string
  passport_issue_code: string
  passport_issued_by: string
  registration_region: string
  registration_city: string
  registration_street: string
  registration_house: string
  registration_building: string
  registration_apartment: string
  created_at: Date
  deleted_at: Date | null
  updated_at: Date
}

export interface CreateEmployeeDto {
  last_name: string
  first_name: string
  middle_name: string
  birth_date: string
  passport_series: string
  passport_number: string
  passport_issue_date: string
  passport_issue_code: string
  passport_issued_by: string
  registration_region: string
  registration_city: string
  registration_street: string
  registration_house: string
  registration_building: string
  registration_apartment: string
}

export interface UpdateEmployeeDto {
  last_name?: string
  first_name?: string
  middle_name?: string
  birth_date?: string
  passport_series?: string
  passport_number?: string
  passport_issue_date?: string
  passport_issue_code?: string
  passport_issued_by?: string
  registration_region?: string
  registration_city?: string
  registration_street?: string
  registration_house?: string
  registration_building?: string
  registration_apartment?: string
}
