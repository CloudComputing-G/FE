# AGENTS.md

이 문서는 에이전트가 일관된 퍼블리싱 작업을 수행하기 위한 가이드라인입니다.

## 목적

퍼블리싱(UI 구현) 작업의 일관성을 유지하기 위해 아래 규칙을 반드시 따릅니다.

## 1. 공통 컴포넌트

- **공통 컴포넌트는 [shadcn/ui](https://ui.shadcn.com)를 우선 사용**합니다.
- Button, Input, Dialog, Card, Select, Tabs 등 shadcn에 존재하는 컴포넌트는 직접 새로 만들지 말고 shadcn 컴포넌트를 가져와 사용합니다.
- shadcn에 없는 컴포넌트가 필요한 경우에만 커스텀으로 작성하며, 이때도 shadcn의 스타일·구조 컨벤션을 따릅니다.
- 설치는 `npx shadcn@latest add <component>` 명령을 사용합니다.

## 2. 아이콘

- **아이콘은 [lucide-react](https://lucide.dev)에 있는 아이콘만 사용**합니다.
- 다른 아이콘 라이브러리(react-icons, heroicons 등)나 SVG 직접 삽입은 지양합니다.
- 사용 예시:

  ```tsx
  import { ChevronRight, Search, User } from "lucide-react";

  <Search className="h-4 w-4" />;
  ```

- 크기·색상은 Tailwind 클래스(`h-4 w-4`, `text-muted-foreground` 등)로 제어합니다.

## 3. 디자인 소스 (Figma MCP)

퍼블리싱 작업을 시작하기 전에 **반드시 Figma MCP의 `get_screenshot`을 호출**하여 디자인 원본 스크린샷을 확인한 뒤 작업을 진행합니다.

### 작업 순서

1. 작업 대상 Figma 노드 또는 선택 영역에서 `get_screenshot`을 호출합니다.
2. 스크린샷을 기준으로 레이아웃, 간격, 색상, 타이포그래피를 파악합니다.
3. 필요하다면 `get_design_context`, `get_variable_defs` 등을 함께 호출해 토큰·변수 정보를 확보합니다.
4. shadcn 컴포넌트 + lucide-react 아이콘 + Tailwind로 마크업을 작성합니다.

### Figma MCP가 연결되어 있지 않은 경우

- Figma MCP 도구가 사용 불가능하거나 인증되어 있지 않다면, **임의로 추측해서 퍼블리싱을 진행하지 말고 사용자에게 먼저 알릴 것.**
- 안내 문구 예시:
  > "Figma MCP가 연결되어 있지 않은 것 같습니다. 디자인 스크린샷을 확인할 수 없으니 Figma MCP 연결을 먼저 활성화해 주세요."
- 사용자가 연결을 확인하거나 다른 지시(예: 스크린샷을 직접 업로드)를 주기 전까지는 퍼블리싱을 진행하지 않습니다.

## 4. 기본 스택 및 컨벤션

- 플랫폼: **웹앱 (모던 브라우저)**
- 프레임워크: React + TypeScript
- 스타일링: Tailwind CSS (shadcn 기본 설정)
- 컴포넌트 경로: `components/ui` (shadcn), `components/` (커스텀)
- 클래스 병합: `cn()` 유틸리티(`clsx` + `tailwind-merge`) 사용
- 접근성(a11y): 시맨틱 태그, `aria-*` 속성, 키보드 인터랙션 고려

### 웹앱 구현 규칙 — 플랫폼별 구분

#### 학생 파트 (`app/student/`) — 모바일 전용
- **기준 디바이스**: iPhone 12 Pro (390×844px, 3x 스케일) 기준으로 구현합니다.
- **고정 너비 기준**: 뷰포트 너비 390px을 기준으로 작업하며, `sm:`, `md:`, `lg:`, `xl:` 같은 데스크톱용 브레이크포인트는 사용하지 않습니다.
- **브라우저 지원**: iOS Safari 기준으로 작성합니다. Chrome DevTools에서 확인 시 "iPhone 12 Pro" 프리셋을 사용합니다.
- **터치 인터랙션 우선**: `hover` 대신 `active`, `focus-visible`로 터치 대응합니다.
- **Safe Area 고려**: `env(safe-area-inset-*)` 또는 Tailwind의 `pb-safe` 등으로 홈 인디케이터 영역을 고려합니다.
- **네이티브 전용 API 금지**: React Native, Capacitor 같은 네이티브 브릿지 API는 사용하지 않습니다.

#### 교사 파트 (`app/teacher/`) — 데스크톱 전용
- **데스크톱 화면 전용**: 교사 화면은 PC/데스크톱 브라우저 기준으로 구현합니다.
- **레이아웃**: 왼쪽 고정 사이드바(`w-60`) + 오른쪽 메인 컨텐츠 영역 구조를 사용합니다.
- **반응형**: 데스크톱 뷰포트(1280px 이상)를 기준으로 하며, 모바일 대응은 하지 않습니다.
- **인터랙션**: `hover:` 클래스를 적극 활용하며, `active:` 터치 대응은 불필요합니다.
- **네비게이션**: `BottomNav` 대신 `Sidebar` 컴포넌트(`components/teacher/Sidebar.tsx`)를 사용합니다.
- **브레이크포인트**: 필요한 경우 `lg:`, `xl:` 브레이크포인트를 사용할 수 있습니다.

## 5. 체크리스트

퍼블리싱을 끝내기 전에 아래 항목을 확인합니다.

**공통**
- [ ] Figma `get_screenshot`으로 디자인 원본을 확인했는가?
- [ ] 공통 컴포넌트는 shadcn/ui를 사용했는가?
- [ ] 아이콘은 lucide-react만 사용했는가?
- [ ] Tailwind 클래스가 일관되게 사용되었는가?
- [ ] 접근성(시맨틱 태그, aria, 키보드 인터랙션) 처리가 되어 있는가?

**학생 파트 (모바일)**
- [ ] iPhone 12 Pro(390×844px) 기준으로 레이아웃이 정상인가? (Chrome DevTools "iPhone 12 Pro" 프리셋으로 확인)
- [ ] 터치 인터랙션(`active:`, `focus-visible:`)이 적용되어 있는가?
- [ ] 데스크톱 브레이크포인트(`sm:` 이상)가 사용되지 않았는가?
- [ ] 홈 인디케이터 Safe Area가 고려되어 있는가?

**교사 파트 (데스크톱)**
- [ ] 사이드바(`Sidebar` 컴포넌트)를 사용했는가? (`BottomNav` 미사용)
- [ ] 데스크톱 뷰포트(1280px 이상)에서 레이아웃이 올바른가?
- [ ] `hover:` 인터랙션이 적용되어 있는가?
- [ ] 모바일 전용 요소(상태바 `9:41`, `BottomNav` 등)가 포함되지 않았는가?
