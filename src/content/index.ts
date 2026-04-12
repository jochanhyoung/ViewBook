import { derivativeDefinitionPage } from './pages/01-derivative-definition';
import { powerRulePage } from './pages/02-power-rule';
import { polynomialDerivativePage } from './pages/03-polynomial-derivative';
import { tangentLinePage } from './pages/04-tangent-line';
import { definiteIntegralPage } from './pages/05-definite-integral';
import type { Page } from '@/types/content';

export const pages: Page[] = [
  derivativeDefinitionPage,
  powerRulePage,
  polynomialDerivativePage,
  tangentLinePage,
  definiteIntegralPage,
];

export function getPage(slug: string): Page | undefined {
  return pages.find((p) => p.slug === slug);
}

export function getPageIndex(slug: string): number {
  return pages.findIndex((p) => p.slug === slug);
}
