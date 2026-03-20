// Mirrors BE: entities.LessonResource (table: lesson_resources)
// ResourceResponse from modules/classes/resources/dto.go
export type ResourceType = 'video' | 'document' | 'link' | 'zoom' | 'recording'

export interface LessonResource {
  id: number
  lessonId: number
  lessonTitle?: string
  type: ResourceType
  title: string
  url: string
}
