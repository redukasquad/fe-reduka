// Mirrors BE: entities.Class (table: classes)
// SubjectResponse from modules/classes/subjects/dto.go
export interface Class {
  id: number
  courseId: number
  name: string
  description?: string
  lessonCount?: number
}
