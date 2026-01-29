export type Gender = "Male" | "Female" | "Other";

export interface ExperienceEntry {
  yearFrom: number;
  yearTo: number;
  description: string;
}

export interface EducationEntry {
  yearFrom: number;
  yearTo: number;
  description: string;
}

export interface Teacher {
  id: string;
  avatar?: string;
  firstName: string;
  lastName: string;
  name: string;
  year: number | string;
  gender: Gender;
  subjects: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  email?: string;
  mobile?: string;
  department?: string;
  about?: string;
}

export interface GetTeachersResponse {
  data: Teacher[];
  message?: string;
}

export interface GetTeacherResponse {
  data: Teacher | null;
  message?: string;
}
