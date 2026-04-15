import { derivativeDefinitionPage } from './pages/01-derivative-definition';
import { powerRulePage } from './pages/02-power-rule';
import { polynomialDerivativePage } from './pages/03-polynomial-derivative';
import { tangentLinePage } from './pages/04-tangent-line';
import { definiteIntegralPage } from './pages/05-definite-integral';
import { clockAnglePage } from './pages/11-clock-angle';
import { saltConcentrationPage } from './pages/12-salt-concentration';
import { calendarPatternPage } from './pages/13-calendar-pattern';
import { distanceTimePage } from './pages/14-distance-time';
import { coordinatePlanePage } from './pages/20-coordinate-plane';
import { linearFunctionPage } from './pages/21-linear-function';
import { quadraticFunctionPage } from './pages/22-quadratic-function';
import { systemOfEquationsPage } from './pages/24-system-of-equations';
import type { Page } from '@/types/content';

export type CourseId = 'elementary' | 'middle' | 'high';

export const highSchoolPages: Page[] = [
  derivativeDefinitionPage,
  powerRulePage,
  polynomialDerivativePage,
  tangentLinePage,
  definiteIntegralPage,
];

export const elementaryPages: Page[] = [
  clockAnglePage,
  saltConcentrationPage,
  calendarPatternPage,
  distanceTimePage,
];

export const middleSchoolPages: Page[] = [
  coordinatePlanePage,
  linearFunctionPage,
  quadraticFunctionPage,
  systemOfEquationsPage,
];

export const coursePages: Record<CourseId, Page[]> = {
  elementary: elementaryPages,
  middle: middleSchoolPages,
  high: highSchoolPages,
};

export const pages: Page[] = [
  ...elementaryPages,
  ...middleSchoolPages,
  ...highSchoolPages,
];

export function getCourseBySlug(slug: string): CourseId | undefined {
  return (Object.entries(coursePages) as Array<[CourseId, Page[]]>).find(([, list]) =>
    list.some((page) => page.slug === slug)
  )?.[0];
}

export function getPage(slug: string): Page | undefined {
  return pages.find((p) => p.slug === slug);
}

export function getPageIndex(slug: string): number {
  return pages.findIndex((p) => p.slug === slug);
}
