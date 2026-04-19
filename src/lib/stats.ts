import fs from 'fs';
import path from 'path';

const DATA_DIR = process.env.STATS_DATA_DIR ?? '/app/data';
const STATS_FILE = path.join(DATA_DIR, 'stats.json');
const SESSION_TTL = 5 * 60 * 1000;

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

type StatsData = {
  peakConcurrent: number;
  peakTime: string | null;
  dailyVisits: Record<string, { unique: string[]; pageviews: number }>;
};

function loadStats(): StatsData {
  try {
    return JSON.parse(fs.readFileSync(STATS_FILE, 'utf-8'));
  } catch {
    return { peakConcurrent: 0, peakTime: null, dailyVisits: {} };
  }
}

function saveStats(data: StatsData): void {
  fs.writeFileSync(STATS_FILE, JSON.stringify(data, null, 2));
}

const activeSessions = new Map<string, number>();

function cleanupSessions(): void {
  const now = Date.now();
  for (const [hash, lastSeen] of activeSessions) {
    if (now - lastSeen > SESSION_TTL) activeSessions.delete(hash);
  }
}
setInterval(cleanupSessions, 60 * 1000);

function getTodayKST(): string {
  const kst = new Date(Date.now() + 9 * 3600000);
  return kst.toISOString().slice(0, 10);
}

export function recordVisit(ipHash: string): void {
  cleanupSessions();
  activeSessions.set(ipHash, Date.now());

  const data = loadStats();
  const today = getTodayKST();

  if (!data.dailyVisits[today]) {
    data.dailyVisits[today] = { unique: [], pageviews: 0 };
  }
  if (!data.dailyVisits[today].unique.includes(ipHash)) {
    data.dailyVisits[today].unique.push(ipHash);
  }
  data.dailyVisits[today].pageviews += 1;

  if (activeSessions.size > data.peakConcurrent) {
    data.peakConcurrent = activeSessions.size;
    data.peakTime = new Date().toISOString();
  }

  const cutoff = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  for (const date of Object.keys(data.dailyVisits)) {
    if (date < cutoff) delete data.dailyVisits[date];
  }

  saveStats(data);
}

export function getStats() {
  cleanupSessions();
  const data = loadStats();
  const today = getTodayKST();
  const todayData = data.dailyVisits[today] ?? { unique: [], pageviews: 0 };

  const recent7days = Object.entries(data.dailyVisits)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 7)
    .map(([date, v]) => ({
      date,
      uniqueVisitors: v.unique.length,
      pageviews: v.pageviews,
    }));

  return {
    currentConcurrent: activeSessions.size,
    todayUniqueVisitors: todayData.unique.length,
    todayPageviews: todayData.pageviews,
    peakConcurrent: data.peakConcurrent,
    peakTime: data.peakTime,
    recent7days,
  };
}
