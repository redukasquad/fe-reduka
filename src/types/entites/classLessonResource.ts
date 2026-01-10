import type { ClassLesson } from "./classLesson";

export interface ClassLessonResource {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
  classLessonID: number;
  type: 'video' | 'document' | 'link' | 'zoom' | 'recording';
  title: string;
  url: string;
  classLesson?: ClassLesson;
}