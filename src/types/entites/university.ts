import type { UniversityProgram } from "./universityProgram";

export interface University {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
  name: string;
  type: 'PTN' | 'PTS' | 'PTK';
  programs?: UniversityProgram[];
}
