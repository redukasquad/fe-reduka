import z from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .email("Email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter"),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username minimal 3 karakter"),
    email: z
      .string()
      .email("Email tidak valid"),
    password: z
      .string()
      .min(6, "Password minimal 8 karakter"),
    confirmPassword: z
      .string()
      .min(6, "Konfirmasi password minimal 8 karakter"),
    acceptPolicy: z
      .boolean()
      .refine(val => val === true, "Anda harus menyetujui syarat & ketentuan"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;



export const ResetPassword = z.object({
  email: z
    .string()
    .email("Email tidak valid"),
});

export type ResetPasswordSchemaType = z.infer<typeof ResetPassword>;



export const VerifyTokenSchema = z.object({
  email: z
    .string()
    .email("Email tidak valid"),
  token: z
    .string()
    .min(6, "Token tidak valid"),
});

export type VerifyTokenSchemaType = z.infer<typeof VerifyTokenSchema>;


