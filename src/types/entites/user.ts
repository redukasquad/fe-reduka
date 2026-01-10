export type UserRole = "ADMIN" | "TUTOR" | "STUDENT"

export interface User {
  id?: number;

  username: string;
  email: string;
  password: string;
  noTelp?: string;
  jenisKelamin?: boolean;

  kelas?: "Kelas 10" | "Kelas 11" | "Kelas 12" | "Gapyer (Alumni)";
  role: UserRole;

  profileImage?: string;

  isVerified?: boolean;
  verificationCode?: string;

  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
