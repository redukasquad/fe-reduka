import type { Course } from "./course"

// GET /programs returns []entities.Program (gorm.Model → ID uppercase)
export interface Program {
  ID: number
  CreatedAt: string
  UpdatedAt: string
  DeletedAt?: string | null
  programName: string
  description: string
  imageProgram: string
  courses?: Course[]
}

















