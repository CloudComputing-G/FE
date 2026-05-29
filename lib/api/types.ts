export interface ApiResponse<T> {
  success: boolean
  code: string
  message: string
  data: T
  fieldErrors?: FieldError[]
}

export interface FieldError {
  field: string
  rejectedValue?: string
  reason?: string
}

// --- Auth ---
export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  name: string
  role: "TEACHER" | "STUDENT"
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
}

export interface RefreshRequest {
  refreshToken: string
}

// --- Classroom ---
export interface ClassroomResponse {
  classId: number
  name: string
  teacherName: string
  createdAt: string
  studentCount?: number
}

export interface ClassroomCreateRequest {
  name: string
}

export interface ClassroomUpdateRequest {
  name: string
}

// --- Assignment ---
export type AssignmentStatus = "DRAFT" | "PUBLISHED"

export interface QuestionResponse {
  questionId: number
  content: string
  answer: string | null
  gradingCriteria: string | null
  maxScore: number
  orderNum: number
}

export interface AssignmentResponse {
  assignmentId: number
  title: string
  subject: string | null
  status: AssignmentStatus
  dueDate: string | null
  createdAt: string
  questions: QuestionResponse[]
  totalCount: number
  submittedCount: number
  gradedCount: number
  notSubmittedCount: number
  problemUrl: string | null
  answerUrl: string | null
}

export interface QuestionRequest {
  content: string
  answer: string
  gradingCriteria?: string
  maxScore: number
  orderNum: number
}

export interface QuestionUpdateRequest {
  answer: string
  gradingCriteria?: string
}

export interface AssignmentCreateRequest {
  title: string
  subject?: string
  classId: number
  dueDate?: string
  problemS3Key?: string
  answerS3Key?: string
  questions?: QuestionRequest[]
}

export interface AssignmentUpdateRequest {
  title: string
  dueDate?: string
}

// --- Upload ---
export interface UploadUrlResponse {
  presignedUrl: string
  s3Key: string
}

// student upload flow
export interface PresignedUrlResponse {
  submissionId: number
  presignedUrl: string
  s3Key: string
}

// --- Submission ---
export interface SubmissionResponse {
  submissionId: number
  gradingStatus: "PENDING" | "DONE" | "FAILED"
}

export interface GradingStatusResponse {
  status: "PENDING" | "DONE" | "FAILED"
  startedAt: string | null
  completedAt: string | null
}

export interface QuestionResult {
  questionId: number
  orderNum: number
  content: string
  maxScore: number
  earnedScore: number
  gradingResult: "CORRECT" | "PARTIAL" | "WRONG"
  aiFeedback: string | null
  studentImageUrl: string | null
  regradeStatus: "NONE" | "PENDING" | "DONE" | null
}

export interface SubmissionResultResponse {
  submissionId: number
  assignmentTitle: string
  totalScore: number
  maxScore: number
  accuracyRate: number
  correctCount: number
  partialCount: number
  wrongCount: number
  questions: QuestionResult[]
}

// --- Analytics ---
export interface AssignmentAnalyticsResponse {
  analyticsId: number
  studentId: number
  studentName: string
  questionType: string
  errorCount: number
  totalCount: number
  predictedErrorRate: number
  updatedAt: string
}
