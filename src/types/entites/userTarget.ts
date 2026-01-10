import type { UniversityProgram } from "./universityProgram";
import type { User } from "./user";

export interface UserTarget {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
  userId: number;
  universityProgramId: number;
  priority: number;
  user?: User;
  universityProgram?: UniversityProgram;
}
