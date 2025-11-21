export interface Department {
  id: number;
  organization_id: number;
  name: string;
  parent_id?: number;
  comment?: string;
  created_at: Date;
  deleted_at?: Date;
  updated_at: Date;
}
