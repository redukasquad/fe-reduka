import type { Course } from "./course";
import type { RegistrationAnswer } from "./registrationAnswer";

export interface RegistrationQuestion {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  courseId: number;
  questionText: string;
  questionType:'text'  | 'select' | 'radio' | 'file';
  questionOrder: number;
  course?: Course;
  answers?: RegistrationAnswer[];
}