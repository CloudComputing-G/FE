export interface ApiResponse<T> {
  success: boolean
  code: string
  message: string
  data: T
  fieldErrors?: FieldError[]
}

export interface FieldError {
  field: string
  message: string
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

export interface AssignmentResponse {
  assignmentId: number
  title: string
  subject: string
  status: AssignmentStatus
  dueDate: string
  createdAt: string
  questions: QuestionResponse[]
  totalCount: number
  submittedCount: number
  gradedCount: number
  notSubmittedCount: number
  problemUrl: string
  answerUrl: string
}

export interface QuestionResponse {
  questionId: number
  content: string
  answer: string
  gradingCriteria: string
  maxScore: number
  orderNum: number
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
