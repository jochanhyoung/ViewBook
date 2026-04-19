# 📚 ViewBook

**수학 디지털 교과서 AI 플랫폼**

<br>

## 🔎 ViewBook은 초·중·고 학생을 위한 AI 기반 수학 디지털 교과서</mark>입니다.

> 수학 교과서를 펼쳐도 수식의 의미를 이해하기 어려웠던 경험, 있으신가요?

**수학 디지털 교과서 AI 플랫폼, "ViewBook"** 은 수식을 읽는 것에서 나아가 *이해*하는 경험</mark>을 제공합니다.<br>
사진 한 장으로 AI가 단계별 풀이를 생성</mark>하고, 인터랙티브 시각화</mark>로 수식이 그래프에 미치는 영향을 실시간으로 확인할 수 있습니다.

<br>

# 🧑‍💻 팀소개

### 팀명 : 불어일견

### R&R

| 분야   | 이름   | 포지션                                                                          |
| ------ | ------ | ------------------------------------------------------------------------------- |
| 개발   | 조찬형 | 👑 팀 리드, 전체 구조 설계, 서버 배포                                          |
| 개발   | 이지윤 | 🖥️ 프론트엔드, UI 구현 및 버그 수정                                            |
| 개발   | 황민준 | 🖥️ 프론트엔드, UI 구현 및 버그 수정                                            |
| 개발   | 여수연 | 🤖 AI 연동, AWS 인프라, DB 설계 및 관리                                        |

<br>

# 📌 목적 및 필요성

### 1. 목적

**"ViewBook"은 초·중·고 수학 교육과정 전반을 AI와 인터랙티브 시각화</mark>로 재현한 디지털 교과서 플랫폼입니다.**
사용자가 **_수식의 의미를 직접 조작_** 하며 이해할 수 있도록, **_단계별 AI 풀이_**, **_실시간 그래프 시각화_**, **_카메라 기반 문제 인식_** 까지 — 수학 학습의 모든 과정을 체계적으로 지원합니다.

<br>

### 2. 필요성

#### 📸 수학 교과서는 여전히 정적</mark>이다

교과서에 인쇄된 수식과 그래프는 고정되어 있습니다. 학생이 "$a$값이 달라지면 포물선이 어떻게 바뀌는지" 직접 확인하려면 수십 개의 점을 손으로 계산해 찍어야 합니다.

💡 **파라미터를 슬라이더로 조작</mark>하면서 수식과 그래프의 관계를 즉시 확인할 수 있는 환경이 필요합니다.**

<br>

> **수식 풀이 과정을 단계별</mark>로 설명해 주는 도구가 없다**

시중의 수학 앱은 최종 답만 제공하거나, 풀이가 있더라도 긴 텍스트로만 설명합니다. 풀이의 각 단계가 어떤 수학적 원리를 사용했는지, 왜 그런 변환이 가능한지 시각적으로 연결해주는 도구는 부재합니다.

💡 **LaTeX 슬라이드</mark> 형태로 단계별 수식 전개를 보여주고, 동시에 그래프로 그 의미를 시각화해야 합니다.**

<br>

> **문제를 직접 찍어 AI에게 물어보고 싶다</mark>**

학생들은 문제집을 풀다가 막히면 검색하거나 과외 선생님을 기다려야 합니다. 스마트폰 카메라로 문제를 찍어 즉시 단계별 풀이와 시각화를 받을 수 있는 도구가 필요합니다.

💡 **카메라로 문제를 촬영</mark>하면 AI가 풀이를 생성하고, 결과를 인터랙티브 시각화로 연결합니다.**

<br><br>

# 🔍 리서치 및 시장조사

## 1. 시장조사

### 1️⃣ 에듀테크 시장의 빠른 성장

글로벌 에듀테크 시장은 2023년 기준 약 142조 원</mark> 규모로, 연평균 13% 이상</mark> 성장 중입니다. 특히 AI 기반 개인화 학습 도구</mark>와 인터랙티브 콘텐츠 분야가 가장 빠르게 성장하고 있습니다.

### 2️⃣ 수학 교육의 특수성

수학은 전 학년에 걸쳐 가장 사교육 지출이 높은 과목</mark>입니다. 교육부 통계에 따르면 초·중·고 학생 중 수학 사교육 참여율은 약 60% 이상</mark>으로, 공교육 보완 수요가 지속적으로 높습니다.

### 3️⃣ 기존 서비스의 한계

| 기준/서비스명 | 수학 전문 앱 (A) | AI 풀이 앱 (B) | 디지털 교과서 (C) |
| ------------- | ---------------- | -------------- | ----------------- |
| 타겟          | 고등학생         | 전 학년        | 초·중·고          |
| 인터랙티브 시각화 | ❌ 없음       | ❌ 없음        | △ 일부            |
| 단계별 LaTeX 풀이 | ❌ 없음       | △ 텍스트만     | ❌ 없음           |
| 카메라 문제 인식 | ❌ 없음        | ✅             | ❌ 없음           |
| 커리큘럼 연계  | △ 일부          | ❌ 없음        | ✅                |
| 오프라인 사용  | ❌              | ❌             | △                 |

💡 **AI 풀이 + 인터랙티브 시각화 + 교과 커리큘럼</mark>을 동시에 제공하는 서비스는 현재 시장에 존재하지 않습니다.**

## 2. 경쟁사 분석

ViewBook만의 차별점은 다음 세 가지입니다.

### 1️⃣ **수식 엔진의 안전한 샌드박스</mark>**
사용자 입력 수식을 `mathjs` AST 화이트리스트 기반으로 평가합니다. 기존 서비스들이 단순 문자열 파싱에 의존하는 반면, ViewBook은 허용 노드 타입과 함수 목록으로 보안을 보장합니다.

### 2️⃣ **시각화와 교과 콘텐츠의 완전한 통합</mark>**
단순 계산기나 그래프 도구가 아닌, 교과 개념 설명 → 예제 → 시각화 → 연습문제로 이어지는 완결된 학습 흐름</mark>을 제공합니다.

### 3️⃣ **AI 풀이의 수학적 검증</mark>**
AI가 생성한 풀이를 `verify-math.ts`를 통해 수학적으로 재검증합니다. 오답 풀이를 그대로 제공하는 다른 서비스와 달리, 검증된 풀이만</mark> 사용자에게 전달합니다.

## 3. 목표 시장

| TAM | SAM | SOM |
| --- | --- | --- |
| 국내 초·중·고 재학 학생 수 | 수학 사교육 이용 학생 수 | 에듀테크 앱 이용 의향 학생 수 |
| 약 530만 명 | 약 320만 명 | 약 160만 명 |

<br>

# 🎯 서비스 타겟층 설정

ViewBook의 목표 타겟입니다.

| 분류 | 타겟 설정 | 관련 기능 |
| ---- | --------- | --------- |
| 1차 타겟 설정 | 수학 개념을 시각적으로 이해하고 싶은 중·고등학생 | 인터랙티브 시각화, SolutionSlides 단계별 풀이, 카메라 AI 풀이 |
| 2차 타겟 설정 | 수업 보조 자료를 찾는 수학 교사 | 커리큘럼 연계 콘텐츠, 시각화 딥링크 공유, 관리자 캐시 기능 |

<br>

# 💡 서비스 소개

## 1. 개요

**수학 디지털 교과서 AI 플랫폼, "ViewBook"** 은 초·중·고 수학 교육과정 전반의 학습과정을 지원합니다.

수학 개념 학습에 필요한 교과 연계 콘텐츠</mark>와 조건별 인터랙티브 시각화</mark>를 더욱 쉽게 확인하고, 카메라 한 장으로 AI가 단계별 풀이와 시각화를 생성</mark>합니다.

"ViewBook"은 개념 탐색부터 예제 풀이, AI 문제 해결, 시각화 탐구까지 전반적인 수학 학습 과정의 불편함을 최소화하고 효율적인 학습</mark>을 돕는 데 초점을 맞춥니다.

<br>

## 2. 우리 서비스만의 강점 (경쟁사와의 차별점)

### 1️⃣ **인터랙티브 Canvas 시각화 — 보는 교과서가 아닌 조작하는 교과서</mark>**

18개 이상</mark>의 SVG 기반 시각화 컴포넌트가 교과 개념과 1:1로 연결됩니다. 슬라이더로 기울기를 바꾸면 직선이 실시간으로 움직이고, 분할 수를 조절하면 리만합이 수렴하는 과정을 눈으로 확인할 수 있습니다.

- 기존 서비스에는 없는 수식과 그래프의 실시간 양방향 연결- 모든 시각화는 CSS 변수로 다크/라이트 테마와 완전 동기화

### 2️⃣ **SolutionSlides — LaTeX 수식의 단계별 전개</mark>**

AI가 생성하거나 교과서에 내장된 풀이를 LaTeX 슬라이드 카드 형태로 순차 전개합니다.

- 각 스텝에 레이블(STEP 1, 극한값 계산 등)과 힌트 박스 제공
- 최종 답안에서 accent 컬러 glow 효과로 시각적 완결감</mark> 제공
- 키보드(스페이스바, 방향키)로 스텝 탐색 가능

### 3️⃣ **카메라 AI 풀이 — 찍으면 바로 단계별 풀이 + 시각화</mark>**

스마트폰 카메라로 수학 문제를 촬영하면, AI가 풀이를 생성하고 Zod 스키마로 검증한 후 인터랙티브 시각화로 연결합니다.

- Perceptual hash</mark> 기반 유사 문제 감지 → IndexedDB 캐시 히트 시 즉시 반환
- EXIF 스트리핑 + magic byte 검증으로 이미지 보안 처리
- `/api/gemma` 프록시를 통해 API 키를 클라이언트에 노출하지 않음
### 4️⃣ **세분화된 커리큘럼 — 초·중·고 완전 분리 라우팅</mark>**

초등(규칙과 변화) → 중등(함수와 그래프) → 고등(미분·적분)으로 이어지는 13개 교과 페이지</mark>가 `src/content/pages/`에 TypeScript로 정의됩니다.

- 빌드 타임 `generateStaticParams`로 전 페이지 SSG 처리</mark>, 런타임 지연 없음
- 블록 가중치 기반 자동 시트 분할 → URL `?sheet=N`으로 딥링크 공유

<br>

## 3. 핵심 기능

| 핵심기능 | 설명 | 목적 |
| -------- | ---- | ---- |
| 📊 인터랙티브 시각화 | 기울기·절편·분할 수 등 파라미터를 슬라이더로 실시간 조작 | 수식과 그래프의 인과관계를 직접 체험하여 개념 이해도 향상 |
| 📝 SolutionSlides | LaTeX 수식을 단계별 슬라이드 카드로 순차 전개 | 풀이의 각 단계가 어떤 원리를 사용했는지 명확히 전달 |
| 📸 카메라 AI 풀이 | 문제 사진 촬영 → AI 분석 → 단계별 풀이 + 시각화 생성 | 학습 중 막히는 순간 즉시 도움을 받아 학습 흐름 유지 |
| 🔒 safeMath 엔진 | 허용 목록 기반 mathjs 샌드박스로 사용자 수식 안전 평가 | 사용자 입력으로 인한 보안 위협 차단 |
| 🌙 테마 시스템 | CSS 변수 기반 다크/라이트 모드, FOUC 방지 인라인 스크립트 | 다양한 학습 환경(야간, 주간)에서 최적의 가독성 제공 |
| 💾 풀이 캐시 | Dexie(IndexedDB) + perceptual hash 기반 중복 감지 | 동일/유사 문제 재요청 시 즉시 결과 반환으로 UX 향상 |

<br>

## 4. IA 정보 구조도

```
ViewBook
├── / (홈)
│   └── 과정 선택 (초등 / 중등 / 고등)
│
├── /read/[slug]             교과서 리더
│   ├── ?sheet=0             IntroSheet (제목 + 학습 목표)
│   ├── ?sheet=1~N           ContentSheet (개념, 예제, 정리)
│   ├── ?sheet=N+1           ExercisesSheet (연습문제)
│   └── ?sheet=N+2           TermsSheet (핵심 용어)
│
├── /visualize/[payload]     시각화 뷰어 (독립 경로)
│   ├── SolutionSlides       단계별 LaTeX 풀이
│   ├── SVG 시각화 컴포넌트  인터랙티브 그래프
│   └── 키보드 네비게이션    스페이스/방향키/ESC
│
├── /api/gemma               AI 풀이 프록시 (서버 전용)
│
└── /teacher/cache           관리자 캐시 관리
```

<br>

# 💰 서비스 비즈니스 모델

> "ViewBook"은 전국의 초·중·고 학생과 수학 교사가 한 곳에서 수학 개념 학습과 AI 풀이를 경험할 수 있는 디지털 교과서 플랫폼입니다. <br><br> 궁극적으로 학생들의 수학 학습 효율을 높이고자 하는 비전을 가지고 있는 "ViewBook"의 수학 학습 관련 서비스를 직접적으로 경험하게 될 학생·교사에게 해당 서비스를 무료로 제공하고자 합니다.

|             | 관련 파트너 1 | 관련 파트너 2          | 내용                                                                          |
| ----------- | ------------ | ---------------------- | ----------------------------------------------------------------------------- |
| 무료 &nbsp; | ViewBook     | 학생 (일반 이용자)     | 회원가입 및 로그인 시, 서비스 내 모든 기능 이용 가능 (미로그인 시 기능 제한) |
| 유료 &nbsp; | ViewBook     | 교육 기관/학원 &nbsp;  | 교사 대시보드, 학습 현황 분석, 맞춤형 콘텐츠 제공 등 프리미엄 기능            |

** 추후 확장 서비스에서는 다음과 같은 비즈니스 모델이 추가 적용됩니다.

|             | 관련 파트너 1 | 관련 파트너 2 | 내용                                                                                      |
| ----------- | ------------ | ------------- | ----------------------------------------------------------------------------------------- |
| 유료 &nbsp; | ViewBook     | 교육 콘텐츠 파트너 | 출판사·에듀테크 기업과 콘텐츠 라이선스 계약 — 교과 연계 문제 DB 확장, 프리미엄 시각화 |

<br>

# 🔨 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│                                                              │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐  │
│  │  BookViewer  │  │ VisualizePage │  │  CameraModal     │  │
│  │  /read/[slug]│  │ /visualize/   │  │  이미지 업로드   │  │
│  └──────┬───────┘  └───────┬───────┘  └────────┬─────────┘  │
│         │                  │                    │            │
│  ┌──────▼──────────────────▼────────────────────▼─────────┐  │
│  │              Zustand Global Store                       │  │
│  │  (시각화 플레이백 / AI 상태 / 카메라 모달)              │  │
│  └──────┬──────────────────────────────────────────────────┘  │
│         │                                                    │
│  ┌──────▼──────────────┐   ┌──────────────────────────────┐  │
│  │   safeMath Engine   │   │   Dexie (IndexedDB)          │  │
│  │   허용목록 샌드박스  │   │   풀이 캐시 + phash 중복감지 │  │
│  └─────────────────────┘   └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                        │
│                    /api/gemma  (프록시)                      │
│                    레이트 리미팅 + Zod 검증                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Gemma AI Server                         │
│                   (외부 AI API 엔드포인트)                   │
└─────────────────────────────────────────────────────────────┘
```

<br>

# 💻 Technology

### 🖥 FrontEnd / App

- <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=TypeScript&logoColor=white"> 5.x
- <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=Next.js&logoColor=white"> 16.2.3
- <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=black"> 19.2.4
- <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat&logo=Tailwind CSS&logoColor=white"> 4.x (PostCSS-first)
- <img src="https://img.shields.io/badge/KaTeX-008080?style=flat&logo=LaTeX&logoColor=white"> 0.16.45
- <img src="https://img.shields.io/badge/math.js-FF6B35?style=flat&logo=javascript&logoColor=white"> 15.2.0
- <img src="https://img.shields.io/badge/Framer Motion-0055FF?style=flat&logo=Framer&logoColor=white"> 12.38.0
- <img src="https://img.shields.io/badge/Zustand-433e38?style=flat&logo=react&logoColor=white"> 5.0.12
- <img src="https://img.shields.io/badge/Dexie.js-FF8C00?style=flat&logo=javascript&logoColor=white"> 4.4.2
- <img src="https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white"> 4.3.6
- <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=Docker&logoColor=white">

<br>

## 🗂️ 기술 스택 선정 이유

### **🖥 FrontEnd 스택 선정 이유**

- <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=Next.js&logoColor=white">

  - App Router 기반 `generateStaticParams`로 13개 교과 페이지를 빌드 타임에 SSG 처리</mark>, 런타임 TTI 최소화
  - API Routes(`/api/gemma`)로 AI 키를 서버에서만 관리</mark>, 클라이언트 번들에 노출 방지
  - Streaming + Suspense로 AI 응답 생성 중에도 UI 블로킹 없음

- <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=black">

  - React 19의 `use()` hook으로 비동기 데이터를 선언적으로 처리
  - `useTransition`으로 시트 전환 시 UI 블로킹 방지
- <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat&logo=Tailwind CSS&logoColor=white">

  - v4 PostCSS-first 방식으로 `tailwind.config.js` 불필요 — `@theme` 블록에서 직접 CSS 변수와 토큰 정의
  - 유틸리티 클래스 + CSS 변수 토큰 체계를 결합해 테마 변경(다크/라이트)을 단일 HTML 클래스 토글</mark>로 처리

- <img src="https://img.shields.io/badge/KaTeX-008080?style=flat&logo=LaTeX&logoColor=white">

  - MathJax 대비 10배 빠른</mark> 렌더링 속도, SSR 완전 호환
  - `react-katex`로 `<InlineMath>` / `<BlockMath>` 컴포넌트를 React tree에 자연스럽게 통합

- <img src="https://img.shields.io/badge/math.js-FF6B35?style=flat&logo=javascript&logoColor=white">

  - AST 기반 파서</mark>로 수식을 노드 단위로 순회 가능 → 화이트리스트 필터 구현에 필수
  - `evaluate()` 직접 사용 대신 `safeMath` 래퍼로 샌드박싱하여 임의 코드 실행 차단
- <img src="https://img.shields.io/badge/Zustand-433e38?style=flat&logo=react&logoColor=white">

  - Context API 없이 전역 상태(시각화 플레이백 인덱스, AI 상태, 카메라 모달) 관리
  - 불필요한 리렌더링 없이</mark> 특정 상태 슬라이스만 구독 가능

- <img src="https://img.shields.io/badge/Dexie.js-FF8C00?style=flat&logo=javascript&logoColor=white">

  - IndexedDB 래퍼로 AI 풀이 결과를 세션 종료 후에도 영구 캐싱  - Perceptual hash 기반 유사 문제 감지 → 동일/유사 문제 재요청 시 즉시 반환
- <img src="https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white">

  - AI 응답 + 시각화 URL 페이로드를 45개 이상의 스텝 타입 유니온</mark>으로 런타임 검증
  - 검증 실패 시 오답/악의적 페이로드가 렌더링 단계까지 도달하지 못하도록</mark> 차단

<br>

# 📐 Naming Rules

### 🧑🏻‍💻 FrontEnd

- **네이밍 종류**

  - `camelCase` : 소문자로 시작하고 대문자로 시작하는 모든 하위 단어
  - `PascalCase` : 모든 단어를 대문자로 시작
  - `kebab-case` : 하이픈으로 구분된 단어
  - `UPPER_SNAKE_CASE` : 밑줄로 구분된 단어로 모든 단어가 대문자

- **네이밍 규칙**
  - **Folder** : `kebab-case`
  - **File (Component)** : `PascalCase`
  - **File (Utility/Lib)** : `kebab-case`
  - **Variable** : `camelCase`
  - **Function** : `camelCase`
  - **Constant** : `UPPER_SNAKE_CASE`
  - **Type/Interface** : `PascalCase`
  - **Zod Schema** : `camelCase` + `Schema` suffix (예: `solutionStepSchema`)

<br>

# Commit Convention

### 🧑🏻‍💻 FrontEnd

| Tag      | Title                                  |
| -------- | -------------------------------------- |
| feat     | 새로운 기능 추가                       |
| design   | UI 디자인 추가 및 수정                 |
| fix      | 버그 및 이슈 수정                      |
| refactor | 코드 리팩토링                          |
| init     | 프로젝트 초기 환경 설정                |
| config   | 프로젝트 개발 중 환경 설정             |
| docs     | README나 템플릿 등의 문서 추가 및 수정 |
| perf     | 성능 개선 (시각화 최적화 등)           |
| chore    | 의존성 추가, 패키지 구조 변경          |

**커밋 메시지 형식**

```
[Tag]: 작업 내용 요약

Ex) feat: 리만합 시각화 컴포넌트 추가
Ex) fix: safeMath 허용 함수 목록 누락 수정
Ex) design: 다크모드 accent 컬러 토큰 조정
```

<br>

# Git Convention

### 🧑🏻‍💻 FrontEnd

#### Github Flow

##### Branch Rule

**main** : 최종 배포 브랜치

##### Branch 네이밍

`[Header]/[작업 내용 요약 or 기능명]`

| Header   | Description                                                                 |
| -------- | --------------------------------------------------------------------------- |
| main     | 'main' 브랜치는 배포 가능한 상태만을 관리합니다.                          |
| feat     | 새 기능 개발 브랜치. 완료 후 'main'으로 merge합니다.                       |
| fix      | 버그 수정 브랜치. 수정 완료 후 'main'으로 merge합니다.                     |
| refactor | 리팩토링 전용 브랜치. 완료 후 'main'으로 merge합니다.                     |
| design   | UI/UX 수정 브랜치.                                                          |
| docs     | 문서 수정 전용 브랜치.                                                      |

**예시**
```
feat/riemann-sum-visualization
fix/safe-math-whitelist
design/dark-mode-accent-color
docs/update-readme
```

<br>

# Project Structure

### 🧑🏻‍💻 FrontEnd

```
ViewBook/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                 # 홈 (/) — 과정 선택
│   │   ├── layout.tsx               # 루트 레이아웃 (ThemeProvider, FOUC 방지 스크립트)
│   │   ├── globals.css              # CSS 변수 전체 정의 + Tailwind v4 @theme 블록
│   │   ├── read/[slug]/page.tsx     # 교과서 리더 (SSG, generateStaticParams)
│   │   ├── visualize/[payload]/     # 시각화 뷰어 (sessionStorage 복귀 패턴)
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── api/gemma/route.ts       # AI 풀이 프록시 (서버 전용, 레이트 리미팅)
│   │   └── teacher/cache/page.tsx   # 관리자 캐시 관리
│   │
│   ├── components/
│   │   ├── layout/                  # BookViewer, EbookShell, LeftPane, RightStage 등
│   │   ├── blocks/                  # BlockRenderer + 블록 타입별 컴포넌트 (12종)
│   │   │   ├── BlockRenderer.tsx    # kind 기반 스위치 디스패처
│   │   │   ├── ExampleBlock.tsx     # 예제 (시각화 연결 포함)
│   │   │   ├── ExerciseBlock.tsx    # 연습문제 (힌트/풀이 토글)
│   │   │   └── ...
│   │   ├── visualization/           # 인터랙티브 SVG 시각화 컴포넌트 (18종 이상)
│   │   │   ├── SolutionSlides.tsx   # LaTeX 단계별 슬라이드
│   │   │   ├── DerivativeGraph.tsx  # f(x) ↔ f'(x) 동기화 그래프
│   │   │   ├── RiemannSum.tsx       # 리만합 수렴 시각화
│   │   │   ├── SystemOfEquations.tsx# 연립방정식 교점 시각화
│   │   │   └── ...
│   │   ├── solution/
│   │   │   └── SolutionPlayer.tsx   # 스텝 재생 UI (플레이/일시정지)
│   │   ├── inline/
│   │   │   ├── VisualizeButton.tsx  # 시각화 진입 + sessionStorage 저장
│   │   │   └── LatexTextRenderer.tsx# 인라인 LaTeX + 마크다운 렌더러
│   │   ├── ai/
│   │   │   ├── CameraFab.tsx        # 카메라 FAB 버튼
│   │   │   └── CameraModal.tsx      # 이미지 업로드 + AI 풀이 생성 모달
│   │   ├── ThemeProvider.tsx        # 다크/라이트 모드 컨텍스트 + localStorage
│   │   └── ThemeToggle.tsx          # 테마 토글 버튼
│   │
│   ├── content/                     # 교과 콘텐츠 데이터 레이어
│   │   ├── index.ts                 # 과정 레지스트리 (getPage, getCourseBySlug 등)
│   │   ├── seed-solutions.ts        # 캐시 초기화용 사전 풀이 데이터
│   │   └── pages/                   # 13개 교과 페이지 TypeScript 정의
│   │       ├── 11-clock-angle.ts    # 초등 — 시계 각도
│   │       ├── 12-salt-concentration.ts
│   │       ├── 13-calendar-pattern.ts
│   │       ├── 14-distance-time.ts
│   │       ├── 20-coordinate-plane.ts # 중등 — 좌표평면
│   │       ├── 21-linear-function.ts
│   │       ├── 22-quadratic-function.ts
│   │       ├── 24-system-of-equations.ts
│   │       ├── 01-derivative-definition.ts # 고등 — 미분
│   │       ├── 02-power-rule.ts
│   │       ├── 03-polynomial-derivative.ts
│   │       ├── 04-tangent-line.ts
│   │       └── 05-definite-integral.ts
│   │
│   ├── lib/                         # 핵심 유틸리티 라이브러리
│   │   ├── safe-math.ts             # mathjs 샌드박스 (허용 목록 기반 수식 평가)
│   │   ├── normalize-expr.ts        # 암묵적 곱셈 정규화 (2x → 2*x)
│   │   ├── verify-math.ts           # AI 풀이 수학적 검증
│   │   ├── schemas.ts               # Zod 검증기 (45개 이상 스텝 타입 유니온)
│   │   ├── viz-payload.ts           # URL-safe base64 인코딩/디코딩
│   │   ├── paginate.ts              # 블록 가중치 기반 시트 분할 알고리즘
│   │   ├── cache.ts                 # Dexie(IndexedDB) 풀이 캐시
│   │   ├── phash.ts                 # Perceptual hash (유사 이미지 중복 감지)
│   │   ├── image.ts                 # 이미지 검증 & 리사이징 & EXIF 스트리핑
│   │   ├── gemma-client.ts          # AI API 클라이언트
│   │   ├── rate-limit.ts            # API 레이트 리미팅
│   │   └── security.ts              # 보안 체크리스트
│   │
│   ├── store/
│   │   └── textbook-store.ts        # Zustand 전역 상태
│   │
│   └── types/
│       ├── content.ts               # Page, Block, Exercise 타입 정의
│       └── visualization.ts         # 20개 이상 VisualizationStep 유니온 타입
│
├── public/                          # 정적 에셋
├── .env.local                       # 환경 변수 (GEMMA_API_KEY 등)
├── next.config.ts
├── tailwind.config.ts               # Tailwind v4 설정
├── postcss.config.mjs
├── tsconfig.json
├── Dockerfile
└── pnpm-lock.yaml
```

<br>

# 🏗 개발 원칙 (Strict Rules)

### 🧑🏻‍💻 네비게이션 규칙

> `router.back()` 사용 금지</mark> — 브라우저 히스토리 스택 신뢰 불가

교과서 뷰어(`/read/[slug]`) → 시각화 페이지(`/visualize/[payload]`) → 뒤로가기 흐름에서 `router.back()`은 플랫폼에 따라 엉뚱한 페이지로 이동하는 버그를 유발합니다.

**대신 사용하는 패턴:**

```typescript
// VisualizeButton.tsx — 진입 시 현재 URL을 sessionStorage에 저장
const RETURN_KEY = 'visualize_return_url';
const VALID_PREFIXES = ['/read/', '/chapters/', '/book/', '/teacher/'];

sessionStorage.setItem(RETURN_KEY, window.location.pathname + window.location.search);
router.push(`/visualize/${payload}`);

// visualize/page.tsx — 복귀 시 router.replace() 사용
const goBack = useCallback(() => {
  sessionStorage.removeItem(RETURN_KEY);
  router.replace(returnUrlRef.current ?? '/read'); // push 아닌 replace
}, [router]);
```

| 규칙 | 이유 |
| ---- | ---- |
| `router.back()` 금지 | 히스토리 스택 불신뢰 |
| `router.replace()`로 복귀 | 시각화 페이지를 히스토리에 쌓지 않음 |
| `sessionStorage`로 복귀 URL 관리 | 탭 종료 시 자동 소멸, `localStorage`보다 안전 |
| 복귀 URL 화이트리스트 검증 | Open Redirect 공격 차단 |
| 폴백 URL 필수 지정 | `sessionStorage` 접근 불가 시 안전한 복귀 |

### 🔒 보안 규칙

- 사용자 입력 수식은 반드시 `safeEval` / `safeParseFn` 경유</mark> — `math.evaluate()` 직접 호출 금지
- AI 시크릿 키는 `NEXT_PUBLIC_` 접두어 절대 금지</mark> — `/api/gemma` 프록시 경유 필수
- 이미지 업로드 시 magic byte 검증 + EXIF 스트리핑</mark> 필수
- 모든 AI 응답은 Zod 스키마 검증 후</mark> 렌더링

### 🎨 스타일 규칙

- 테마 색상은 Tailwind 유틸리티 직접 사용 금지 → `var(--color-*)` CSS 변수 사용- 시각화 컴포넌트 색상은 반드시 `--color-vis-*` 토큰 사용</mark> — 다크/라이트 자동 동기화

---

## 🚀 시작하기

### 필수 환경

- Node.js 20+
- pnpm 9+

### 설치 및 실행

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build && pnpm start
```

### 환경 변수

```env
# .env.local
GEMMA_API_KEY=your_api_key_here
GEMMA_API_URL=https://...
```

> **주의:** `NEXT_PUBLIC_` 접두어 사용 시 클라이언트 번들에 노출됩니다.

### Docker

```bash
docker compose up --build                          # 프로덕션
docker compose -f docker-compose.dev.yml up --build  # 개발 (핫리로드)
docker compose down
```
