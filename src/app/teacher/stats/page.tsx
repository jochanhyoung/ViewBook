'use client';
import { useEffect, useState } from 'react';

type StatsData = {
  currentConcurrent: number;
  todayUniqueVisitors: number;
  todayPageviews: number;
  peakConcurrent: number;
  peakTime: string | null;
  recent7days: { date: string; uniqueVisitors: number; pageviews: number }[];
};

export default function StatsPage() {
  const [s, setS] = useState<StatsData | null>(null);

  useEffect(() => {
    const load = () =>
      fetch('/api/stats/summary').then((r) => r.json()).then(setS).catch(() => {});
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  if (!s) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)' }}>로딩 중...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#d4ff4f', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>
            교사용
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--color-text)', fontWeight: 400, margin: 0 }}>
            방문자 통계
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <StatCard title="현재 접속자" value={s.currentConcurrent} sub="명 (실시간)" accent="#4fff91" />
          <StatCard title="오늘 방문자" value={s.todayUniqueVisitors} sub={`페이지뷰: ${s.todayPageviews}`} accent="#4f9fff" />
          <StatCard
            title="최고 동시접속"
            value={s.peakConcurrent}
            sub={s.peakTime ? new Date(s.peakTime).toLocaleString('ko-KR') : '-'}
            accent="#c084fc"
          />
        </div>

        <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 400, margin: '0 0 16px' }}>
            최근 7일
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ textAlign: 'left', padding: '8px 0', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-subtle)', fontWeight: 400 }}>날짜</th>
                <th style={{ textAlign: 'right', padding: '8px 0', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-subtle)', fontWeight: 400 }}>방문자</th>
                <th style={{ textAlign: 'right', padding: '8px 0', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-subtle)', fontWeight: 400 }}>페이지뷰</th>
              </tr>
            </thead>
            <tbody>
              {s.recent7days.map((d) => (
                <tr key={d.date} style={{ borderBottom: '1px solid var(--color-border-dim)' }}>
                  <td style={{ padding: '10px 0', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text)' }}>{d.date}</td>
                  <td style={{ textAlign: 'right', padding: '10px 0', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text)' }}>{d.uniqueVisitors}</td>
                  <td style={{ textAlign: 'right', padding: '10px 0', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)' }}>{d.pageviews}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, accent }: { title: string; value: number; sub: string; accent: string }) {
  return (
    <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-subtle)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: accent, margin: '0 0 4px', fontWeight: 400 }}>{value}</p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-ghost)' }}>{sub}</p>
    </div>
  );
}
