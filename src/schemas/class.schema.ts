import { z } from "zod"

export const CreateClassSchema = z.object({
  name: z.string().min(1, "Nama kelas wajib diisi"),
  description: z.string().optional(),
})

export const UpdateClassSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong").optional(),
  description: z.string().optional(),
})

export type CreateClassInput = z.infer<typeof CreateClassSchema>
export type UpdateClassInput = z.infer<typeof UpdateClassSchema>
