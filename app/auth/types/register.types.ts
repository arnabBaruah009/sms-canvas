export type Register_Input_Type = {
  email: string;
  password: string;
  confirm_password: string;
};

export interface RegisterRequest {
  user: {
    email: string;
    password: string;
  };
}

export interface RegisterResponse {
  accessToken: string;
  registerationStatus: boolean;
  error: any;
}
