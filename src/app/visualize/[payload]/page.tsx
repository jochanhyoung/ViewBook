'use client';
import { use, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
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
      <div style={{ height: '48px', borderBottom: '1px solid #1a1a1f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
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
                background: i === index ? '#d4ff4f' : i < index ? '#3a3a44' : '#26262d',
                borderRadius: '2px', border: 'none', cursor: 'pointer',
                transition: 'all 250ms ease', padding: 0,
              }}
            />
          ))}
        </div>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#3a3a44' }}>
          {index + 1} / {total}
        </span>
      </div>

      {/* Main visualization */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: 0 }}>
          <div
            style={{
              flex: shouldShowExplanation(steps[index]) ? '0 0 52%' : 1,
              minHeight: '320px',
              maxHeight: shouldShowExplanation(steps[index]) ? '52vh' : 'none',
              border: '1px solid var(--color-bg-surface)',
              borderRadius: '12px',
              background: 'var(--color-bg)',
              overflow: 'hidden',
            }}
          >
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

          {shouldShowExplanation(steps[index]) && <StepExplanation step={steps[index]} />}
        </div>
      </div>

      {/* PlaybackControls */}
      <div style={{ height: '64px', borderTop: '1px solid #1a1a1f', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexShrink: 0 }}>
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

function StepExplanation({ step }: { step: VisualizationStep }) {
  const content = getStepExplanation(step);

  return (
    <section
      style={{
        flex: 1,
        minHeight: 0,
        border: '1px solid var(--color-bg-surface)',
        borderRadius: '12px',
        background: 'var(--color-bg-elevated)',
        padding: '18px 20px',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: '6px',
            }}
          >
            해설
          </div>
          <h2 style={{ margin: 0, fontSize: '20px', lineHeight: 1.3, color: 'var(--color-text)' }}>{content.title}</h2>
        </div>

        {content.sections.map((section) => (
          <div key={section.heading} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3
              style={{
                margin: 0,
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
              }}
            >
              {section.heading}
            </h3>
            <div className="ko-text" style={{ color: 'var(--color-text)', lineHeight: 1.8, fontSize: '15px' }}>
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  p: ({ children }) => <p style={{ margin: '0 0 8px' }}>{children}</p>,
                  strong: ({ children }) => <strong style={{ color: 'var(--color-text)' }}>{children}</strong>,
                  ul: ({ children }) => <ul style={{ margin: '0 0 8px', paddingLeft: '20px' }}>{children}</ul>,
                  li: ({ children }) => <li style={{ marginBottom: '6px' }}>{children}</li>,
                }}
              >
                {section.body}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function shouldShowExplanation(step: VisualizationStep): boolean {
  switch (step.kind) {
    case 'limitDefinition':
    case 'secantSlope':
    case 'tangentLine':
    case 'derivativeGraph':
      return true;
    default:
      return false;
  }
}

function getStepExplanation(step: VisualizationStep): { title: string; sections: { heading: string; body: string }[] } {
  switch (step.kind) {
    case 'limitDefinition':
      return {
        title: '할선의 기울기가 접선의 기울기로 바뀌는 과정',
        sections: [
          {
            heading: '개념',
            body:
              '이 그래프는 함수 $f(x)$의 한 점 $x = a$에서 **미분계수**를 정의하는 장면을 보여 준다. 미분계수는 점 $(a, f(a))$에서의 **접선 기울기**이고, 계산에서는 평균변화율 $\\dfrac{f(a+h)-f(a)}{h}$의 극한으로 나타낸다.',
          },
          {
            heading: '그래프 읽기',
            body:
              '화면의 두 점은 기준점 $A(a, f(a))$와 움직이는 점 $B(a+h, f(a+h))$이다. $x$축은 입력값, $y$축은 함수값을 나타낸다. 점 $B$가 $A$에 가까워질수록 할선의 기울기가 어떻게 변하는지 읽을 수 있고, 이 변화가 바로 평균변화율의 변화다.',
          },
          {
            heading: '풀이 연결',
            body:
              '문제를 풀 때는 먼저 할선의 기울기를 식으로 만든 뒤, 그래프에서 보이던 점의 이동을 수식에서는 $h \\to 0$으로 표현한다. 시각적으로는 두 점 사이 간격이 줄어들고, 계산에서는 극한을 취해 하나의 기울기 값으로 수렴하는지 확인한다.',
          },
        ],
      };
    case 'secantSlope':
      return {
        title: '두 점을 잇는 할선으로 평균변화율 읽기',
        sections: [
          {
            heading: '개념',
            body:
              '이 그래프는 함수 위의 두 점을 연결한 **할선의 기울기**를 보여 준다. 이는 구간 전체에서의 평균변화율이며, 미분계수를 구하기 전 단계에서 반드시 거치는 개념이다.',
          },
          {
            heading: '그래프 읽기',
            body:
              '점 $A(a, f(a))$와 점 $B(a+h, f(a+h))$ 사이의 가로 변화가 $\\Delta x = h$, 세로 변화가 $\\Delta y$이다. 그래프에서는 이 두 변화량을 눈으로 확인할 수 있고, 따라서 기울기 $\\dfrac{\\Delta y}{\\Delta x}$가 어떻게 만들어지는지도 읽을 수 있다.',
          },
          {
            heading: '풀이 연결',
            body:
              '문제 풀이에서는 이 할선의 기울기를 식으로 정리한 뒤, 필요하면 $h$를 더 작게 보내 접선 기울기와 연결한다. 즉 그래프는 최종 결과를 보여 주는 그림이 아니라, 평균변화율이 어떤 양인지 이해하게 해 주는 풀이 과정의 일부다.',
          },
        ],
      };
    case 'tangentLine':
      return {
        title: '한 점에서의 접선과 순간변화율',
        sections: [
          {
            heading: '개념',
            body:
              '이 그래프는 함수의 특정 점에서 그은 **접선**을 보여 준다. 접선의 기울기는 그 점에서의 **순간변화율**, 즉 미분계수와 같다.',
          },
          {
            heading: '그래프 읽기',
            body:
              '곡선이 증가하는지 감소하는지, 접선이 가파른지 완만한지를 보면 미분계수의 부호와 크기를 직관적으로 읽을 수 있다. 접선이 위로 올라가면 양수, 아래로 내려가면 음수, 수평에 가까우면 0에 가깝다.',
          },
          {
            heading: '풀이 연결',
            body:
              '계산으로 구한 $f\'(a)$가 실제 그래프에서 어떤 기울기를 뜻하는지 확인하는 구간이다. 따라서 최종 답이 숫자로 끝나지 않고, 그 숫자가 그래프의 어떤 방향성과 변화율을 나타내는지 연결해서 이해할 수 있다.',
          },
        ],
      };
    case 'derivativeGraph':
      return {
        title: '함수의 변화와 도함수의 의미',
        sections: [
          {
            heading: '개념',
            body:
              '이 시각화는 원함수와 도함수의 관계를 보여 준다. 도함수는 각 점에서의 접선 기울기를 새로운 함수로 옮겨 적은 것이므로, 원함수의 증가·감소·극값과 직접 연결된다.',
          },
          {
            heading: '그래프 읽기',
            body:
              '원함수가 증가하는 구간에서는 도함수가 양수이고, 감소하는 구간에서는 음수이다. 또 원함수의 꼭대기점이나 바닥점 근처에서는 접선이 수평이 되므로 도함수 값이 0에 가까워진다.',
          },
          {
            heading: '풀이 연결',
            body:
              '문제를 풀 때 그래프를 보면 단순히 기울기 숫자만 보는 것이 아니라, 함수 전체의 변화 패턴을 읽을 수 있다. 그래서 극값, 증가·감소, 접선의 성질을 한 번에 연결하는 데 유용하다.',
          },
        ],
      };
    case 'equationTransform':
      return {
        title: '식 변형으로 평균변화율을 정리하는 과정',
        sections: [
          {
            heading: '개념',
            body:
              '이 단계는 미분계수 정의에 식을 대입한 뒤, 극한을 계산 가능한 형태로 바꾸는 과정이다. 통분, 전개, 약분 같은 대수 조작이 왜 필요한지 보여 준다.',
          },
          {
            heading: '그래프 읽기',
            body:
              '그래프 자체가 없더라도 이 식은 앞선 그래프의 할선 기울기를 그대로 수식으로 적어 놓은 것이다. 즉 수식의 각 항은 점의 이동, 변화량, 기울기와 대응된다.',
          },
          {
            heading: '풀이 연결',
            body:
              '문제 풀이에서 핵심은 복잡한 평균변화율을 극한을 취할 수 있는 간단한 식으로 바꾸는 것이다. 그래프가 변화의 상황을 보여 준다면, 이 단계는 그 상황을 계산 가능한 언어로 번역하는 과정이다.',
          },
        ],
      };
    default:
      return {
        title: '시각화 해설',
        sections: [
          {
            heading: '개념',
            body:
              '이 화면은 현재 문제에서 사용하는 핵심 수학 개념을 그래프나 단계적 표현으로 보여 준다. 함수의 값, 변화량, 기울기, 넓이 같은 추상 개념을 눈으로 확인할 수 있게 만드는 것이 목적이다.',
          },
          {
            heading: '그래프 읽기',
            body:
              '축의 의미, 점의 위치, 선의 기울기, 도형의 변화 등을 함께 보면 계산 결과가 어떤 현상을 뜻하는지 파악할 수 있다. 따라서 시각화는 정답을 장식하는 요소가 아니라 정보를 읽어 내는 도구다.',
          },
          {
            heading: '풀이 연결',
            body:
              '문제를 풀 때는 먼저 시각화가 무엇을 나타내는지 해석하고, 그다음 그것을 식과 연결해야 한다. 이렇게 해야 계산 결과가 왜 그런지, 그리고 그래프에서 어떤 모습으로 드러나는지를 동시에 이해할 수 있다.',
          },
        ],
      };
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
