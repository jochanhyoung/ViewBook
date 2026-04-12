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

const COLORS: Record<NoteBlockProps['variant'], string> = {
  info: '#5a5a66',
  history: '#8a8a96',
  tip: '#8aa82d',
};

export function NoteBlock({ variant, markdown }: NoteBlockProps) {
  return (
    <div
      style={{
        background: 'rgba(26,26,31,0.4)',
        border: '1px solid #1a1a1f',
        borderRadius: '4px',
        padding: '16px 20px',
        marginTop: '20px',
        marginBottom: '20px',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: COLORS[variant],
          marginBottom: '8px',
        }}
      >
        {LABELS[variant]}
      </p>
      <div
        className="ko-text"
        style={{
          fontSize: '13.5px',
          lineHeight: 1.75,
          color: '#8a8a96',
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ children }) => <p style={{ margin: '0 0 8px' }}>{children}</p>,
            strong: ({ children }) => (
              <strong style={{ color: '#b8b8c0', fontWeight: 600 }}>{children}</strong>
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
