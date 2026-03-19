import { z } from "zod"

export const CreateTryoutQuestionSchema = z.object({
  questionText: z
    .string()
    .min(1, "Question text is required"),

  imageUrl: z
    .string()
    .url("Invalid image URL")
    .optional()
    .or(z.literal("")),

  difficultyLevel: z.enum(["easy", "medium", "hard"], {
    required_error: "Difficulty level is required"
  }),

  orderNumber: z
    .number({
      required_error: "Order number is required"
    })
    .min(1, "Order number must be at least 1"),

  optionA: z
    .string()
    .min(1, "Option A is required"),

  optionB: z
    .string()
    .min(1, "Option B is required"),

  optionC: z
    .string()
    .min(1, "Option C is required"),

  optionD: z
    .string()
    .min(1, "Option D is required"),

  optionE: z
    .string()
    .min(1, "Option E is required"),

  correctOption: z.enum(["A", "B", "C", "D", "E"], {
    required_error: "Correct option is required"
  })
})

export type CreateTryoutQuestionInput = z.infer<typeof CreateTryoutQuestionSchema>

export const UpdateTryoutQuestionSchema = CreateTryoutQuestionSchema.partial()

export type UpdateTryoutQuestionInput = z.infer<typeof UpdateTryoutQuestionSchema>