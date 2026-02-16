import type { ClassLesson } from "./classLesson";
import type { Course } from "./course";

export interface ClassSubject {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  courseId: number;
  name: string;
  description: string;
  course?: Course;
  lessons?: ClassLesson[];
}