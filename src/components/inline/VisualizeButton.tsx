'use client';
import { useRouter, usePathname } from 'next/navigation';
import type { VisualizationStep } from '@/types/visualization';
import { encodeVizPayload } from '@/lib/viz-payload';

const RETURN_KEY = 'visualize_return_url';

interface VisualizeButtonProps {
  steps: VisualizationStep[];
  label?: string;
  title?: string;
}

export function VisualizeButton({ steps, label = '시각화로 보기', title }: VisualizeButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    if (steps.length === 0) return;
    try {
      const returnUrl = window.location.pathname + window.location.search + window.location.hash;
      const VALID_PREFIXES = ['/read/', '/chapters/', '/book/', '/teacher/'];
      const isValidOrigin = VALID_PREFIXES.some(p => returnUrl.startsWith(p));
      if (isValidOrigin) sessionStorage.setItem(RETURN_KEY, returnUrl);
    } catch (e) {
      console.error('[VisualizeButton] Storage access error:', e);
    }
    const payload = encodeVizPayload({ steps, returnTo: pathname ?? '/', title });
    router.push(`/visualize/${payload}`);
  };

  if (steps.length === 0) return null;

  return (
    <button
      onClick={handleClick}
      style={{
        background: 'var(--color-accent-bg)',
        border: '1px solid var(--color-accent-bg-hi)',
        borderRadius: '4px',
        cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--color-accent)',
        padding: '6px 14px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 150ms',
        letterSpacing: '0.05em',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-accent-bg-hi)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-accent-bg)';
      }}
    >
      ▶ {label}
    </button>
  );
}
