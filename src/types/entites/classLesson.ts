import type { ClassLessonResource } from "./classLessonResource";
import type { ClassSubject } from "./classSubject";
import type { User } from "./user";

export interface ClassLesson {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  subjectId: number;
  createdByUserId: number;
  title: string;
  description: string;
  lessonOrder: number;
  startTime?: string | null;
  endTime?: string | null;
  subject?: ClassSubject;
  creator?: User;
  resources?: ClassLessonResource[];
}
