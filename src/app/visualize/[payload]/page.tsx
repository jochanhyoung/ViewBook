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
import { CoordinatePlane } from '@/components/visualization/CoordinatePlane';
import { PiecewiseGraph } from '@/components/visualization/PiecewiseGraph';
import { ClockAngle } from '@/components/visualization/ClockAngle';
import { SaltConcentration } from '@/components/visualization/SaltConcentration';
import { CalendarPattern } from '@/components/visualization/CalendarPattern';
import { DistanceTime } from '@/components/visualization/DistanceTime';
import { LinearFunction } from '@/components/visualization/LinearFunction';
import { QuadraticFunction } from '@/components/visualization/QuadraticFunction';
import { SystemOfEquations } from '@/components/visualization/SystemOfEquations';

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

  const { steps, title } = vizPayload;
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
        <div
          className={shouldShowExplanation(steps[index]) ? 'viz-layout--with-explanation' : undefined}
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: shouldShowExplanation(steps[index]) ? 'row' : 'column',
            gap: shouldShowExplanation(steps[index]) ? '18px' : '16px',
            minHeight: 0,
            alignItems: shouldShowExplanation(steps[index]) ? 'stretch' : 'center',
          }}
        >
          <div
            className={shouldShowExplanation(steps[index]) ? 'viz-layout__graph' : undefined}
            style={{
              flex: shouldShowExplanation(steps[index]) ? '0 0 calc(55% - 9.9px)' : 1,
              width: shouldShowExplanation(steps[index]) ? 'calc(55% - 9.9px)' : '100%',
              minHeight: '320px',
              maxHeight: 'none',
              background: 'var(--color-bg)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                style={{ height: '100%', width: '100%' }}
              >
                <StepContent step={steps[index]} isPlaying={isPlaying} subStep={subStep} />
              </motion.div>
            </AnimatePresence>
          </div>

          {shouldShowExplanation(steps[index]) && <StepExplanation step={steps[index]} title={title} />}
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
    case 'clockAngle':
      return <ClockAngle hour={step.hour} minute={step.minute} interactive={step.interactive} />;
    case 'saltConcentration':
      return <SaltConcentration water={step.water} salt={step.salt} interactive={step.interactive} />;
    case 'calendarPattern':
      return <CalendarPattern day={step.day} interactive={step.interactive} />;
    case 'distanceTime':
      return <DistanceTime speed={step.speed} sampleTime={step.sampleTime} interactive={step.interactive} />;
    case 'linearFunction':
      return <LinearFunction slope={step.slope} intercept={step.intercept} interactive={step.interactive} />;
    case 'quadraticFunction':
      return <QuadraticFunction a={step.a} interactive={step.interactive} />;
    case 'systemOfEquations':
      return <SystemOfEquations line1={step.line1} line2={step.line2} />;
    case 'piecewiseGraph':
      return <PiecewiseGraph pieces={step.pieces} x0={step.x0} />;
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
    case 'coordinatePlane':
      return <CoordinatePlane points={step.points} interactive={step.interactive} />;
    default:
      return null;
  }
}

function StepExplanation({ step, title }: { step: VisualizationStep; title?: string }) {
  const content = getStepExplanation(step, title);

  return (
    <section
      className="viz-layout__explanation"
      style={{
        flex: '0 0 calc(45% - 8.1px)',
        minHeight: 0,
        height: '100%',
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-bg-surface)',
        borderRadius: '18px',
        padding: '20px 45px 20px 20px',
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%', height: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '18px', justifyContent: 'center', overflowY: 'auto' }}>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: '8px',
            }}
          >
            해설
          </div>
          <h2 style={{ margin: 0, fontSize: '19px', lineHeight: 1.35, color: 'var(--color-text)' }}>{content.title}</h2>
        </div>

        {content.sections.map((section) => (
          <div key={section.heading} style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            <h3
              style={{
                margin: 0,
                fontSize: '11px',
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
                  p: ({ children }) => <p style={{ margin: '0 0 10px' }}>{children}</p>,
                  strong: ({ children }) => <strong style={{ color: 'var(--color-text)' }}>{children}</strong>,
                  ul: ({ children }) => <ul style={{ margin: '0 0 10px', paddingLeft: '18px' }}>{children}</ul>,
                  li: ({ children }) => <li style={{ marginBottom: '7px' }}>{children}</li>,
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
    case 'powerRule':
    case 'limitDefinition':
    case 'piecewiseGraph':
    case 'coordinatePlane':
    case 'systemOfEquations':
    case 'tangentLine':
    case 'derivativeGraph':
    case 'riemannSum':
    case 'definiteIntegral':
      return true;
    default:
      return false;
  }
}

function getStepExplanation(step: VisualizationStep, problemTitle?: string): { title: string; sections: { heading: string; body: string }[] } {
  switch (step.kind) {
    case 'powerRule':
      if (problemTitle?.includes('예제 3.2.1') || problemTitle?.includes('다음 함수들의 도함수를 거듭제곱 미분법으로 구하시오.')) {
        return {
          title: '거듭제곱 미분법 적용하기',
          sections: [
            {
              heading: '핵심',
              body:
                '거듭제곱 미분법은 $x^n$을 미분할 때 지수를 앞으로 내리고, 지수를 1 줄이는 방법이다. 상수가 앞에 있으면 그 상수는 그대로 두고 함께 곱한다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '시각화에서는 지수가 계수로 내려오고, 남은 문자 부분의 지수는 1만큼 줄어드는 과정을 단계별로 보여 준다. 따라서 식이 바뀌는 이유를 눈으로 따라갈 수 있다.',
            },
            {
              heading: '문제 연결',
              body:
                '$x^7$, $5x^3$, $\\dfrac{1}{2}x^6$ 모두 같은 규칙으로 처리한다. 각각 지수를 앞에 곱해 주면 $7x^6$, $15x^2$, $3x^5$가 된다.',
            },
          ],
        };
      }
      if (problemTitle?.includes('$x = 2$에서 $f(x) = 3x^4$의 미분계수를 구하시오.')) {
        return {
          title: '도함수를 구한 뒤 한 점에 대입하기',
          sections: [
            {
              heading: '핵심',
              body:
                '먼저 거듭제곱 미분법으로 도함수 $f\'(x)$를 구한 뒤, 원하는 $x$값을 대입하면 그 점에서의 미분계수를 구할 수 있다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '$x=2$에서의 미분계수는 그래프 위 점에서의 접선 기울기와 같다. 따라서 시각화에서 보이는 접선의 가파른 정도가 계산 결과와 연결된다.',
            },
            {
              heading: '문제 연결',
              body:
                '$f(x)=3x^4$이면 $f\'(x)=12x^3$이다. 여기에 $x=2$를 넣으면 $f\'(2)=12 \\cdot 2^3=96$이 되어 미분계수를 구할 수 있다.',
            },
          ],
        };
      }
      return {
        title: '거듭제곱 미분법',
        sections: [
          {
            heading: '핵심',
            body:
              '거듭제곱 미분법은 지수를 앞으로 내리고 지수를 1 줄이는 규칙이다.',
          },
          {
            heading: '그래프 읽기',
            body:
              '시각화는 식이 한 단계씩 바뀌는 순서를 보여 주어 규칙을 더 분명하게 이해하게 한다.',
          },
          {
            heading: '문제 연결',
            body:
              '단항식의 미분은 거의 모두 이 규칙으로 바로 계산할 수 있다.',
          },
        ],
      };
    case 'limitDefinition':
      return {
        title: '할선이 접선으로 가까워지는 모습',
        sections: [
          {
            heading: '핵심',
            body:
              '이 그래프는 한 점 $x=a$에서의 **미분계수**를 보여 준다. 미분계수는 점 $(a, f(a))$에서 그은 **접선의 기울기**이고, 식으로는 평균변화율 $\\dfrac{f(a+h)-f(a)}{h}$를 이용해 구한다.',
          },
          {
            heading: '그래프 읽기',
            body:
              '점 $A$는 기준점이고, 점 $B$는 $h$만큼 옆으로 움직인 점이다. 점 $B$가 $A$에 가까워질수록 두 점을 잇는 직선은 접선과 거의 같은 방향이 된다.',
          },
          {
            heading: '문제 연결',
            body:
              '문제를 풀 때는 먼저 할선의 기울기를 식으로 세운다. 그다음 $h \\to 0$을 생각하면, 그래프에서는 두 점이 가까워지고 계산에서는 접선의 기울기 하나로 정리된다.',
          },
        ],
      };
    case 'piecewiseGraph':
      return {
        title: '좌미분과 우미분을 비교해 미분가능성 판단하기',
        sections: [
          {
            heading: '핵심',
            body:
              '조각함수의 미분가능성을 판단할 때는 한 점에서의 **좌미분계수**와 **우미분계수**가 모두 존재하고 서로 같은지 확인해야 한다.',
          },
          {
            heading: '그래프 읽기',
            body:
              '이 시각화는 $x=0$의 왼쪽과 오른쪽에서 각각 할선의 기울기가 어떻게 변하는지 보여 준다. 양쪽에서 가까워질 때 기울기가 같은 값으로 모이면 그 점에서 미분가능하다고 볼 수 있다.',
          },
          {
            heading: '문제 연결',
            body:
              '이 문제에서는 오른쪽에서는 $x^2$, 왼쪽에서는 $-x^2$를 사용한다. 두 경우 모두 기울기가 $0$으로 가까워지므로, $x=0$에서 미분가능하고 미분계수도 $0$이다.',
          },
        ],
      };
    case 'coordinatePlane':
      if (problemTitle?.includes('예제 2.1.1') || problemTitle?.includes('점 $\\mathrm{P}(3, -2)$를 좌표평면에 나타내고')) {
        return {
          title: '좌표로 점의 위치 읽기',
          sections: [
            {
              heading: '핵심',
              body:
                '순서쌍 $(x, y)$에서 첫 번째 수는 **x좌표(가로)**, 두 번째 수는 **y좌표(세로)**이다. x좌표의 부호가 양수이면 오른쪽, 음수이면 왼쪽에 점이 있다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '점 P(3, −2)는 x축으로 오른쪽 3, y축으로 아래 2만큼 이동한 위치이다. x > 0이고 y < 0이므로 제4사분면에 있다.',
            },
            {
              heading: '문제 연결',
              body:
                'x좌표의 부호: +, y좌표의 부호: − 이면 항상 **제4사분면**이다. 시각화의 점 위치로 이 사실을 눈으로 확인하라.',
            },
          ],
        };
      }
      return {
        title: '좌표평면 위의 점과 사분면',
        sections: [
          {
            heading: '핵심',
            body:
              'x축과 y축이 만드는 네 구역을 사분면이라 한다. 점의 좌표 부호를 보면 그 점이 어느 사분면에 있는지 바로 알 수 있다.',
          },
          {
            heading: '그래프 읽기',
            body:
              '각 점의 x좌표와 y좌표의 부호를 확인한다. x > 0이고 y > 0이면 제1사분면, x < 0이고 y > 0이면 제2사분면이다.',
          },
          {
            heading: '문제 연결',
            body:
              '좌표축 위(x = 0 또는 y = 0)에 있는 점은 어느 사분면에도 속하지 않는다는 점을 주의하라.',
          },
        ],
      };
    case 'systemOfEquations':
      if (problemTitle?.includes('예제 2.4.1') || problemTitle?.includes('$y=x+1$, $y=-x+3$의 해를 그래프로 해석하시오.')) {
        return {
          title: '두 직선의 교점을 해로 읽기',
          sections: [
            {
              heading: '핵심',
              body:
                '연립방정식의 해는 두 식을 동시에 만족하는 점이다. 그래프에서는 두 직선이 만나는 **교점**이 바로 그 해가 된다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '한 직선은 오른쪽으로 갈수록 올라가고, 다른 직선은 내려간다. 두 직선이 만나는 점의 좌표를 읽으면 해를 바로 확인할 수 있다.',
            },
            {
              heading: '문제 연결',
              body:
                '이 문제에서는 두 직선이 $(1, 2)$에서 만나므로, 연립방정식의 해를 그래프로 해석하면 **$(1, 2)$**가 된다.',
            },
          ],
        };
      }
      if (problemTitle?.includes('연습문제 2.4.1') || problemTitle?.includes('$y=2x+1$, $y=-x+4$의 해를 구하시오.')) {
        return {
          title: '교점 좌표를 읽어 해 구하기',
          sections: [
            {
              heading: '핵심',
              body:
                '두 직선을 각각 그리면 교점 하나가 생기고, 그 점의 좌표가 두 식을 동시에 만족하는 값이 된다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '그래프에서 두 직선은 하나는 더 가파르게 올라가고 다른 하나는 내려간다. 만나는 지점은 $(1, 3)$ 근처로 보인다.',
            },
            {
              heading: '문제 연결',
              body:
                '따라서 이 연습문제의 해는 **$(1, 3)$**이다. 식으로 풀어도 같은 좌표가 나온다.',
            },
          ],
        };
      }
      if (problemTitle?.includes('연습문제 2.4.2') || problemTitle?.includes('$y=x+2$, $y=-2x+5$의 해를 구하시오.')) {
        return {
          title: '기울기가 다른 두 직선의 교점',
          sections: [
            {
              heading: '핵심',
              body:
                '기울기가 다른 두 직선은 반드시 한 점에서 만난다. 그 한 점이 연립방정식의 유일한 해다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '한 직선은 완만하게 올라가고 다른 직선은 더 가파르게 내려간다. 둘이 만나는 점은 $(1, 3)$이다.',
            },
            {
              heading: '문제 연결',
              body:
                '이 문제에서는 그래프의 교점이 **$(1, 3)$**이므로, 그것이 연립방정식의 해이다.',
            },
          ],
        };
      }
      if (problemTitle?.includes('연습문제 2.4.3') || problemTitle?.includes('$y=3x-1$, $y=-x+7$의 해를 구하시오.')) {
        return {
          title: '교점을 식과 그래프로 동시에 확인하기',
          sections: [
            {
              heading: '핵심',
              body:
                '연립방정식은 식으로도 풀 수 있고 그래프로도 읽을 수 있다. 두 방법이 같은 교점 좌표를 준다는 것이 중요하다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '기울기 3인 직선은 빠르게 올라가고, 다른 직선은 내려간다. 두 직선은 $(2, 5)$에서 만난다.',
            },
            {
              heading: '문제 연결',
              body:
                '따라서 이 문제의 해는 **$(2, 5)$**이다. 시각화는 그 좌표가 왜 해가 되는지 교점으로 보여 준다.',
            },
          ],
        };
      }
      return {
        title: '연립방정식과 교점',
        sections: [
          {
            heading: '핵심',
            body:
              '두 일차방정식을 그래프로 나타내면 두 직선의 교점이 연립방정식의 해가 된다.',
          },
          {
            heading: '그래프 읽기',
            body:
              '교점에서는 두 직선의 y값이 같아지므로, 같은 x와 y를 동시에 만족하는 좌표를 얻을 수 있다.',
          },
          {
            heading: '문제 연결',
            body:
              '그래프에서 읽은 교점 좌표를 식에 대입하면 두 식을 모두 만족하는 것을 확인할 수 있다.',
          },
        ],
      };
    case 'tangentLine':
      if (problemTitle?.includes('함수 $f(x) = \\dfrac{1}{x}$의 $x = 1$에서의 미분계수를 정의에 따라 구하시오.')) {
        return {
          title: '정의로 구한 미분계수를 그래프와 연결하기',
          sections: [
            {
              heading: '핵심',
              body:
                '이 문제에서는 먼저 정의를 이용해 $f\'(1)$을 구하고, 그 값이 실제로 그래프에서 어떤 접선의 기울기인지 확인한다. 즉, 계산 결과와 그래프의 의미를 연결하는 것이 핵심이다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '함수 $y=\\dfrac{1}{x}$는 $x=1$에서 오른쪽으로 갈수록 내려가는 모양이다. 따라서 이 점에서의 접선 기울기는 음수여야 하고, 그래프에서도 그 접선이 오른쪽 아래로 기울어져 있음을 볼 수 있다.',
            },
            {
              heading: '문제 연결',
              body:
                '정의에 따라 계산하면 $f\'(1)=-1$이 나온다. 이 값은 점 $(1,1)$에서 그은 접선의 기울기가 $-1$이라는 뜻이므로, 수식으로 구한 결과를 그래프에서 다시 확인할 수 있다.',
            },
          ],
        };
      }
      if (problemTitle?.includes('곡선 $y = x^3$의 점 $(-1, -1)$에서의 접선의 방정식을 구하시오.')) {
        return {
          title: '한 점에서의 접선 구하기',
          sections: [
            {
              heading: '핵심',
              body:
                '함수 $y = x^3$에서 한 점에서의 접선은 그 점에서의 기울기, 즉 **미분계수**를 이용해 구할 수 있다. 따라서 먼저 도함수 $f\'(x)$를 구하고, 그다음 $x=-1$에서의 기울기를 찾으면 된다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '점 $(-1,-1)$은 곡선 위의 점이다. 이 점에서 그은 접선은 곡선을 한순간 같은 방향으로 스치는 직선이다. 그래프를 보면 이 점에서 접선이 오른쪽으로 올라가므로 기울기가 양수임을 알 수 있다.',
            },
            {
              heading: '문제 연결',
              body:
                '$f\'(x)=3x^2$이므로 $f\'(-1)=3$이다. 이제 점 $(-1,-1)$과 기울기 $3$을 점-기울기 형식에 넣으면 접선의 방정식을 구할 수 있다.',
            },
          ],
        };
      }
      if (problemTitle?.includes('점 $(1, 0)$에서 곡선 $y = x^2 + 1$에 그은 접선의 방정식을 구하시오.')) {
        return {
          title: '한 점에서의 접선과 순간변화율',
          sections: [
            {
              heading: '핵심',
              body:
                '함수 $y = x^2 + 1$에서 한 점에서의 접선은 그 점에서의 기울기, 즉 **미분값**을 이용해 구한다. 이 문제는 주어진 점이 곡선 위의 점이 아니라는 점이 중요하다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '점 $(1,0)$은 곡선 $y=x^2+1$ 위에 있지 않고 곡선 아래쪽에 있다. 따라서 접선을 바로 그을 수 없고, 곡선 위의 어떤 접점에서 출발한 접선이 이 점을 지나가도록 찾아야 한다.',
            },
            {
              heading: '문제 연결',
              body:
                '접점을 $(t, t^2+1)$로 놓으면 그 점에서의 기울기는 $f\'(t)=2t$이다. 한편 접선은 점 $(1,0)$도 지나야 하므로, 접선의 기울기를 두 점을 잇는 직선의 기울기와 같게 두어 식을 세우면 된다.',
            },
          ],
        };
      }
      if (problemTitle?.includes('곡선 $y = x^2 - 4x + 5$에서 기울기가 $2$인 접선의 방정식을 구하시오.')) {
        return {
          title: '주어진 기울기를 가지는 접선 구하기',
          sections: [
            {
              heading: '핵심',
              body:
                '함수 $y = x^2 - 4x + 5$에서 접선의 기울기는 미분값 $f\'(x)$이다. 따라서 기울기가 $2$인 접선을 구하려면 먼저 $f\'(x)=2$가 되는 점을 찾아야 한다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '그래프에서 기울기가 $2$라는 것은 오른쪽으로 1만큼 갈 때 위로 2만큼 올라가는 접선을 뜻한다. 곡선 위에서 이런 방향을 가지는 점은 하나뿐이며, 그 점이 바로 접점이 된다.',
            },
            {
              heading: '문제 연결',
              body:
                '$f\'(x)=2x-4$이므로 $2x-4=2$를 풀어 접점의 $x$좌표를 구한다. 그다음 그 점의 함수값을 찾고, 기울기 $2$와 접점을 이용해 접선의 방정식을 쓰면 된다.',
            },
          ],
        };
      }
      return {
        title: '한 점에서의 접선과 순간변화율',
        sections: [
          {
            heading: '핵심',
            body:
              '이 그래프는 함수의 한 점에서 그은 **접선**을 보여 준다. 접선의 기울기는 그 점에서의 **순간변화율**이고, 바로 미분계수의 뜻이다.',
          },
          {
            heading: '그래프 읽기',
            body:
              '접선이 오른쪽으로 갈수록 올라가면 기울기는 양수이고, 내려가면 음수이다. 거의 수평이면 기울기는 0에 가깝다. 그래서 접선의 모양만 보고도 함수의 변화를 읽을 수 있다.',
          },
          {
            heading: '문제 연결',
            body:
              '계산으로 구한 $f\'(a)$는 그냥 숫자가 아니라 접선의 기울기이다. 따라서 답을 구한 뒤에는 그래프에서 실제로 얼마나 가파른지 같이 확인하는 습관이 중요하다.',
          },
        ],
      };
    case 'riemannSum':
      if (problemTitle?.includes('정적분 $\\displaystyle\\int_0^1 x^2\\,dx$를 미적분학의 기본 정리를 이용해 계산하시오.')) {
        return {
          title: '리만합과 정적분 값을 함께 보기',
          sections: [
            {
              heading: '핵심',
              body:
                '정적분은 곡선 아래 넓이를 뜻하고, 리만합은 그 넓이를 직사각형으로 가까이 나타낸 값이다. 직사각형 개수가 많아질수록 실제 넓이에 더 가까워진다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '그래프 아래를 채우는 직사각형들은 $[0,1]$에서 $y=x^2$의 넓이를 근사한다. 직사각형이 촘촘해질수록 빈틈이 줄어들어 실제 곡선 아래 넓이에 가까워진다.',
            },
            {
              heading: '문제 연결',
              body:
                '이 문제의 실제 정적분 값은 미적분학의 기본 정리로 구할 수 있다. 즉 $F(x)=\\dfrac{x^3}{3}$을 이용하면 $\\int_0^1 x^2\\,dx = \\left[\\dfrac{x^3}{3}\\right]_0^1 = \\dfrac{1}{3}$이 된다.',
            },
          ],
        };
      }
      if (problemTitle?.includes('$n = 4$인 오른쪽 리만합으로 $\\displaystyle\\int_0^2 x^2\\,dx$를 근사하고, 실제값과 비교하시오.')) {
        return {
          title: '오른쪽 리만합으로 넓이 근사하기',
          sections: [
            {
              heading: '핵심',
              body:
                '오른쪽 리만합은 각 작은 구간의 오른쪽 끝값을 높이로 삼아 직사각형 넓이를 더하는 방법이다. 따라서 실제 넓이보다 크거나 작게 나올 수 있다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '$y=x^2$는 오른쪽으로 갈수록 커지는 함수이므로, 오른쪽 끝점을 사용하면 각 직사각형 높이가 실제 곡선보다 조금 크게 잡힌다. 그래서 합이 실제 넓이보다 커지는 모습을 볼 수 있다.',
            },
            {
              heading: '문제 연결',
              body:
                '$n=4$이면 $\\Delta x=0.5$이고, 오른쪽 끝점 값들을 넣어 계산하면 근삿값을 구할 수 있다. 그런 다음 실제값 $\\dfrac{8}{3}$과 비교하면 오른쪽 리만합이 과대추정임을 확인할 수 있다.',
            },
          ],
        };
      }
      return {
        title: '직사각형으로 넓이 근사하기',
        sections: [
          {
            heading: '핵심',
            body:
              '리만합은 곡선 아래 넓이를 여러 개의 직사각형 넓이의 합으로 가까이 나타내는 방법이다.',
          },
          {
            heading: '그래프 읽기',
            body:
              '직사각형이 많아질수록 곡선을 더 잘 따라가므로 근삿값이 더 정확해진다.',
          },
          {
            heading: '문제 연결',
            body:
              '리만합은 정적분의 의미를 그래프로 이해하는 데 가장 기본이 되는 도구다.',
          },
        ],
      };
    case 'definiteIntegral':
      if (problemTitle?.includes('정적분 $\\displaystyle\\int_0^1 x^2\\,dx$를 미적분학의 기본 정리를 이용해 계산하시오.')) {
        return {
          title: '정적분 값을 넓이로 이해하기',
          sections: [
            {
              heading: '핵심',
              body:
                '정적분은 단순한 계산 결과가 아니라 그래프와 $x$축 사이의 넓이를 뜻한다. 이 문제에서는 그 넓이를 역도함수를 이용해 정확하게 계산한다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '$[0,1]$ 구간에서 $y=x^2$는 $x$축 위에 있으므로 정적분 값은 그대로 넓이의 크기와 같다. 음수 부분이 없기 때문에 부호를 따로 걱정할 필요가 없다.',
            },
            {
              heading: '문제 연결',
              body:
                '$x^2$의 역도함수는 $\\dfrac{x^3}{3}$이다. 따라서 $\\int_0^1 x^2\\,dx = \\left[\\dfrac{x^3}{3}\\right]_0^1 = \\dfrac{1}{3}$이 되어, 그림으로 본 넓이를 식으로도 정확히 구할 수 있다.',
            },
          ],
        };
      }
      if (problemTitle?.includes('정적분 $\\displaystyle\\int_1^2 (2x + 1)\\,dx$를 계산하시오.')) {
        return {
          title: '직선 아래 넓이를 정적분으로 계산하기',
          sections: [
            {
              heading: '핵심',
              body:
                '정적분은 직선이나 곡선 아래 넓이를 계산하는 도구다. 이 문제에서는 함수가 직선이므로 구간에 따른 넓이를 비교적 쉽게 해석할 수 있다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '$y=2x+1$은 $[1,2]$에서 계속 양수이므로, 정적분 값은 그래프와 $x$축 사이 넓이와 같다. 그래프를 보면 이 넓이가 꽤 크게 잡힌다는 것도 직관적으로 알 수 있다.',
            },
            {
              heading: '문제 연결',
              body:
                '역도함수 $F(x)=x^2+x$를 이용하면 $\\int_1^2 (2x+1)\\,dx=[x^2+x]_1^2=4$가 된다. 즉 그래프에서 본 넓이를 정확한 수로 계산한 것이다.',
            },
          ],
        };
      }
      if (problemTitle?.includes('$\\displaystyle\\int_0^2 (x^3 - x)\\,dx$를 계산하시오.')) {
        return {
          title: '부호를 생각하며 정적분 계산하기',
          sections: [
            {
              heading: '핵심',
              body:
                '정적분은 넓이이지만, 정확히는 **부호 있는 넓이**이다. 따라서 그래프가 $x$축 아래에 있는 부분은 음수로 계산된다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '$y=x^3-x$는 구간 안에서 어떤 부분은 $x$축 아래, 어떤 부분은 위에 있다. 그래서 정적분은 각 부분 넓이를 부호까지 포함해 합친 값으로 이해해야 한다.',
            },
            {
              heading: '문제 연결',
              body:
                '역도함수 $\\dfrac{x^4}{4}-\\dfrac{x^2}{2}$를 이용해 계산하면 전체 부호 있는 넓이가 2가 된다. 즉 그래프에서 보이는 여러 부분을 따로 떼지 않고 한 번에 계산할 수 있다.',
            },
          ],
        };
      }
      if (problemTitle?.includes('$\\displaystyle\\int_{-1}^{2} (3x^2 - 2x + 1)\\,dx$를 계산하시오.')) {
        return {
          title: '구간 전체의 누적 넓이 계산하기',
          sections: [
            {
              heading: '핵심',
              body:
                '정적분은 시작점에서 끝점까지 함수값이 얼마나 누적되는지를 나타낸다. 구간이 넓어져도 계산 원리는 같고, 역도함수의 값만 양 끝에서 비교하면 된다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '함수 $3x^2-2x+1$은 주어진 구간에서 대부분 $x$축 위에 있으므로 정적분 값도 큰 양수로 나타난다. 따라서 넓이를 누적하는 느낌으로 해석할 수 있다.',
            },
            {
              heading: '문제 연결',
              body:
                '역도함수 $F(x)=x^3-x^2+x$를 구한 뒤 $F(2)-F(-1)$을 계산하면 된다. 이렇게 하면 복잡해 보이는 넓이도 한 번에 정확한 값으로 정리된다.',
            },
          ],
        };
      }
      return {
        title: '정적분과 넓이',
        sections: [
          {
            heading: '핵심',
            body:
              '정적분은 그래프와 $x$축 사이 넓이를 수로 나타내는 방법이다.',
          },
          {
            heading: '그래프 읽기',
            body:
              '그래프가 $x$축 위에 있으면 양수, 아래에 있으면 음수로 계산된다는 점을 함께 생각해야 한다.',
          },
          {
            heading: '문제 연결',
            body:
              '역도함수를 이용하면 넓이를 정확한 값으로 계산할 수 있다.',
          },
        ],
      };
    case 'derivativeGraph':
      if (problemTitle?.includes('음수 및 분수 지수의 미분: $f(x) = x^{-3}$과 $g(x) = x^{2/3}$의 도함수를 구하시오.')) {
        return {
          title: '음수 지수와 분수 지수의 도함수',
          sections: [
            {
              heading: '핵심',
              body:
                '지수가 음수이거나 분수여도 거듭제곱 미분법은 그대로 적용된다. 즉, 지수를 앞으로 곱하고 지수를 1 줄이면 된다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '$x^{-3}$은 $x=0$ 근처에서 매우 급하게 변하고, $x^{2/3}$은 원점 근처에서 모양이 특별하다. 그래프를 보면 식의 형태에 따라 변화가 어떻게 달라지는지 알 수 있다.',
            },
            {
              heading: '문제 연결',
              body:
                '$x^{-3}$은 $-3x^{-4}$, $x^{2/3}$은 $\\dfrac{2}{3}x^{-1/3}$으로 미분된다. 즉 지수의 종류가 달라도 규칙은 같고, 결과만 식의 모양에 맞게 정리하면 된다.',
            },
          ],
        };
      }
      if (problemTitle?.includes('$f(x) = x^3 - 3x$의 도함수를 구하고, 극값과 증감 구간을 조사하시오.')) {
        return {
          title: '도함수로 극값과 증감 구간 찾기',
          sections: [
            {
              heading: '핵심',
              body:
                '도함수는 원함수의 기울기를 나타낸다. 따라서 도함수의 부호를 보면 원함수가 증가하는지 감소하는지 판단할 수 있다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '원함수가 올라가는 구간에서는 도함수 값이 양수이고, 내려가는 구간에서는 음수이다. 또 최고점이나 최저점에서는 접선이 수평이 되어 도함수 값이 0이 된다.',
            },
            {
              heading: '문제 연결',
              body:
                '$f\'(x)=3x^2-3=3(x-1)(x+1)$이므로 $x=-1,1$에서 부호가 바뀌는지 보면 된다. 이 부호 변화를 이용해 극대, 극소와 증감 구간을 함께 찾을 수 있다.',
            },
          ],
        };
      }
      if (problemTitle?.includes('$f(x) = 2x^3 - 6x^2 + 1$의 도함수를 구하고, 이계도함수를 이용해 $x = 2$에서의 극값 여부를 판별하시오.')) {
        return {
          title: '이계도함수로 극값 판별하기',
          sections: [
            {
              heading: '핵심',
              body:
                '먼저 도함수로 임계점을 찾고, 그다음 이계도함수의 부호로 극대인지 극소인지 판별할 수 있다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '$x=2$ 근처에서 그래프가 아래로 꺾였다가 다시 올라가면 그 점은 극소일 가능성이 크다. 이계도함수가 양수이면 실제로 아래로 볼록한 모양이므로 극소로 판단한다.',
            },
            {
              heading: '문제 연결',
              body:
                '$f\'(x)=6x(x-2)$이므로 $x=2$는 임계점이다. 또 $f\'\'(x)=12x-12$이어서 $f\'\'(2)=12>0$이므로 $x=2$에서는 극소가 된다.',
            },
          ],
        };
      }
      if (problemTitle?.includes('$f(x) = x^4 - 4x^3$의 도함수를 구하고, 극값을 찾으시오.')) {
        return {
          title: '도함수의 부호 변화로 극값 찾기',
          sections: [
            {
              heading: '핵심',
              body:
                '극값은 보통 도함수가 0이 되는 점에서 후보가 된다. 하지만 도함수 값이 0이라고 해서 항상 극값인 것은 아니므로 부호 변화를 꼭 확인해야 한다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '그래프를 보면 어떤 점에서는 접선이 수평이어도 함수가 계속 같은 방향으로 움직일 수 있다. 이런 경우에는 도함수가 0이어도 극값이 아니다.',
            },
            {
              heading: '문제 연결',
              body:
                '$f\'(x)=4x^2(x-3)$에서 $x=0,3$이 후보이다. 그런데 $x=0$에서는 부호가 바뀌지 않고, $x=3$에서는 음수에서 양수로 바뀌므로 극소만 생긴다.',
            },
          ],
        };
      }
      if (problemTitle?.includes('$f(x) = x^3 - 6x^2 + 9x - 2$의 모든 극값을 구하시오.')) {
        return {
          title: '모든 극값 찾기',
          sections: [
            {
              heading: '핵심',
              body:
                '모든 극값을 찾으려면 먼저 도함수를 구하고, 도함수가 0이 되는 점마다 부호 변화를 조사해야 한다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '도함수 그래프가 $x$축을 지나며 부호가 바뀌는 점에서는 원함수의 증가와 감소가 바뀐다. 이때 그 점이 극대나 극소가 된다.',
            },
            {
              heading: '문제 연결',
              body:
                '$f\'(x)=3(x-1)(x-3)$이므로 후보는 $x=1,3$이다. 각 점에서 부호가 바뀌는 방향을 보고 극대와 극소를 구한 뒤, 원함수 값까지 계산하면 된다.',
            },
          ],
        };
      }
      if (problemTitle?.includes('$f(x) = x^3 - 3x + 2$의 이계도함수를 구하고, 변곡점을 구하시오.')) {
        return {
          title: '이계도함수와 변곡점',
          sections: [
            {
              heading: '핵심',
              body:
                '변곡점은 그래프의 휘어짐이 바뀌는 점이다. 이를 확인할 때 이계도함수의 부호 변화를 이용한다.',
            },
            {
              heading: '그래프 읽기',
              body:
                '어느 한 점을 기준으로 그래프가 한쪽에서는 아래로 굽고, 다른 쪽에서는 위로 굽는다면 그 점이 변곡점이다.',
            },
            {
              heading: '문제 연결',
              body:
                '$f\'\'(x)=6x$이므로 $x=0$에서 0이 되고, 왼쪽에서는 음수, 오른쪽에서는 양수가 된다. 따라서 $x=0$에서 휘어짐이 바뀌어 변곡점이 생긴다.',
            },
          ],
        };
      }
      return {
        title: '원함수와 도함수의 관계',
        sections: [
          {
            heading: '핵심',
            body:
              '이 시각화는 원함수와 도함수를 함께 보여 준다. 도함수는 원함수의 각 점에서 구한 접선 기울기를 새로운 함수로 나타낸 것이다.',
          },
          {
            heading: '그래프 읽기',
            body:
              '원함수가 올라가는 구간에서는 도함수 값이 양수이고, 내려가는 구간에서는 음수이다. 또 원함수의 최고점이나 최저점 근처에서는 접선이 수평에 가까워져서 도함수 값이 0이 된다.',
          },
          {
            heading: '문제 연결',
            body:
              '문제를 풀 때 도함수 그래프를 보면 함수가 어디서 증가하고 감소하는지 빠르게 판단할 수 있다. 그래서 극값, 증가·감소 구간을 찾는 문제에 특히 도움이 된다.',
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
