export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
}

export interface ClassroomResponse {
  classId: number;
  name: string;
  teacherName: string;
  createdAt: string;
  studentCount?: number;
}

export interface QuestionResponse {
  questionId: number;
  content: string;
  answer: string | null;
  gradingCriteria: string | null;
  maxScore: number | null;
  orderNum: number | null;
}

export interface AssignmentResponse {
  assignmentId: number;
  title: string;
  subject: string | null;
  status: "DRAFT" | "PUBLISHED";
  dueDate: string | null;
  createdAt: string;
  questions: QuestionResponse[];
  totalCount: number;
  submittedCount: number;
  gradedCount: number;
  notSubmittedCount: number;
  problemUrl: string | null;
  answerUrl: string | null;
}

export interface PresignedUrlResponse {
  submissionId: number;
  presignedUrl: string;
  s3Key: string;
}

export interface SubmissionResponse {
  submissionId: number;
  gradingStatus: "PENDING" | "DONE" | "FAILED";
}

export interface GradingStatusResponse {
  submissionId: number;
  status: "PENDING" | "DONE" | "FAILED";
  requestedAt: string | null;
  gradedAt: string | null;
  failReason: string | null;
}

export interface QuestionResult {
  questionId: number;
  questionContent: string;
  result: "CORRECT" | "PARTIAL" | "WRONG";
  score: number;
  maxScore: number;
  imageUrl: string | null;
  reason: string | null;
  regradeStatus: string | null;
}

export interface Summary {
  correct: number;
  partial: number;
  wrong: number;
}

export interface SubmissionResultResponse {
  submissionId: number;
  assignmentId: number;
  assignmentTitle: string;
  studentId: number;
  studentName: string;
  totalScore: number;
  maxScore: number;
  correctRate: number;
  submittedAt: string | null;
  gradedAt: string | null;
  summary: Summary;
  questions: QuestionResult[];
}
