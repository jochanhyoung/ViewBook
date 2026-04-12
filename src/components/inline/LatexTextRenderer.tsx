'use client';
import { useMemo } from 'react';
import { renderToString } from 'katex';

interface LatexTextRendererProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 텍스트 내부의 $...$ 인라인 수식을 KaTeX로 직접 렌더링한다.
 * Markdown 파서를 우회하므로 \sum, \int, * 등 복잡한 표현도 안전하게 처리된다.
 * throwOnError: false 로 수식 오류 시 앱 중단 없이 raw text로 폴백한다.
 */
export function LatexTextRenderer({ text, className, style }: LatexTextRendererProps) {
  const segments = useMemo(() => {
    // $...$ 패턴이 없으면 분리 작업 자체를 건너뜀 (성능 최적화)
    if (!text || !text.includes('$')) return null;
    // 캡처 그룹을 쓰면 split이 구분자($...$)를 배열에 포함시킨다
    return text.split(/(\$[^$\n]+\$)/g);
  }, [text]);

  if (!segments) {
    return (
      <span className={className} style={style}>
        {text}
      </span>
    );
  }

  return (
    <span className={className} style={style}>
      {segments.map((seg, i) => {
        // $...$ 구분자인 경우 KaTeX로 직접 변환
        if (seg.startsWith('$') && seg.endsWith('$') && seg.length > 2) {
          const math = seg.slice(1, -1);
          const html = renderToString(math, {
            throwOnError: false,   // 파싱 오류 시 앱 중단 방지
            displayMode: false,    // 인라인 모드
            output: 'html',
          });
          return (
            <span
              key={i}
              // katex의 출력은 자체적으로 XSS-safe하다
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }
        // 일반 텍스트
        return seg ? <span key={i}>{seg}</span> : null;
      })}
    </span>
  );
}
