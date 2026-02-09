import { User } from "../../settings/profile-details/types/profile.types";

export interface Student {
  _id: string;
  user_id: User;
  dob: string;
  address: string;
  class: string;
  section: string;
  rollNumber: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetStudentsResponse {
  data: Student[];
  message?: string;
}

export interface GetStudentResponse {
  data: Student | null;
  message?: string;
}

export interface CreateStudentDto {
  name: string;
  email?: string;
  password?: string;
  phone_number?: string;
  gender?: string;
  avatar_url?: string;
  dob: string;
  address: string;
  class?: string;
  section?: string;
  rollNumber?: string;
  about?: string;
  department?: string;
}

export interface CreateStudentResponse {
  data: Student;
  message?: string;
}
