export class CreateHrOperationDto {
  employee_id: number;
  type: string;
  department_id: number | null;
  position_id: number | null;
  salary: number | null;
}
