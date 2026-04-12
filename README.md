# ViewBook

수학 디지털 교과서 — Next.js 15 App Router + TypeScript

## Getting Started

개발 서버 실행:

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000) 에서 결과를 확인하세요.

`app/page.tsx` 를 수정하면 페이지가 자동으로 업데이트됩니다.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy on Vercel

[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) 을 통해 배포하거나, 아래 Docker 가이드를 참고하세요.

---

## 🐳 Docker로 실행하기

### 사전 준비

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 설치
- `.env.local` 파일 세팅 (`.env.example` 참고)

```bash
cp .env.example .env.local
# .env.local 열고 GEMMA_API_KEY 등 실제 값으로 교체
```

### 프로덕션 실행

```bash
docker compose up --build
```

### 개발 환경 실행 (핫리로드)

```bash
docker compose -f docker-compose.dev.yml up --build
```

### 종료

```bash
docker compose down
```
