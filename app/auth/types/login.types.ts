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
    teamId: string | null;
    first_name: string;
    last_name: string;
    contact_number: string;
  };
  error: any;
}
