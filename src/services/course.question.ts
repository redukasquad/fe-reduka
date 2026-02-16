import type { CreateRegistrationQuestionInput } from "../schemas/course.question"
import type { ApiResponse } from "../types/api"
import type { RegistrationQuestion } from "../types/entites/registrationQuestion"
import api from "./api"

export class CourseQuestionService{
    static async findAll(courseId:number) : Promise<
        ApiResponse<RegistrationQuestion[]>>
    {
        const res=await api.get(`/courses/${courseId}/questions`)
        return res.data
    }

    static async create(courseId:number, data:CreateRegistrationQuestionInput & {
        questionOrder:number
    }){
        const res=await api.post(`/courses/${courseId}/questions`, data)
        return res.data   
    }

      static async delete(questionId: number) {
        const res = await api.delete(
            `/questions/${questionId}`
            )
            return res.data
        }

}