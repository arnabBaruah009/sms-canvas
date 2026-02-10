export interface ExamSubjectInputDto {
  subjectId: string;
  passMark: number;
  maxMark: number;
}

export interface CreateExamDto {
  name: string;
  startDate: string;
  endDate: string;
  subjects: ExamSubjectInputDto[];
}

export interface ExamSubject {
  subjectId: string | { _id: string; name: string };
  passMark: number;
  maxMark: number;
}

export interface Exam {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  subjects?: ExamSubject[];
}

export interface CreateExamResponse {
  data: Exam;
  message?: string;
}

export interface GetExamsResponse {
  data: Exam[];
  message?: string;
}
