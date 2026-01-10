import type { University } from "./university";
import type { UserTarget } from "./userTarget";

export interface UniversityProgram {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
  universityId: number;
  name: string;
  passingGrade: number;
  university?: University;
  targets?: UserTarget[];
}