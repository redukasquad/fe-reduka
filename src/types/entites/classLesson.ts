export interface ClassLesson {
  id: number;
  classId: number;
  className?: string;
  title: string;
  description?: string;
  lessonOrder: number;
  startTime?: string | null;
  endTime?: string | null;
  resourceCount?: number;
  resources?: ClassLessonResource[];
}

export interface ClassLessonResource {
  id: number;
  type: string;
  title: string;
  url: string;
}
