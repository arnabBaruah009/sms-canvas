export type Login_Input_Type = {
  phone: string;
  password: string;
};

export interface LoginRequest {
  user: {
    phone: string;
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
