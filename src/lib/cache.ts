'use client';
// src/lib/cache.ts
import Dexie, { type Table } from 'dexie';
import type { Solution } from './schemas';
import { hammingDistance } from './phash';
import type { CourseId } from '@/content/index';

interface CachedSolution {
  id: string;       // normalize(problemText) 해시
  phash: string;    // 64bit hex
  courseId: CourseId;
  problemText: string;
  solution: Solution;
  createdAt: number;
  hitCount: number;
}

class TextbookDB extends Dexie {
  solutions!: Table<CachedSolution, string>;
  constructor() {
    super('textbook-cache');
    this.version(1).stores({ solutions: 'id, phash, createdAt' });
    this.version(2).stores({ solutions: 'id, courseId, phash, createdAt' });
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
    entry.hitCount++;
    await db.solutions.put(entry);
    return entry.solution;
  }
  return null;
}

export async function lookupByPhash(phash: string, courseId: CourseId): Promise<Solution | null> {
  const db = getDB();
  const all = await db.solutions.toArray();
  for (const entry of all) {
    if (entry.courseId === courseId && entry.phash && hammingDistance(phash, entry.phash) <= 6) {
      entry.hitCount++;
      await db.solutions.put(entry);
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
    hitCount: 0,
  });
}

export async function listCache(): Promise<CachedSolution[]> {
  return getDB().solutions.orderBy('createdAt').reverse().toArray();
}

export async function deleteCache(id: string): Promise<void> {
  await getDB().solutions.delete(id);
}

export async function clearAllCache(): Promise<void> {
  await getDB().solutions.clear();
}
