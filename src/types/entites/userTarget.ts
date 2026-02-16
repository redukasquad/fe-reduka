import type { UniversityProgram } from "./universityProgram";
import type { User } from "./user";

export interface UserTarget {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  userId: number;
  universityProgramId: number;
  priority: number;
  user?: User;
  universityProgram?: UniversityProgram;
}
