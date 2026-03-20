import { z } from "zod"

// Matches BE CreateSubjectInput — courseId is URL param, not body
export const CreateSubjectSchema = z.object({
  name: z.string().min(1, "Nama kelas wajib diisi"),
  description: z.string().optional(),
})

export const UpdateSubjectSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong").optional(),
  description: z.string().optional(),
})

export type CreateSubjectInput = z.infer<typeof CreateSubjectSchema>
export type UpdateSubjectInput = z.infer<typeof UpdateSubjectSchema>
