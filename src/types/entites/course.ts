import type { ClassSubject } from "./classSubject";
import type { Program } from "./program";
import type { RegistrationQuestion } from "./registrationQuestion";

export interface Course {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
  programId: number;
  createdByUserId: number;
  nameCourse: string;
  description: string;
  startDate: string;
  endDate: string;
  isFree: boolean;
  whatsappGroupLink: string;
  program?: Program;
  subjects?: ClassSubject[];
  questions?: RegistrationQuestion[];
}