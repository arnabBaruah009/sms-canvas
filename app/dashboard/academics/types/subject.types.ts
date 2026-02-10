export interface Subject {
  _id: string;
  name: string;
  code?: string;
}

export interface CreateSubjectRequest {
  name: string;
  code?: string;
}

export interface CreateSubjectResponse {
  data: Subject;
  message?: string;
}

export interface GetSubjectsResponse {
  data: Subject[];
  message?: string;
}
