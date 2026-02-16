import type { CourseRegistration } from "./courseRegistration";
import type { RegistrationQuestion } from "./registrationQuestion";

export interface RegistrationAnswer {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  registrationId: number;
  questionId: number;
  answerText: string;
  registration?: CourseRegistration;
  question?: RegistrationQuestion;
}