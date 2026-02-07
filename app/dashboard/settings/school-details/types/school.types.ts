export type SchoolLevel =
  | "Primary"
  | "Secondary"
  | "Higher Secondary"
  | "Composite";
export type SchoolBoard = "CBSE" | "HSLC" | "ICSE" | "State Board" | "Other";
export type SchoolType = "Government" | "Private";

export interface SchoolDetails {
  _id?: string;
  name: string;
  phone_number: string;
  email: string;
  address_line: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  level: SchoolLevel;
  board: SchoolBoard;
  type: SchoolType;
  primary_contact_name?: string;
  primary_contact_number?: string;
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
