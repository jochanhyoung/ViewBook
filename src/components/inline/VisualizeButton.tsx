'use client';
import { useRouter, usePathname } from 'next/navigation';
import type { VisualizationStep } from '@/types/visualization';
import { encodeVizPayload } from '@/lib/viz-payload';

const RETURN_KEY = 'visualize_return_url';

interface VisualizeButtonProps {
  steps: VisualizationStep[];
  label?: string;
}

export function VisualizeButton({ steps, label = '시각화로 보기' }: VisualizeButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    if (steps.length === 0) return;

    // Store the full current URL (pathname + ?sheet=N) so the visualize page
    // can return to exactly the same sheet.
    try {
      const returnUrl = window.location.pathname + window.location.search + window.location.hash;

      const VALID_PREFIXES = ['/read/', '/chapters/', '/book/', '/teacher/'];
      const isValidOrigin = VALID_PREFIXES.some(p => returnUrl.startsWith(p));
      if (isValidOrigin) {
        sessionStorage.setItem(RETURN_KEY, returnUrl);
      }
    } catch (e) {
      console.error('[VisualizeButton] Storage access error:', e);
    }

    const payload = encodeVizPayload({ steps, returnTo: pathname ?? '/' });
    router.push(`/visualize/${payload}`);
  };

  if (steps.length === 0) return null;

  return (
    <button
      onClick={handleClick}
      style={{
        background: 'rgba(212, 255, 79, 0.1)',
        border: '1px solid rgba(212, 255, 79, 0.3)',
        borderRadius: '4px',
        cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: '#d4ff4f',
        padding: '6px 14px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 150ms',
        letterSpacing: '0.05em',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212, 255, 79, 0.18)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212, 255, 79, 0.1)';
      }}
    >
      ▶ {label}
    </button>
  );
}
