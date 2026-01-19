export type Login_Input_Type = {
  email: string;
  password: string;
};

export interface LoginRequest {
  user: {
    email: string;
    password: string;
  };
}

export interface LoginResponse {
  data: {
    accessToken: string;
    isEmailVerified: boolean;
    schoolId: string | null;
  };
  error: any;
}
