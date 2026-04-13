export default function VisualizeLoading() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '256px',
          height: '128px',
          borderRadius: '12px',
          background: 'var(--color-bg-surface)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      <div
        style={{
          width: '160px',
          height: '16px',
          borderRadius: '8px',
          background: 'var(--color-bg-surface)',
          animation: 'pulse 1.5s ease-in-out infinite',
          animationDelay: '0.3s',
        }}
      />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
