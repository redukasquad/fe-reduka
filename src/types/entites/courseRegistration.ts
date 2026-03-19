export interface RegistrationAnswer {
  questionId: number
  questionText: string
  answerText: string
}

export interface CourseRegistration {
  id: number
  userId: number
  courseId: number
  status: 'pending' | 'approved' | 'rejected'
  courseName?: string
  programName?: string
  whatsappGroupLink?: string
  userName?: string
  userEmail?: string
  answers?: RegistrationAnswer[]
  createdAt: string
}
