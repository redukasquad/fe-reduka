import type { Course } from "./course";
export interface Program {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
  programName: string;
  description: string;
  imageProgram: string;
  courses?: Course[];
}

















