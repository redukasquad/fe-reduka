import type { CourseRegistration } from "./courseRegistration";
import type { RegistrationQuestion } from "./registrationQuestion";

export interface RegistrationAnswer {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
  registrationId: number;
  questionId: number;
  answerText: string;
  registration?: CourseRegistration;
  question?: RegistrationQuestion;
}