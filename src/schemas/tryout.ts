import { z } from "zod"

export const createTryOutInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  driveLink: z.string().url(),
  isFree: z.boolean(),
  price: z.number().nonnegative().optional(),
  qrisImageUrl: z.string().url().optional(),
  paymentLink: z.string().url().optional(),
  registrationStart: z.coerce.date(),
  registrationEnd: z.coerce.date(),
  isPublished: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.registrationEnd <= data.registrationStart) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["registrationEnd"],
      message: "Invalid registration range",
    })
  }

  if (!data.isFree && (!data.price || data.price <= 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["price"],
      message: "Price required when not free",
    })
  }
})

export const updateTryOutInputSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  driveLink: z.string().url().optional(),
  isFree: z.boolean().optional(),
  price: z.number().nonnegative().optional(),
  qrisImageUrl: z.string().url().optional(),
  paymentLink: z.string().url().optional(),
  registrationStart: z.coerce.date().optional(),
  registrationEnd: z.coerce.date().optional(),
  isPublished: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (
    data.registrationStart &&
    data.registrationEnd &&
    data.registrationEnd <= data.registrationStart
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["registrationEnd"],
      message: "Invalid registration range",
    })
  }

  if (data.isFree === false && data.price !== undefined && data.price <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["price"],
      message: "Price must be greater than 0",
    })
  }
})

export const grantTutorPermissionInputSchema = z.object({
  userId: z.number().int().nonnegative(),
})

export type CreateTryOutInput = z.infer<typeof createTryOutInputSchema>
export type UpdateTryOutInput = z.infer<typeof updateTryOutInputSchema>
export type GrantTutorPermissionInput = z.infer<typeof grantTutorPermissionInputSchema>