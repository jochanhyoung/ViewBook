'use client';
import { useEffect, useState } from 'react';
import { listCache, deleteCache, clearAllCache } from '@/lib/cache';
import type { Solution } from '@/lib/schemas';

interface CacheEntry {
  id: string;
  problemText: string;
  solution: Solution;
  createdAt: number;
  hitCount: number;
}

const GATE_PASSWORD = 'teacher2025'; // 개발용 간단 비밀번호

export default function TeacherCachePage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [entries, setEntries] = useState<CacheEntry[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadEntries() {
    setLoading(true);
    try {
      const data = await listCache();
      setEntries(data as CacheEntry[]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authed) loadEntries();
  }, [authed]);

  async function handleDelete(id: string) {
    await deleteCache(id);
    loadEntries();
  }

  async function handleClearAll() {
    if (!confirm('모든 캐시를 삭제하시겠습니까?')) return;
    await clearAllCache();
    loadEntries();
  }

  function handleExport() {
    // PII 없는지 확인 경고 포함
    const confirmed = confirm(
      '내보내기 전 확인:\n\n' +
      '1. 학생 이름·학교명 등 개인정보가 포함되지 않았는지 확인하셨습니까?\n' +
      '2. 원본 이미지는 저장되지 않습니다.\n\n' +
      '확인 후 내보내기를 진행합니까?'
    );
    if (!confirmed) return;

    const clean = entries.map(({ id, problemText, solution, hitCount }) => ({
      id, problemText, topic: solution.topic, finalAnswer: solution.finalAnswer, hitCount,
    }));
    const blob = new Blob([JSON.stringify(clean, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cache-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '40px', width: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--color-text)', fontWeight: 400, margin: 0 }}>
            교사용 캐시 관리
          </h1>
          <input
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && pw === GATE_PASSWORD) setAuthed(true); }}
            style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'var(--color-text)', fontFamily: 'var(--font-mono)', fontSize: '13px', padding: '10px 12px' }}
          />
          <button
            onClick={() => { if (pw === GATE_PASSWORD) setAuthed(true); else alert('비밀번호가 틀렸습니다.'); }}
            style={{ background: 'var(--color-accent)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-accent-fg)', padding: '10px' }}
          >
            입장
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#d4ff4f', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>
              교사용
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--color-text)', fontWeight: 400, margin: 0 }}>
              캐시 관리
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleExport} style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-subtle)', padding: '8px 14px' }}>
              JSON 내보내기
            </button>
            <button onClick={handleClearAll} style={{ background: 'none', border: '1px solid rgba(212,79,79,0.3)', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#d44f4f', padding: '8px 14px' }}>
              전체 삭제
            </button>
          </div>
        </div>

        {loading ? (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)' }}>로딩 중...</p>
        ) : entries.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)' }}>저장된 캐시가 없습니다.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {entries.map((e) => (
              <div key={e.id} style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-dim)', borderRadius: '8px', padding: '16px 20px', display: 'flex', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-accent)', marginBottom: '4px' }}>{e.solution.topic}</p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.problemText}
                  </p>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)' }}>
                      정답: {e.solution.finalAnswer}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)' }}>
                      조회: {e.hitCount}회
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-ghost)' }}>
                      {new Date(e.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(e.id)}
                  style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-subtle)', padding: '5px 10px', flexShrink: 0 }}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
