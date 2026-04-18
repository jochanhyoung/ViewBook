'use client';
// src/lib/cache.ts
import Dexie, { type Table } from 'dexie';
import type { Solution } from './schemas';
import { hammingDistance } from './phash';
import type { CourseId } from '@/content/index';

const CACHE_MAX_ENTRIES = 100;

interface CachedSolution {
  id: string;
  phash: string;
  courseId: CourseId;
  problemText: string;
  solution: Solution;
  createdAt: number;
  hitCount: number;
  lastAccessedAt?: number;
}

class TextbookDB extends Dexie {
  solutions!: Table<CachedSolution, string>;
  constructor() {
    super('textbook-cache');
    this.version(1).stores({ solutions: 'id, phash, createdAt' });
    this.version(2).stores({ solutions: 'id, courseId, phash, createdAt' });
    this.version(3).stores({ solutions: 'id, courseId, phash, createdAt' });
    this.version(4).stores({ solutions: 'id, courseId, phash, createdAt, lastAccessedAt' });
  }
}

let _db: TextbookDB | null = null;
function getDB(): TextbookDB {
  if (!_db) _db = new TextbookDB();
  return _db;
}

function normalizeProblem(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^\w가-힣]/g, '');
}

async function hashString(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32);
}

export async function lookupByText(problemText: string, courseId: CourseId): Promise<Solution | null> {
  const key = `${courseId}:${normalizeProblem(problemText)}`;
  const id = await hashString(key);
  const db = getDB();
  const entry = await db.solutions.get(id);
  if (entry) {
    await db.solutions.update(id, { hitCount: (entry.hitCount ?? 0) + 1, lastAccessedAt: Date.now() });
    return entry.solution;
  }
  return null;
}

export async function lookupByPhash(phash: string, courseId: CourseId): Promise<Solution | null> {
  const db = getDB();
  const all = await db.solutions.toArray();
  for (const entry of all) {
    if (entry.courseId === courseId && entry.phash && hammingDistance(phash, entry.phash) <= 6) {
      await db.solutions.update(entry.id, { hitCount: (entry.hitCount ?? 0) + 1, lastAccessedAt: Date.now() });
      return entry.solution;
    }
  }
  return null;
}

export async function cacheSolution(
  problemText: string,
  phash: string,
  solution: Solution,
  courseId: CourseId
): Promise<void> {
  const key = `${courseId}:${normalizeProblem(problemText)}`;
  const id = await hashString(key);
  const db = getDB();
  await db.solutions.put({
    id,
    phash,
    courseId,
    problemText,
    solution,
    createdAt: Date.now(),
    lastAccessedAt: Date.now(),
    hitCount: 0,
  });

  const count = await db.solutions.count();
  if (count > CACHE_MAX_ENTRIES) {
    const excess = count - CACHE_MAX_ENTRIES;
    const oldKeys = await db.solutions.orderBy('createdAt').limit(excess).primaryKeys();
    await db.solutions.bulkDelete(oldKeys);
    console.log(`[cache] LRU 정리: ${excess}개 삭제 (총 ${CACHE_MAX_ENTRIES}개 유지)`);
  }
}

export async function listCache(): Promise<CachedSolution[]> {
  return getDB().solutions.orderBy('createdAt').reverse().toArray();
}

export async function deleteCache(id: string): Promise<void> {
  await getDB().solutions.delete(id);
}

export async function clearAllCache(): Promise<void> {
  await getDB().solutions.clear();
  console.log('[cache] 전체 캐시 삭제 완료');
}
