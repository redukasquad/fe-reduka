import type { Course } from "./course";
import type { CourseRegistration } from "./courseRegistration";
import type { UserTarget } from "./userTarget";

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

















