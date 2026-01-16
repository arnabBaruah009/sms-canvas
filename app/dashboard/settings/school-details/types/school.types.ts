export type SchoolType =
  | "Primary"
  | "Secondary"
  | "Higher Secondary"
  | "Composite";
export type SchoolBoard = "CBSE" | "HSLC" | "ICSE" | "State Board" | "Other";

export interface SchoolDetails {
  id?: string;
  name: string;
  phone_number: string;
  email: string;
  address_line: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  type: SchoolType;
  board: SchoolBoard;
  logo_url?: string;
}

export interface CreateSchoolRequest {
  school: SchoolDetails;
}

export interface CreateSchoolResponse {
  data: SchoolDetails;
  message?: string;
}

export interface GetSchoolResponse {
  data: SchoolDetails | null;
  message?: string;
}
