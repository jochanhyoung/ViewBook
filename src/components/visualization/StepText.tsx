'use client';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { BlockMath } from 'react-katex';

interface StepTextProps {
  latex?: string;
  markdown?: string;
}

function fixMarkdown(text: string): string {
  const fixed = text
    .replace(/¥rac/g, '\\frac')
    .replace(/¥/g, '\\')
    .replace(/(?<!\\)(?<![a-z])ext\{/g, '\\text{')
    .replace(/(?<!\\)frac\{/g, '\\frac{')
    .replace(/(?<!\\)sqrt\{/g, '\\sqrt{')
    .replace(/\bcdot\b/g, '\\cdot')
    .replace(/\btimes\b/g, '\\times')
    .replace(/\blim_/g, '\\lim_')
    .replace(/([_^])\s+/g, '$1');

  // $로 감싸지지 않은 LaTeX 수식을 자동으로 $...$로 감쌈
  // 한국어/CJK 문자 경계에서 분리하여 수식 구간만 감쌈
  return wrapUndelimitedLatex(fixed);
}

const LATEX_CMD = /\\(?:frac|sqrt|text|cdot|times|lim|sum|int|infty|pi|theta|alpha|beta|gamma|delta)\b/;
const CJK = /[\uAC00-\uD7A3\u4E00-\u9FFF]/;

function wrapUndelimitedLatex(text: string): string {
  // 이미 $...$로 감싸진 부분이 있거나 LaTeX 명령어가 없으면 그대로 반환
  if (!LATEX_CMD.test(text)) return text;

  // 한국어/CJK 문자 경계로 분리하여 수식 포함 세그먼트만 $...$로 감쌈
  const parts = text.split(/([\uAC00-\uD7A3\u4E00-\u9FFF\s]+)/g);
  return parts.map(part => {
    if (LATEX_CMD.test(part) && !part.includes('$') && !CJK.test(part)) {
      return `$${part.trim()}$`;
    }
    return part;
  }).join('');
}

export function StepText({ latex, markdown }: StepTextProps) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '24px', textAlign: 'center' }}>
      {latex && (
        <div style={{ fontSize: '1.8rem' }}>
          <BlockMath math={latex} />
        </div>
      )}
      {markdown && (
        <div
          className="ko-text"
          style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--color-text-dim)', maxWidth: '400px' }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex] as never[]}
            components={{
              p: ({ children }) => <p style={{ margin: '0 0 8px' }}>{children}</p>,
              strong: ({ children }) => <strong style={{ color: 'var(--color-text)' }}>{children}</strong>,
            }}
          >
            {fixMarkdown(markdown)}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
