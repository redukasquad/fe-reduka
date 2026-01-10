import type { Course } from "./course";
import type { RegistrationAnswer } from "./registrationAnswer";

export interface RegistrationQuestion {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
  courseId: number;
  questionText: string;
  questionType: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox';
  questionOrder: number;
  course?: Course;
  answers?: RegistrationAnswer[];
}