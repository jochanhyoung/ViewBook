'use client';
// src/lib/gemma-client.ts
import { SolutionSchema, type Solution } from './schemas';
import { lookupByText, lookupByPhash, cacheSolution } from './cache';
import { computePhash } from './phash';
import { blobToBase64 } from './image';
import { seedSolutions } from '@/content/seed-solutions';

function normalizeProblem(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '').replace(/[^\w가-힣]/g, '');
}

export async function solveFromImage(blob: Blob, problemText?: string): Promise<Solution> {
  // 1. Seed 캐시 확인 (Gemma 호출 없이 즉시 응답)
  if (problemText) {
    const normalized = normalizeProblem(problemText);
    for (const seed of seedSolutions) {
      if (normalizeProblem(seed.problemText) === normalized) {
        return seed;
      }
    }
  }

  // 2. pHash 캐시 확인
  let phash = '';
  try {
    phash = await computePhash(blob);
    const phashHit = await lookupByPhash(phash);
    if (phashHit) return phashHit;
  } catch {
    // pHash 실패 시 계속 진행
  }

  // 3. 텍스트 캐시 확인
  if (problemText) {
    const textHit = await lookupByText(problemText);
    if (textHit) return textHit;
  }

  // 4. API 프록시 호출
  const base64 = await blobToBase64(blob);
  const res = await fetch('/api/gemma', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64: base64 }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'unknown' }));
    throw new Error(err.error ?? 'api_error');
  }

  const data = await res.json();
  const solution = SolutionSchema.parse(data); // 클라이언트 재검증

  // 5. 캐시 저장 (원본 이미지는 저장 안 함 — phash만)
  try {
    await cacheSolution(solution.problemText, phash, solution);
  } catch {
    // 캐시 실패는 무시
  }

  return solution;
}
