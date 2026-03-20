// Mirrors BE: entities.Lesson (table: lessons)
// LessonResponse from modules/classes/lessons/dto.go
export interface Lesson {
  id: number
  classId: number
  className?: string
  title: string
  description?: string
  lessonOrder: number
  startTime?: string | null
  endTime?: string | null
  resourceCount?: number
}
