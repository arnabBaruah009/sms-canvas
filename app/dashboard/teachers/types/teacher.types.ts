import { User } from "../../settings/profile-details/types/profile.types";

export interface EducationEntry {
  yearFrom: number;
  yearTo: number;
  description?: string;
}

export interface Teacher {
  _id: string;
  user_id: User;
  dob: string;
  address: string;
  education: EducationEntry[];
  subjects: string[];
  deleted_at?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface GetTeachersResponse {
  data: Teacher[];
  message?: string;
}

export interface GetTeacherResponse {
  data: Teacher | null;
  message?: string;
}

/** User + teacher fields for creating a teacher (user created first, then teacher). */
export interface CreateTeacherDto {
  name: string;
  email?: string;
  password?: string;
  phone_number?: string;
  gender?: string;
  avatar_url?: string;
  dob: string;
  address: string;
  education?: EducationEntry[];
  subjects?: string[];
}

/** User + teacher fields; only provided attributes are updated. */
export interface UpdateTeacherDto {
  name?: string;
  email?: string;
  phone_number?: string;
  gender?: string;
  avatar_url?: string;
  dob?: string;
  address?: string;
  education?: EducationEntry[];
  subjects?: string[];
}

export interface CreateTeacherResponse {
  data: Teacher;
  message?: string;
}

export interface UpdateTeacherResponse {
  data: Teacher;
  message?: string;
}
