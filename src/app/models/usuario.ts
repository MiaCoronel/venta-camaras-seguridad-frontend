export interface User {
  id: number;
  username: string;
  role?: string;
  roles?: string[];
  nombre?: string;
  enabled?: boolean;
}
