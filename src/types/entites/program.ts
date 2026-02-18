import type { Course } from "./course";
export interface Program {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  deletedAt?: string | null;
  programName: string;
  description: string;
  imageProgram: string;
  courses?: Course[];
}

















