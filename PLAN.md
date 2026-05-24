# Checkmate 프론트엔드 개발 계획

## Context

Checkmate — AI 기반 수학 자동 채점 + 학습 관리 플랫폼 (모바일 웹).  
프론트엔드 3명: UI 퍼블리싱 1명 + 학생 파트 1명 + 교사 파트 1명.  
백엔드는 다른 팀원이 병행 개발 중. Figma MCP로 디자인 참조.

---

## 기술 스택 (확정 — 레포 기준)

| 영역 | 선택 | 버전 |
|------|------|------|
| 프레임워크 | Next.js | 16.2.6 |
| 언어 | TypeScript | ^5 |
| UI 라이브러리 | React | 19.2.4 |
| 스타일링 | Tailwind CSS | ^4 |
| 컴포넌트 | shadcn/ui | latest |
| 아이콘 | lucide-react | ^1.16 |
| API 통신 | Axios + TanStack Query | Axios 1.x / TanStack Query 5.x |
| 패키지 매니저 | npm | (package-lock.json 기준) |

---

## 프로젝트 구조

```
app/
├── (auth)/           # 로그인, 회원가입 (공통)
├── teacher/          # 교사 페이지들
│   ├── dashboard/
│   ├── assignments/
│   └── results/
└── student/          # 학생 페이지들
    ├── assignments/
    ├── upload/
    ├── results/
    ├── review/       # 오답노트
    └── chat/         # AI 챗봇

components/
├── ui/               # shadcn 컴포넌트
└── (커스텀 공통 컴포넌트)

lib/
├── api/              # Axios 인스턴스, API 함수
└── utils.ts
```

---

## 작업 분담

### UI 퍼블리싱 (1명)
- Figma MCP 참조하여 전체 화면 퍼블리싱
- 공통 레이아웃, 네비게이션
- shadcn 컴포넌트 기반 UI 구현

### 교사 파트 (1명) — API 연동 + 로직
- 과제 CRUD (정답 + 채점기준 입력/수정/삭제)
- 학생별 점수 목록 / 대시보드
- 학생 문항별 상세 결과 (AI 판단 근거 카드)
- 재채점 요청
- 알림 수신함

### 학생 파트 (1명) — API 연동 + 로직
- 내 과제 목록
- 풀이 사진 업로드 (카메라/갤러리 → S3 Presigned URL)
- 채점 결과 조회 (문항별 정오답 카드)
- 오답노트
- AI 챗봇 (문항별 질의응답)
- 취약 문제 추천

---

## 팀 공통 규칙

1. **패키지 매니저**: npm (package-lock.json 유지)
2. **공통 컴포넌트**: shadcn/ui 우선, `npx shadcn@latest add <component>`
3. **아이콘**: lucide-react만 사용
4. **디자인 소스**: Figma MCP `get_screenshot` 필수 확인 후 작업
5. **모바일 전용**: 375~430px 기준, 데스크톱 브레이크포인트 미사용
6. **Git 브랜치**: feature/teacher-*, feature/student-*, feature/ui-*
7. **커밋 컨벤션**: feat/fix/chore 접두사

---

## 검증 방법

- `npm run dev`로 로컬 실행 후 모바일 뷰포트(Chrome DevTools)에서 확인
- 주요 흐름: 로그인 → 과제 목록 → 상세 → 업로드/채점결과
- 백엔드 연동 시: Network 탭에서 API 호출 확인
