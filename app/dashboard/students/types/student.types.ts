export type Gender = "Male" | "Female" | "Other";

export interface EducationEntry {
  yearFrom: number;
  yearTo: number;
  description: string;
}

export interface Student {
  id: string;
  avatar?: string;
  firstName: string;
  lastName: string;
  name: string;
  mobile: string;
  email?: string;
  gender: Gender;
  dob: string;
  address: string;
  department?: string;
  about?: string;
  education?: EducationEntry[];
}

export interface GetStudentsResponse {
  data: Student[];
  message?: string;
}

export interface GetStudentResponse {
  data: Student | null;
  message?: string;
}
