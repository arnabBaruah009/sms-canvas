export type Register_Input_Type = {
  phone: string;
  password: string;
  confirm_password: string;
};

export interface RegisterRequest {
  user: {
    phone: string;
    password: string;
  };
}

export interface RegisterResponse {
  registrationStatus: boolean;
  error: any;
}
