// Mirrors BE: dto.CourseResponse from modules/dto/course_dto.go
// Note: whatsAppGroupLink (capital A) matches backend JSON tag
import type { Class } from "./class"
import type { Program } from "./program"
import type { User } from "./user"

export interface Course {
  id: number
  ID?:number;
  createdAt: string
  programId?: number
  createdByUserId?: number
  image?: string
  nameCourse: string
  description?: string
  startDate: string
  endDate: string
  isFree: boolean
  // BE dto/course_dto.go uses whatsAppGroupLink (capital A)
  whatsAppGroupLink?: string
  program?: Program
  classes?: Class[]
  creator?: User
}
