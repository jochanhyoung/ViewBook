'use client';
import { useEffect, useState } from 'react';
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
import { SecantSlope } from '@/components/visualization/SecantSlope';
import { PiecewiseGraph } from '@/components/visualization/PiecewiseGraph';
import { SolutionSlides } from '@/components/visualization/SolutionSlides';
import { ClockAngle } from '@/components/visualization/ClockAngle';
import { SaltConcentration } from '@/components/visualization/SaltConcentration';
import { CalendarPattern } from '@/components/visualization/CalendarPattern';
import { DistanceTime } from '@/components/visualization/DistanceTime';
import { LinearFunction } from '@/components/visualization/LinearFunction';
import { QuadraticFunction } from '@/components/visualization/QuadraticFunction';
import { SystemOfEquations } from '@/components/visualization/SystemOfEquations';

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
  const [subStep, setSubStep] = useState(0);

  // 메인 스텝이 바뀌면 서브스텝 리셋
  useEffect(() => { setSubStep(0); }, [index]);

  const subStepCount = step?.kind === 'equationTransform' ? step.steps.length : 1;
  const isFirstSubStep = subStep === 0;
  const isLastSubStep = subStep >= subStepCount - 1;

  const handleNext = () => {
    if (!isLastSubStep) {
      setSubStep((s: number) => s + 1);
    } else {
      onNext();
    }
  };

  const handlePrev = () => {
    if (!isFirstSubStep) {
      setSubStep((s: number) => s - 1);
    } else {
      onPrev();
    }
  };

  useEffect(() => {
    if (compact) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); handleNext(); }
      if (e.key === 'ArrowLeft') handlePrev();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleNext, handlePrev, compact]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!step) return null;

  const isNextDisabled = isLastSubStep && index >= total - 1;
  const isPrevDisabled = isFirstSubStep && index === 0;

  return (
    <div style={{ height: compact ? 'auto' : '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 스텝 콘텐츠 */}
      <div style={{ flex: compact ? 'none' : 1, overflow: compact ? 'visible' : 'hidden', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ height: compact ? 'auto' : '100%' }}
          >
            <StepContent step={step} subStep={subStep} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 컨트롤 */}
      {!compact && (
        <div
          style={{
            borderTop: '1px solid var(--color-bg-surface)',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <button
            onClick={handlePrev}
            disabled={isPrevDisabled}
            style={{
              background: 'none',
              border: 'none',
              cursor: isPrevDisabled ? 'default' : 'pointer',
              color: isPrevDisabled ? 'var(--color-border)' : 'var(--color-text-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              padding: '4px 8px',
            }}
          >
            ← 이전
          </button>

          {/* 진행 점 — equationTransform이면 서브스텝 기준으로 표시 */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {step.kind === 'equationTransform' ? (
              step.steps.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === subStep ? '16px' : '5px',
                    height: '4px',
                    background: i === subStep ? 'var(--color-accent)' : 'var(--color-border)',
                    borderRadius: '2px',
                    transition: 'all 250ms ease',
                  }}
                />
              ))
            ) : (
              steps.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === index ? '16px' : '5px',
                    height: '4px',
                    background: i === index ? 'var(--color-accent)' : 'var(--color-border)',
                    borderRadius: '2px',
                    transition: 'all 250ms ease',
                  }}
                />
              ))
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={isNextDisabled}
            style={{
              background: 'none',
              border: 'none',
              cursor: isNextDisabled ? 'default' : 'pointer',
              color: isNextDisabled ? 'var(--color-border)' : 'var(--color-text-subtle)',
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

function StepContent({ step, subStep }: { step: VisualizationStep; subStep: number }) {
  switch (step.kind) {
    case 'powerRule':
      return <PowerRule coefficient={step.coefficient} exponent={step.exponent} />;
    case 'limitDefinition':
      return <LimitDefinition fn={step.fn} x0={step.x0} />;
    case 'clockAngle':
      return <ClockAngle hour={step.hour} minute={step.minute} interactive={step.interactive} />;
    case 'saltConcentration':
      return <SaltConcentration water={step.water} salt={step.salt} interactive={step.interactive} />;
    case 'calendarPattern':
      return <CalendarPattern day={step.day} interactive={step.interactive} />;
    case 'distanceTime':
      return <DistanceTime speed={step.speed} />;
    case 'linearFunction':
      return <LinearFunction slope={step.slope} intercept={step.intercept} interactive={step.interactive} />;
    case 'quadraticFunction':
      return <QuadraticFunction a={step.a} interactive={step.interactive} />;
    case 'systemOfEquations':
      return <SystemOfEquations line1={step.line1} line2={step.line2} />;
    case 'secantSlope':
      return <SecantSlope fn={step.fn} a={step.a} interactive={step.interactive} />;
    case 'derivativeGraph':
      return <DerivativeGraph fnLatex={step.fnLatex} fn={step.fn} domain={step.domain} />;
    case 'tangentLine':
      return <TangentLine fn={step.fn} x0={step.x0} domain={step.domain} />;
    case 'riemannSum':
      return <RiemannSum fn={step.fn} a={step.a} b={step.b} n={step.n} method={step.method} />;
    case 'definiteIntegral':
      return <DefiniteIntegral fn={step.fn} a={step.a} b={step.b} />;
    case 'equationTransform':
      return <EquationTransform steps={step.steps} subStepIndex={subStep} />;
    case 'piecewiseGraph':
      return <PiecewiseGraph pieces={step.pieces} x0={step.x0} />;
    case 'solutionSlides':
      return <SolutionSlides steps={step.steps} subStep={subStep} />;
    case 'text':
      return <StepText latex={step.latex} markdown={step.markdown} />;
    default:
      return null;
  }
}
