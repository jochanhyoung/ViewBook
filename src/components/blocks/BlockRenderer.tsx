'use client';
import type { Block } from '@/types/content';
import { LeadBlock } from './LeadBlock';
import { HeadingBlock } from './HeadingBlock';
import { ParagraphBlock } from './ParagraphBlock';
import { DefinitionBlock } from './DefinitionBlock';
import { TheoremBlock } from './TheoremBlock';
import { EquationBlock } from './EquationBlock';
import { KeyPointBlock } from './KeyPointBlock';
import { ExampleBlock } from './ExampleBlock';
import { FigureBlock } from './FigureBlock';
import { NoteBlock } from './NoteBlock';
import { FunctionPlayground } from '@/components/visualization/FunctionPlayground';

interface BlockRendererProps {
  blocks: Block[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {blocks.map((block, i) => (
        <BlockItem key={i} block={block} />
      ))}
    </div>
  );
}

function BlockItem({ block }: { block: Block }) {
  switch (block.kind) {
    case 'lead':
      return <LeadBlock markdown={block.markdown} />;
    case 'heading':
      return <HeadingBlock {...block} />;
    case 'paragraph':
      return <ParagraphBlock markdown={block.markdown} />;
    case 'definition':
      return <DefinitionBlock {...block} />;
    case 'theorem':
      return <TheoremBlock {...block} />;
    case 'equation':
      return <EquationBlock {...block} />;
    case 'keyPoint':
      return <KeyPointBlock markdown={block.markdown} />;
    case 'example':
      return <ExampleBlock {...block} />;
    case 'figure':
      return <FigureBlock {...block} />;
    case 'note':
      return <NoteBlock {...block} />;
    case 'interactiveInline':
      if (block.component === 'functionPlayground') {
        const { initialFn = 'x^2', domain = [-3, 3] } = block.props as { initialFn?: string; domain?: [number, number] };
        return (
          <div style={{ marginTop: '24px', marginBottom: '24px', border: '1px solid #1a1a1f', borderRadius: '6px', overflow: 'hidden', minHeight: '420px' }}>
            <div style={{ background: '#111114', borderBottom: '1px solid #1a1a1f', padding: '8px 16px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6a8fff' }}>
                함수 탐구
              </span>
            </div>
            <FunctionPlayground initialFn={initialFn} domain={domain} />
          </div>
        );
      }
      return null;
    default:
      return null;
  }
}
