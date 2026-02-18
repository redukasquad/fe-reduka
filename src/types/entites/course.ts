import type { ClassSubject } from "./classSubject";
import type { Program } from "./program";
import type { RegistrationQuestion } from "./registrationQuestion";
import type { User } from "./user";

export interface Course {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  programId: number;
  createdByUserId: number;
  image:string;
  nameCourse: string;
  description: string;
  startDate: string;
  endDate: string;
  isFree: boolean;
  whatsappGroupLink: string;
  program?: Program;
  subjects?: ClassSubject[];
  questions?: RegistrationQuestion[];
  creator?:User;
}