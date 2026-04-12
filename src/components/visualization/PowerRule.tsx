'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InlineMath, BlockMath } from 'react-katex';

interface PowerRuleProps {
  coefficient: number;
  exponent: number;
}

const STEPS = [
  '지수가 계수로 내려온다',
  '계수끼리 곱한다',
  '지수는 1 감소한다',
  '최종 결과',
];

export function PowerRule({ coefficient, exponent }: PowerRuleProps) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [userCoef, setUserCoef] = useState(coefficient);
  const [userExp, setUserExp] = useState(exponent);

  const newCoef = userCoef * userExp;
  const newExp = userExp - 1;

  useEffect(() => {
    setStep(0);
  }, [userCoef, userExp]);

  useEffect(() => {
    if (!playing) return;
    if (step >= 4) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStep((s) => s + 1), step === 0 ? 800 : 1200);
    return () => clearTimeout(timer);
  }, [playing, step]);

  function formatLatex(c: number, e: number) {
    if (c === 1 && e === 1) return 'x';
    if (c === 1) return `x^{${e}}`;
    if (e === 1) return `${c}x`;
    return `${c}x^{${e}}`;
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        gap: '32px',
      }}
    >
      {/* 조작 패널 */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#5a5a66', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
          계수
          <input
            type="number"
            value={userCoef}
            onChange={(e) => setUserCoef(Number(e.target.value))}
            style={{
              width: '56px',
              background: '#1a1a1f',
              border: '1px solid #26262d',
              borderRadius: '4px',
              color: '#ececef',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              padding: '4px 8px',
              textAlign: 'center',
            }}
          />
        </label>
        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#5a5a66', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
          지수
          <input
            type="number"
            value={userExp}
            onChange={(e) => setUserExp(Number(e.target.value))}
            style={{
              width: '56px',
              background: '#1a1a1f',
              border: '1px solid #26262d',
              borderRadius: '4px',
              color: '#ececef',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              padding: '4px 8px',
              textAlign: 'center',
            }}
          />
        </label>
      </div>

      {/* 메인 수식 영역 */}
      <div style={{ position: 'relative', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {step === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '3rem', color: '#ececef', fontFamily: 'var(--font-display)' }}>
              <InlineMath math={formatLatex(userCoef, userExp)} />
            </div>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ marginTop: '12px' }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#d4ff4f', letterSpacing: '0.15em' }}>
                지수 {userExp} 주목
              </span>
            </motion.div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '2.4rem', color: '#ececef', justifyContent: 'center' }}>
              <span style={{ color: '#b8b8c0' }}><InlineMath math={String(userCoef)} /></span>
              <span style={{ color: '#8a8a96' }}>·</span>
              <motion.span
                style={{ color: '#d4ff4f' }}
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              >
                <InlineMath math={String(userExp)} />
              </motion.span>
              <span style={{ color: '#b8b8c0' }}><InlineMath math={`x^{${userExp - 1}}`} /></span>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '2.4rem', color: '#ececef' }}>
              <motion.span
                style={{ color: '#d4ff4f', display: 'inline-block' }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.4 }}
              >
                <InlineMath math={String(newCoef)} />
              </motion.span>
              <InlineMath math={`x^{${newExp}}`} />
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#8aa82d', marginTop: '8px' }}>
              {userCoef} × {userExp} = {newCoef}
            </p>
          </motion.div>
        )}

        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '2.8rem', color: '#ececef' }}>
              <InlineMath math={`\\left(${formatLatex(userCoef, userExp)}\\right)' = ${formatLatex(newCoef, newExp)}`} />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}
            >
              {[
                `계수: ${userCoef} × ${userExp} = ${newCoef}`,
                `지수: ${userExp} → ${newExp}`,
              ].map((t, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: '#5a5a66',
                    background: '#1a1a1f',
                    padding: '4px 10px',
                    borderRadius: '3px',
                    border: '1px solid #26262d',
                  }}
                >
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* 해설 텍스트 */}
      <AnimatePresence mode="wait">
        {step < STEPS.length && (
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: '#5a5a66',
              letterSpacing: '0.05em',
            }}
            className="ko-text"
          >
            {STEPS[step]}
          </motion.p>
        )}
      </AnimatePresence>

      {/* 재생 버튼 */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => { setStep(0); setPlaying(true); }}
          style={{
            background: '#d4ff4f',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: '#0a0a0b',
            padding: '7px 16px',
            letterSpacing: '0.08em',
          }}
        >
          ▶ 재생
        </button>
        <button
          onClick={() => { setStep(0); setPlaying(false); }}
          style={{
            background: 'none',
            border: '1px solid #26262d',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: '#8a8a96',
            padding: '7px 16px',
          }}
        >
          초기화
        </button>
      </div>
    </div>
  );
}
