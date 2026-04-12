'use client';
import type { VisualizationStep } from '@/types/visualization';
import { SolutionPlayer } from '@/components/solution/SolutionPlayer';
import { useTextbookStore } from '@/store/textbook-store';

interface FigureBlockProps {
  visualization: VisualizationStep;
  caption: string;
}

export function FigureBlock({ visualization, caption }: FigureBlockProps) {
  const stageIndex = useTextbookStore((s) => s.stageIndex);
  const advanceStage = useTextbookStore((s) => s.advanceStage);
  const retreatStage = useTextbookStore((s) => s.retreatStage);

  return (
    <div
      style={{
        marginTop: '24px',
        marginBottom: '24px',
        border: '1px solid #1a1a1f',
        borderRadius: '6px',
        overflow: 'hidden',
      }}
    >
      {/* 인라인 시각화 (작은 크기) */}
      <div style={{ height: '300px', background: '#111114' }}>
        <SolutionPlayer
          steps={[visualization]}
          index={0}
          total={1}
          onPrev={retreatStage}
          onNext={advanceStage}
          compact
        />
      </div>
      <div
        style={{
          padding: '10px 16px',
          borderTop: '1px solid #1a1a1f',
          background: '#0a0a0b',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: '#5a5a66',
            margin: 0,
            lineHeight: 1.6,
          }}
          className="ko-text"
        >
          {caption}
        </p>
      </div>
    </div>
  );
}
