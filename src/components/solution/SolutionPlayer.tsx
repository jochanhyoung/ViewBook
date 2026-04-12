'use client';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { VisualizationStep } from '@/types/visualization';
import { PowerRule } from '@/components/visualization/PowerRule';
import { LimitDefinition } from '@/components/visualization/LimitDefinition';
import { DerivativeGraph } from '@/components/visualization/DerivativeGraph';
import { TangentLine } from '@/components/visualization/TangentLine';
import { RiemannSum } from '@/components/visualization/RiemannSum';
import { DefiniteIntegral } from '@/components/visualization/DefiniteIntegral';
import { EquationTransform } from '@/components/visualization/EquationTransform';
import { StepText } from '@/components/visualization/StepText';

interface SolutionPlayerProps {
  steps: VisualizationStep[];
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  compact?: boolean;
}

export function SolutionPlayer({ steps, index, total, onPrev, onNext, compact = false }: SolutionPlayerProps) {
  const step = steps[Math.min(index, steps.length - 1)];

  // 키보드 내비게이션 (compact 모드에서는 비활성)
  useEffect(() => {
    if (compact) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        onNext();
      }
      if (e.key === 'ArrowLeft') onPrev();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onPrev, onNext, compact]);

  if (!step) return null;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 스텝 콘텐츠 */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ height: '100%' }}
          >
            <StepContent step={step} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 컨트롤 */}
      {!compact && (
        <div
          style={{
            borderTop: '1px solid #1a1a1f',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <button
            onClick={onPrev}
            disabled={index === 0}
            style={{
              background: 'none',
              border: 'none',
              cursor: index === 0 ? 'default' : 'pointer',
              color: index === 0 ? '#26262d' : '#8a8a96',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              padding: '4px 8px',
            }}
          >
            ← 이전
          </button>

          {/* 진행 점 */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {steps.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === index ? '16px' : '5px',
                  height: '4px',
                  background: i === index ? '#d4ff4f' : '#26262d',
                  borderRadius: '2px',
                  transition: 'all 250ms ease',
                }}
              />
            ))}
          </div>

          <button
            onClick={onNext}
            disabled={index >= total - 1}
            style={{
              background: 'none',
              border: 'none',
              cursor: index >= total - 1 ? 'default' : 'pointer',
              color: index >= total - 1 ? '#26262d' : '#8a8a96',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              padding: '4px 8px',
            }}
          >
            다음 →
          </button>
        </div>
      )}
    </div>
  );
}

function StepContent({ step }: { step: VisualizationStep }) {
  switch (step.kind) {
    case 'powerRule':
      return <PowerRule coefficient={step.coefficient} exponent={step.exponent} />;
    case 'limitDefinition':
      return <LimitDefinition fn={step.fn} x0={step.x0} />;
    case 'derivativeGraph':
      return <DerivativeGraph fnLatex={step.fnLatex} fn={step.fn} domain={step.domain} />;
    case 'tangentLine':
      return <TangentLine fn={step.fn} x0={step.x0} domain={step.domain} />;
    case 'riemannSum':
      return <RiemannSum fn={step.fn} a={step.a} b={step.b} n={step.n} method={step.method} />;
    case 'definiteIntegral':
      return <DefiniteIntegral fn={step.fn} a={step.a} b={step.b} />;
    case 'equationTransform':
      return <EquationTransform steps={step.steps} subStepIndex={step.steps.length - 1} />;
    case 'text':
      return <StepText latex={step.latex} markdown={step.markdown} />;
    default:
      return null;
  }
}
