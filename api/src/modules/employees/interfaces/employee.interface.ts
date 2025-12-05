export interface Employee {
  id: number;
  last_name: string;
  first_name: string;
  middle_name: string;
  birth_date: Date;
  passport_series: string;
  passport_number: string;
  passport_issue_date: Date;
  passport_issue_code: string;
  passport_issued_by: string;
  registration_region: string;
  registration_city: string;
  registration_street: string;
  registration_house: string;
  registration_building: string;
  registration_apartment: string;
  created_at: Date;
  deleted_at: Date | null;
  updated_at: Date;
}
