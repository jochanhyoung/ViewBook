# =============================================================================
# Stage 1 — base
# Node 환경 구성 + Corepack으로 pnpm 활성화
# =============================================================================
FROM node:20-alpine AS base

# Corepack은 Node 16.13+에 번들. pnpm 최신 stable 활성화
# pnpm 버전을 lockfile 기준(pnpm --version → 10.33.0)으로 고정 — @latest 금지
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

# pnpm이 글로벌 저장소를 쓸 경로 (레이어 캐시 최적화)
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

# =============================================================================
# Stage 2 — deps
# lockfile 기반으로 의존성만 설치 → 소스 변경 시 이 레이어 캐시 재사용
# =============================================================================
FROM base AS deps

# 매니페스트 + lockfile만 먼저 복사 (소스 변경과 레이어 분리)
COPY package.json pnpm-lock.yaml ./

# --frozen-lockfile: lockfile과 불일치 시 빌드 실패 (CI 안전성)
RUN pnpm install --frozen-lockfile

# =============================================================================
# Stage 3 — builder
# 소스 전체 복사 후 Next.js 프로덕션 빌드
# =============================================================================
FROM base AS builder

WORKDIR /app

# deps 스테이지의 node_modules 재사용
COPY --from=deps /app/node_modules ./node_modules

# 소스 복사 (.dockerignore로 불필요한 파일 제외됨)
COPY . .

# next.config.ts의 output: 'standalone' 옵션에 의해
# .next/standalone/ 에 server.js + 최소 런타임만 출력됨
RUN pnpm build

# =============================================================================
# Stage 4 — runner  (최종 프로덕션 이미지)
# builder 전체를 복사하지 않고 standalone 출력물만 선택 복사 → 이미지 최소화
# =============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# ── 보안: 전용 그룹·유저 생성 후 root 권한 제거 ──
RUN addgroup --system --gid 1001 nextjs \
 && adduser  --system --uid 1001 --ingroup nextjs nextjs

# 정적 파일 (public/)
COPY --from=builder --chown=nextjs:nextjs /app/public ./public

# standalone 번들 (server.js + 최소 node_modules 포함)
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./

# 정적 빌드 산출물 (.next/static/)
# standalone의 server.js가 /.next/static 경로를 참조하므로 위치 맞춤
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

# root 대신 nextjs 유저로 실행
USER nextjs

EXPOSE 3000

# standalone 출력물 루트의 server.js 직접 실행 (next start 불필요)
CMD ["node", "server.js"]
