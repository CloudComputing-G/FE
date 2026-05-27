export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
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
  status: "PENDING" | "DONE" | "FAILED";
  startedAt: string | null;
  completedAt: string | null;
}

export interface QuestionResult {
  questionId: number;
  orderNum: number;
  content: string;
  maxScore: number;
  earnedScore: number;
  gradingResult: "CORRECT" | "PARTIAL" | "WRONG";
  aiFeedback: string | null;
  studentImageUrl: string | null;
  regradeStatus: "NONE" | "PENDING" | "DONE" | null;
}

export interface SubmissionResultResponse {
  submissionId: number;
  assignmentTitle: string;
  totalScore: number;
  maxScore: number;
  accuracyRate: number;
  correctCount: number;
  partialCount: number;
  wrongCount: number;
  questions: QuestionResult[];
}
