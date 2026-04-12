'use client';
import type { VisualizationStep } from '@/types/visualization';
import { SolutionPlayer } from '@/components/solution/SolutionPlayer';
import { useTextbookStore } from '@/store/textbook-store';

interface FigureBlockProps {
  visualization: VisualizationStep;
  caption: string;
}

export function FigureBlock({ visualization, caption }: FigureBlockProps) {
  const advanceStage = useTextbookStore((s) => s.advanceStage);
  const retreatStage = useTextbookStore((s) => s.retreatStage);

  return (
    <div style={{ marginTop: '24px', marginBottom: '24px', border: '1px solid var(--color-bg-surface)', borderRadius: '6px', overflow: 'hidden' }}>
      {/* 인라인 시각화 — 높이는 콘텐츠에 맞게 늘어남, 최소 280px 확보 */}
      <div style={{ minHeight: '280px', background: 'var(--color-bg-elevated)' }}>
        <SolutionPlayer
          steps={[visualization]}
          index={0}
          total={1}
          onPrev={retreatStage}
          onNext={advanceStage}
          compact
        />
      </div>
      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--color-bg-surface)', background: 'var(--color-bg)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }} className="ko-text">
          {caption}
        </p>
      </div>
    </div>
  );
}
