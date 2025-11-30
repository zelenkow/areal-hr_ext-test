export class CreateDepartmentDto {
  organization_id: number;
  name: string;
  parent_id?: number;
  comment?: string;
}
