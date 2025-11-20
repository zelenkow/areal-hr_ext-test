export interface Organization {
  id: number;
  name: string;
  comment?: string;
  created_at: Date;
  deleted_at?: Date;
}
