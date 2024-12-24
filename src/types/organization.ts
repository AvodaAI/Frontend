export interface Organization {
  id: number;
  name: string;
  description: string;
  is_active?: boolean;
  created_by?: number;
}
