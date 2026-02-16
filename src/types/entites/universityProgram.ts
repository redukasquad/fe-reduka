import type { University } from "./university";
import type { UserTarget } from "./userTarget";

export interface UniversityProgram {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  universityId: number;
  name: string;
  passingGrade: number;
  university?: University;
  targets?: UserTarget[];
}