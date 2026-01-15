export type ForgotPassword_Input_Type = {
  email: string;
  newPassword: string;
  confirm_password: string;
};

export interface ForgotRequest {
  user: {
    email: string;
    newPassword: string;
  };
}
