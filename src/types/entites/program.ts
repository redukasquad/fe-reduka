import type { Course } from "./course";
export interface Program {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  programName: string;
  description: string;
  imageProgram: string;
  courses?: Course[];
}

















