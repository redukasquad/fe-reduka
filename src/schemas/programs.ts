import z from "zod";

export const CreateProgramSchema = z.object({
  programName: z
    .string()
    .min(1, 'Program name is required'),

  description: z
    .string()
    .optional(),

  imageProgram: z
    .string()
    .optional(),
})

export type CreateProgramSchemaType=z.infer<typeof CreateProgramSchema>

export const UpdateProgramSchema = z.object({
  programName: z
    .string()
    .min(1)
    .optional()
    .nullable(),

  description: z
    .string()
    .optional()
    .nullable(),

  imageProgram: z
    .string()
    .optional()
    .nullable(),
})

export type UpdateProgramSchemaType=z.infer<typeof UpdateProgramSchema>