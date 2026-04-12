'use client';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface NoteBlockProps {
  variant: 'info' | 'history' | 'tip';
  markdown: string;
}

const LABELS: Record<NoteBlockProps['variant'], string> = {
  info: 'INFO',
  history: 'HISTORY',
  tip: 'TIP',
};

/* CSS 변수를 문자열로 사용 — 브라우저가 var() 를 정확히 해석함 */
const COLORS: Record<NoteBlockProps['variant'], string> = {
  info:    'var(--color-text-muted)',
  history: 'var(--color-text-subtle)',
  tip:     'var(--color-accent-dim)',
};

export function NoteBlock({ variant, markdown }: NoteBlockProps) {
  return (
    <div style={{ background: 'var(--color-overlay-soft)', border: '1px solid var(--color-bg-surface)', borderRadius: '4px', padding: '16px 20px', marginTop: '20px', marginBottom: '20px' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS[variant], marginBottom: '8px' }}>
        {LABELS[variant]}
      </p>
      <div className="ko-text" style={{ fontSize: '13.5px', lineHeight: 1.75, color: 'var(--color-text-subtle)' }}>
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ children }) => <p style={{ margin: '0 0 8px' }}>{children}</p>,
            strong: ({ children }) => <strong style={{ color: 'var(--color-text-dim)', fontWeight: 600 }}>{children}</strong>,
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
