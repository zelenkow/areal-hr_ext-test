import { EmployeeStatus } from '../../hr_operations/enums/employee-status.enum';

export interface Employee {
  id: number;
  last_name: string;
  first_name: string;
  middle_name: string;
  birth_date: string;
  passport_series: string;
  passport_number: string;
  passport_issue_date: string;
  passport_issue_code: string;
  passport_issued_by: string;
  registration_region: string;
  registration_city: string;
  registration_street: string;
  registration_house: string;
  registration_building: string;
  registration_apartment: string;
  hr_status: EmployeeStatus;
  current_department_id: number | null;
  current_position_id: number | null;
  current_salary: number | null;
  created_at: Date;
  deleted_at: Date | null;
  updated_at: Date;
}
