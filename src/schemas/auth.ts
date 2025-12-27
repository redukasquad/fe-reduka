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
      .min(8, "Password minimal 8 karakter"),
    confirmPassword: z
      .string()
      .min(8, "Konfirmasi password minimal 8 karakter"),
    acceptPolicy: z
      .boolean()
      .refine(val => val === true, "Anda harus menyetujui syarat & ketentuan"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;



export const ForgotPassword = z.object({
  email: z
    .string()
    .email("Email tidak valid"),
});

export type ForgotPasswordSchemaType = z.infer<typeof ForgotPassword>;



export const VerifyOtpSchema = z.object({
  otp: z
    .string()
    .min(6, "Token tidak valid"),
});

export type VerifyOtpSchemaType = z.infer<typeof VerifyOtpSchema>;


export const ResendPasswordSchema = z.object({
  email: z
    .string()
    .email("Email tidak valid"),
});

export type ResendPasswordSchemaSchemaType = z.infer<typeof ResendPasswordSchema>;

