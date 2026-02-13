export interface AssessmentStudent {
  _id: string;
  name: string;
  rollNumber: number;
}

export interface GetAssessmentParams {
  examId: string;
  subjectId: string;
  class: string;
  section: string;
}

export interface GetAssessmentResponse {
  students: AssessmentStudent[];
  passMark: number;
  maxMark: number;
}

export interface AssessmentEntry {
  studentId: string;
  marksObtained: number;
  remarks: string;
}

export interface SubmitAssessmentPayload {
  examId: string;
  subjectId: string;
  assessment: AssessmentEntry[];
}

export interface SubmitAssessmentResponse {
  message?: string;
}

export interface AssessmentRow extends AssessmentStudent {
  passMark: number;
  maxMark: number;
  marksObtained: number;
  remarks: string;
}
