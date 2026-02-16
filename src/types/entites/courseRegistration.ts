import type { Course } from "./course";
import type { RegistrationAnswer } from "./registrationAnswer";
import type { User } from "./user";

export interface CourseRegistration {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  userId: number;
  courseId: number;
  status: 'pending' | 'approved' | 'rejected';
  user?: User;
  course?: Course;
  answers?: RegistrationAnswer[];
}