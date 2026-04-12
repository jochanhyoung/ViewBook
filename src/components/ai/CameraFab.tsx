'use client';
import { useTextbookStore } from '@/store/textbook-store';

export function CameraFab() {
  const setCameraOpen = useTextbookStore((s) => s.setCameraOpen);
  const aiStatus = useTextbookStore((s) => s.aiStatus);

  return (
    <button
      onClick={() => setCameraOpen(true)}
      aria-label="AI로 문제 풀기"
      style={{
        position: 'fixed',
        bottom: '72px',
        right: '24px',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'var(--color-accent)',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px var(--color-accent-bg)',
        zIndex: 50,
        transition: 'all 150ms',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
      }}
    >
      {aiStatus === 'solving' ? (
        <div
          style={{
            width: '20px',
            height: '20px',
            border: '2px solid var(--color-accent-fg)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-fg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </button>
  );
}
