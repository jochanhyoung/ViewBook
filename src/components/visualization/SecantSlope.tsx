'use client';
import { LimitDefinition } from './LimitDefinition';

interface SecantSlopeProps {
  fn: string;
  a: number;
}

export function SecantSlope({ fn, a }: SecantSlopeProps) {
  return <LimitDefinition fn={fn} x0={a} />;
}
