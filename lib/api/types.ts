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
  username: string
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
  answer?: string
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
  submissionId: number
  status: "PENDING" | "DONE" | "FAILED"
  requestedAt: string | null
  gradedAt: string | null
  failReason: string | null
}

export interface QuestionResult {
  questionId: number
  questionContent: string
  result: "CORRECT" | "PARTIAL" | "WRONG"
  score: number
  maxScore: number
  imageUrl: string | null
  reason: string | null
  regradeStatus: string | null
}

export interface Summary {
  correct: number
  partial: number
  wrong: number
}

export interface SubmissionResultResponse {
  submissionId: number
  assignmentId: number
  assignmentTitle: string
  studentId: number
  studentName: string
  totalScore: number
  maxScore: number
  correctRate: number
  submittedAt: string | null
  gradedAt: string | null
  summary: Summary
  questions: QuestionResult[]
}

// --- Student ---
export interface ClassStudentResponse {
  studentId: number
  studentName: string
  studentEmail: string
  joinedAt: string
}

export interface AddStudentsRequest {
  studentEmails: string[]
}

// --- Regrade ---
export interface RegradeRequest {
  submissionId: number
  questionId: number
  studentId: number
  studentName: string
  questionContent: string | null
  currentScore: number
  maxScore: number
  currentResult: string | null
  reason: string | null
  imageUrl: string | null
  submittedAt: string
}

export interface RegradeRequestListResponse {
  assignmentId: number
  regradeRequests: RegradeRequest[]
}

export interface RegradeConfirmRequest {
  score: number
}

export interface RegradeConfirmResponse {
  questionId: number
  score: number
  result: string
  regradeStatus: string
  totalScore: number
}

// --- Leaderboard ---
export interface RankingItem {
  rank: number
  studentId: number
  studentName: string
  totalScore: number
  correctRate: number
  gradingStatus: string
  submittedAt: string | null
}

export interface LeaderboardResponse {
  assignmentId: number
  assignmentTitle: string
  maxScore: number
  rankings: RankingItem[]
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
