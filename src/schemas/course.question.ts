import { z } from "zod"

export const QuestionTypeEnum = z.enum([
  "text",
  "select",
  "radio",
  "checkbox",
  "file"
])

export const CreateRegistrationQuestionSchema = z.object({
  questionText: z
    .string()
    .min(1, "Question text is required"),

  questionType: QuestionTypeEnum,
})

export const UpdateRegistrationQuestionSchema = z.object({
  questionText: z
    .string()
    .min(1)
    .optional(),

  questionType: QuestionTypeEnum
    .optional(),

})

export type CreateRegistrationQuestionInput =
  z.infer<typeof CreateRegistrationQuestionSchema>

export type UpdateRegistrationQuestionInput =
  z.infer<typeof UpdateRegistrationQuestionSchema>
