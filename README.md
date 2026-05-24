# cloud-computing

Next.js 16 기반 모바일 웹앱 프로젝트입니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Icons**: lucide-react
- **Data Fetching**: TanStack Query v5 + axios

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속합니다.

### 3. 빌드

```bash
npm run build
npm start
```

## 주요 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (Hot Reload) |
| `npm run build` | 프로덕션 빌드 |
| `npm start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |

## shadcn 컴포넌트 추가

```bash
npx shadcn@latest add <component>

# 예시
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add input
```
