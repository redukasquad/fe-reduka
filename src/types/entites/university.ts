import type { UniversityProgram } from "./universityProgram";

export interface University {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  name: string;
  type: 'PTN' | 'PTS' | 'PTK';
  programs?: UniversityProgram[];
}
