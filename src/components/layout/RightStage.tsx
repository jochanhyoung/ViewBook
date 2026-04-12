'use client';
import { useTextbookStore } from '@/store/textbook-store';
import { SolutionPlayer } from '@/components/solution/SolutionPlayer';

export function RightStage() {
  const stageSteps = useTextbookStore((s) => s.stageSteps);
  const stageIndex = useTextbookStore((s) => s.stageIndex);
  const setStage = useTextbookStore((s) => s.setStage);
  const advanceStage = useTextbookStore((s) => s.advanceStage);
  const retreatStage = useTextbookStore((s) => s.retreatStage);

  return (
    <div
      className="relative flex flex-col items-center justify-center h-full overflow-hidden"
      style={{
        background: 'var(--color-stage-bg)',
        boxShadow: 'inset 0 0 1px var(--color-border)',
      }}
    >
      {/* SVG 노이즈 오버레이 */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 'var(--color-vis-noise)' } as React.CSSProperties}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      <div className="relative z-10 w-full h-full flex flex-col">
        {stageSteps ? (
          <SolutionPlayer
            steps={stageSteps}
            index={stageIndex}
            total={stageSteps.length}
            onPrev={retreatStage}
            onNext={advanceStage}
          />
        ) : (
          <EmptyStage />
        )}
      </div>
    </div>
  );
}

function EmptyStage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
      <div
        className="w-16 h-16 rounded-full border flex items-center justify-center"
        style={{
          borderColor: 'var(--color-border)',
          background: 'var(--color-overlay-soft)',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
        }}
      >
        시각화 무대
      </p>
      <p style={{ fontSize: '13px', color: 'var(--color-text-ghost)', maxWidth: '200px', lineHeight: 1.6 }}>
        예제 또는 연습문제에서 &quot;시각화로 보기&quot;를 클릭하면 여기에 재생됩니다.
      </p>
    </div>
  );
}
