'use client';
import { use, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { decodeVizPayload } from '@/lib/viz-payload';
import type { VisualizationStep } from '@/types/visualization';
import { PowerRule } from '@/components/visualization/PowerRule';
import { LimitDefinition } from '@/components/visualization/LimitDefinition';
import { DerivativeGraph } from '@/components/visualization/DerivativeGraph';
import { TangentLine } from '@/components/visualization/TangentLine';
import { RiemannSum } from '@/components/visualization/RiemannSum';
import { DefiniteIntegral } from '@/components/visualization/DefiniteIntegral';
import { EquationTransform } from '@/components/visualization/EquationTransform';
import { StepText } from '@/components/visualization/StepText';
import { FunctionPlayground } from '@/components/visualization/FunctionPlayground';
import { SolutionSlides } from '@/components/visualization/SolutionSlides';
import { SecantSlope } from '@/components/visualization/SecantSlope';

const RETURN_KEY = 'visualize_return_url';
const FALLBACK_URL = '/read';

interface PageProps {
  params: Promise<{ payload: string }>;
}

export default function VisualizePage({ params }: PageProps) {
  const { payload: encodedPayload } = use(params);
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Decode payload
  let vizPayload;
  try {
    vizPayload = decodeVizPayload(decodeURIComponent(encodedPayload));
  } catch {
    return <VizErrorScreen router={router} />;
  }

  const { steps } = vizPayload;
  const total = steps.length;

  // 마운트 시점(브라우저)에 한 번만 읽어서 ref에 보관
  const returnUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // useEffect는 반드시 브라우저에서만 실행됨 → window 안전
    try {
      const stored = sessionStorage.getItem(RETURN_KEY);
      const VALID_PREFIXES = ['/read/', '/chapters/', '/book/', '/teacher/'];
      if (stored && VALID_PREFIXES.some(p => stored.startsWith(p))) {
        returnUrlRef.current = stored;
      }
    } catch {
      // sessionStorage 미지원 환경 — ref는 null 유지
    }
  }, []);

  const goBack = useCallback(() => {
    try {
      sessionStorage.removeItem(RETURN_KEY);
    } catch { /* 무시 */ }

    if (returnUrlRef.current) {
      router.replace(returnUrlRef.current);
    } else {
      router.replace(FALLBACK_URL);
    }
  }, [router]);

  const currentStep = steps[index];
  const currentSubStepCount =
    currentStep.kind === 'equationTransform' ? currentStep.steps.length :
    currentStep.kind === 'limitDefinition' ? 5 :
    currentStep.kind === 'solutionSlides' ? currentStep.steps.length :
    1;

  const goNext = useCallback(() => {
    if (subStep < currentSubStepCount - 1) {
      setSubStep((s) => s + 1);
    } else if (index < total - 1) {
      setIndex((i) => i + 1);
      setSubStep(0);
    }
  }, [subStep, currentSubStepCount, index, total]);

  const goPrev = useCallback(() => {
    if (subStep > 0) {
      setSubStep((s) => s - 1);
    } else if (index > 0) {
      const prevStep = steps[index - 1];
      const prevSubStepCount =
        prevStep.kind === 'equationTransform' ? prevStep.steps.length :
        prevStep.kind === 'limitDefinition' ? 5 :
        prevStep.kind === 'solutionSlides' ? prevStep.steps.length :
        1;
      setIndex((i) => i - 1);
      setSubStep(prevSubStepCount - 1);
    }
  }, [subStep, index, steps]);

  const goStart = useCallback(() => { setIndex(0); setSubStep(0); setIsPlaying(false); }, []);

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    if (index >= total - 1 && subStep >= currentSubStepCount - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      goNext();
    }, 2200);
    return () => clearTimeout(timer);
  }, [isPlaying, index, subStep, total, currentSubStepCount, goNext]);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') goBack();
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Home') goStart();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev, goStart, goBack]);

  return (
    <div style={{ height: '100vh', width: '100vw', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ height: '48px', borderBottom: '1px solid var(--color-bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <button
          onClick={goBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)',
            display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0',
          }}
        >
          ← 교과서로 돌아가기
        </button>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIndex(i); setSubStep(0); setIsPlaying(false); }}
              style={{
                width: i === index ? '18px' : '5px',
                height: '4px',
                background: i === index ? 'var(--color-accent)' : i < index ? 'var(--color-text-ghost)' : 'var(--color-border)',
                borderRadius: '2px', border: 'none', cursor: 'pointer',
                transition: 'all 250ms ease', padding: 0,
              }}
            />
          ))}
        </div>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-ghost)' }}>
          {index + 1} / {total}
        </span>
      </div>

      {/* Main visualization */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ height: '100%' }}
          >
            <StepContent step={steps[index]} isPlaying={isPlaying} subStep={subStep} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* PlaybackControls */}
      <div style={{ height: '64px', borderTop: '1px solid var(--color-bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexShrink: 0 }}>
        <CtrlBtn onClick={goStart} disabled={index === 0 && subStep === 0 && !isPlaying} title="처음으로">⏮</CtrlBtn>
        <CtrlBtn onClick={goPrev} disabled={index === 0 && subStep === 0} title="이전">
          <IconPrev />
        </CtrlBtn>
        <button
          onClick={() => setIsPlaying((p) => !p)}
          title={isPlaying ? '일시정지' : '재생'}
          style={{
            background: 'var(--color-accent)', border: 'none', borderRadius: '6px', cursor: 'pointer',
            width: '44px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', color: 'var(--color-accent-fg)',
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <CtrlBtn onClick={goNext} disabled={index >= total - 1 && subStep >= currentSubStepCount - 1} title="다음">
          <IconNext />
        </CtrlBtn>
      </div>
    </div>
  );
}

function CtrlBtn({ onClick, disabled, title, children }: { onClick: () => void; disabled?: boolean; title?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        background: 'none', border: '1px solid var(--color-border)', borderRadius: '5px',
        cursor: disabled ? 'default' : 'pointer',
        width: '38px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '14px', color: disabled ? 'var(--color-border)' : 'var(--color-text-subtle)', transition: 'color 150ms',
      }}
    >
      {children}
    </button>
  );
}

/** ⏪ 대체 — currentColor를 따르는 SVG (이중 왼쪽 화살표) */
function IconPrev() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M7 2L2.5 6.5L7 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 2L7 6.5L11.5 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** ⏩ 대체 — currentColor를 따르는 SVG (이중 오른쪽 화살표) */
function IconNext() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M2 2L6.5 6.5L2 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 2L11 6.5L6.5 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StepContent({ step, isPlaying, subStep }: { step: VisualizationStep; isPlaying: boolean; subStep: number }) {
  switch (step.kind) {
    case 'powerRule':
      return <PowerRule coefficient={step.coefficient} exponent={step.exponent} />;
    case 'limitDefinition':
      return <LimitDefinition fn={step.fn} x0={step.x0} isPlaying={isPlaying} subStep={subStep} />;
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
    case 'text':
      return <StepText latex={step.latex} markdown={step.markdown} />;
    case 'playground':
      return <FunctionPlayground initialFn={step.initialFn} domain={step.domain} />;
    case 'solutionSlides':
      return <SolutionSlides steps={step.steps} subStep={subStep} isPlaying={isPlaying} />;
    case 'secantSlope':
      return <SecantSlope fn={step.fn} a={step.a} />;
    default:
      return null;
  }
}

function VizErrorScreen({ router }: { router: ReturnType<typeof useRouter> }) {
  const handleReturn = () => {
    let target = FALLBACK_URL;
    try {
      const stored = sessionStorage.getItem(RETURN_KEY);
      sessionStorage.removeItem(RETURN_KEY);
      const VALID_PREFIXES = ['/read/', '/chapters/', '/book/', '/teacher/'];
      if (stored && VALID_PREFIXES.some(p => stored.startsWith(p))) {
        target = stored;
      }
    } catch { /* 무시 */ }
    router.replace(target);
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted)',
      }}>
        시각화를 불러올 수 없습니다
      </p>
      <button
        onClick={handleReturn}
        style={{
          background: 'none',
          border: '1px solid var(--color-accent)',
          borderRadius: '8px',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--color-accent)',
          padding: '8px 24px',
          transition: 'all 150ms',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-accent-bg)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'none';
        }}
      >
        ← 교과서로 돌아가기
      </button>
    </div>
  );
}
