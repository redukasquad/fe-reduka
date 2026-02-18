import z from "zod"


export const CreateCourseSchema = z
  .object({
    programId: z.number().int().positive(),

    nameCourse: z.string().min(1, "Name course is required"),

    description: z.string().optional(),

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),

    isFree: z.boolean().optional(),

    image: z.string().optional(),

    whatsappGroupLink: z.string().url().optional()
  })
  .refine(
    (data) => data.endDate > data.startDate,
    {
      message: "End date must be after start date",
      path: ["endDate"]
    }
  )


export const UpdateCourseSchema = z
  .object({
    programId: z.number().int().positive().optional(),

    nameCourse: z.string().min(1).optional(),

    description: z.string().optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),

    isFree: z.boolean().optional(),

    image: z.string().optional(),

    whatsappGroupLink: z.string().url().optional()
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate
      }
      return true
    },
    {
      message: "End date must be after start date",
      path: ["endDate"]
    }
  )


export type CreateCourseInput = z.infer<typeof CreateCourseSchema>

export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>