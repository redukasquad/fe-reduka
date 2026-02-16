import type { ClassLesson } from "./classLesson";

export interface ClassLessonResource {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  classLessonID: number;
  type: 'video' | 'document' | 'link' | 'zoom' | 'recording';
  title: string;
  url: string;
  classLesson?: ClassLesson;
}