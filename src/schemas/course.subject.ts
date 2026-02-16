import { z } from "zod";

export const CreateSubjectSchema = z.object({
  courseId: z.number({
    required_error: "Course ID is required",
  }).int().positive(),

  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, "Name cannot be empty"),

  description: z
    .string()
    .optional()
});

export const UpdateSubjectSchema = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty")
    .optional(),

  description: z
    .string()
    .optional(),
});


export type CreateSubjectInput = z.infer<typeof CreateSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof UpdateSubjectSchema>;
