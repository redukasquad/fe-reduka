import type { Course } from "./course";
import type { RegistrationAnswer } from "./registrationAnswer";
import type { User } from "./user";

export interface CourseRegistration {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
  userId: number;
  courseId: number;
  status: 'pending' | 'approved' | 'rejected';
  user?: User;
  course?: Course;
  answers?: RegistrationAnswer[];
}