import type { ClassLesson } from "./classLesson";
import type { Course } from "./course";

export interface ClassSubject {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
  courseId: number;
  name: string;
  description: string;
  course?: Course;
  lessons?: ClassLesson[];
}