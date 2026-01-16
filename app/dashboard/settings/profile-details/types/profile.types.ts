export type UserRole = "admin" | "teacher" | "staff" | "student";
export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export interface ProfileDetails {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  avatar_url?: string;
  gender?: Gender;
  role: UserRole;
  password?: string;
  isEmailVerified: boolean;
  school_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface GetProfileResponse {
  data: ProfileDetails;
  message?: string;
}
