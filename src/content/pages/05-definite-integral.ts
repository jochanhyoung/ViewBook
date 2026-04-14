import type { Page } from '@/types/content';

export const definiteIntegralPage: Page = {
  slug: 'definite-integral',
  chapter: 'III. 적분',
  section: '1. 정적분과 넓이',
  number: '3.5',
  title: '정적분과 넓이',
  subtitle: '리만합이 수렴하는 극한',

  learningObjectives: [
    { id: 'lo1', text: '리만합의 개념과 구성 방법(왼쪽, 오른쪽, 중점)을 이해한다.' },
    { id: 'lo2', text: '$n \\to \\infty$일 때 리만합이 정적분으로 수렴함을 기하학적으로 확인한다.' },
    { id: 'lo3', text: '정적분의 기본 성질(선형성, 구간 분할)을 적용할 수 있다.' },
    { id: 'lo4', text: '미적분학의 기본 정리를 이용해 정적분을 계산할 수 있다.' },
  ],

  blocks: [
    {
      kind: 'lead',
      markdown:
        '면적을 계산하는 가장 자연스러운 방법은 직사각형으로 근사하는 것이다. 구불구불한 곡선 아래를 가느다란 직사각형들로 채우고, 직사각형을 점점 더 얇고 많이 늘려 가면, 그 넓이의 합이 어떤 수로 수렴한다. 이 수렴값이 **정적분**이다. 리만이 정리한 이 아이디어는, 미분이 순간을 포착하듯 적분이 연속된 누적을 포착하는 방법이다. 그리고 이 두 개념은 미적분학의 기본 정리라는 다리로 연결되어 있다.',
    },
    {
      kind: 'heading',
      level: 2,
      number: '3.5.1',
      text: '리만합',
      eyebrow: '근사에서 극한으로',
    },
    {
      kind: 'definition',
      id: 'def-riemann-sum',
      term: '리만합',
      body:
        '구간 $[a, b]$를 $n$등분하여 각 소구간의 너비를 $\\Delta x = \\dfrac{b-a}{n}$이라 하자. 각 소구간에서 대표점 $x_i^*$를 고를 때, **리만합**은\n$$R_n = \\sum_{i=1}^{n} f(x_i^*) \\Delta x$$\n으로 정의한다. 대표점 선택에 따라 왼쪽 리만합, 오른쪽 리만합, 중점 리만합이 있다.',
    },
    {
      kind: 'paragraph',
      markdown:
        '$n$이 커질수록 각 직사각형의 너비 $\\Delta x$는 $0$에 가까워지고, 리만합은 곡선 아래의 넓이에 더 가까워진다. 이 극한이 존재하면, 그것을 $f(x)$의 $[a, b]$에서의 **정적분**이라 한다.',
    },
    {
      kind: 'figure',
      visualization: {
        kind: 'riemannSum',
        fn: 'x^2',
        a: 0,
        b: 2,
        n: 8,
        method: 'right',
      },
      caption: '그림 3.5 — $f(x) = x^2$, $[0, 2]$에서의 오른쪽 리만합. $n$을 키울수록 정확해진다.',
    },

    {
      kind: 'definition',
      id: 'def-definite-integral',
      term: '정적분',
      body:
        '함수 $f(x)$가 구간 $[a, b]$에서 연속이면, 리만합의 극한\n$$\\int_a^b f(x)\\,dx = \\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i^*) \\Delta x$$\n이 존재하고 대표점의 선택에 무관하다. 이 값을 $f(x)$의 $a$에서 $b$까지의 **정적분**이라 한다.',
    },
    {
      kind: 'heading',
      level: 2,
      number: '3.5.2',
      text: '정적분의 기본 성질',
      eyebrow: '선형성과 구간',
    },
    {
      kind: 'theorem',
      id: 'thm-integral-properties',
      number: '정리 3.5',
      statement:
        '$f$와 $g$가 $[a, b]$에서 연속이고 $c$는 상수일 때:\n\n(1) $\\int_a^b cf(x)\\,dx = c\\int_a^b f(x)\\,dx$\n\n(2) $\\int_a^b [f(x) \\pm g(x)]\\,dx = \\int_a^b f(x)\\,dx \\pm \\int_a^b g(x)\\,dx$\n\n(3) $\\int_a^b f(x)\\,dx = \\int_a^c f(x)\\,dx + \\int_c^b f(x)\\,dx$\n\n(4) $\\int_a^a f(x)\\,dx = 0$\n\n(5) $\\int_a^b f(x)\\,dx = -\\int_b^a f(x)\\,dx$',
      proof:
        '**증명 (1).** 리만합의 정의에서 $\\sum_{i=1}^n cf(x_i^*) \\Delta x = c \\sum_{i=1}^n f(x_i^*) \\Delta x.$ $n \\to \\infty$의 극한을 취하면 (1)이 성립한다. (2)~(5)도 유사하게 리만합의 성질에서 유도된다. ∎',
    },
    {
      kind: 'heading',
      level: 2,
      number: '3.5.3',
      text: '미적분학의 기본 정리',
      eyebrow: '미분과 적분의 연결',
    },
    {
      kind: 'theorem',
      id: 'thm-ftc',
      number: '정리 3.6 (미적분학의 기본 정리)',
      statement:
        '$f$가 $[a, b]$에서 연속이고 $F$가 $f$의 임의의 역도함수(원시함수), 즉 $F\'(x) = f(x)$이면,\n$$\\int_a^b f(x)\\,dx = F(b) - F(a) = [F(x)]_a^b.$$',
      proof:
        '**증명 (스케치).** $G(x) = \\int_a^x f(t)\\,dt$로 정의하면 $G\'(x) = f(x)$임을 보일 수 있다 (이를 미적분학의 기본 정리 1부라 한다). 따라서 $G(x) = F(x) + C$인 상수 $C$가 존재한다. $G(a) = 0$이므로 $C = -F(a)$, 즉 $G(x) = F(x) - F(a)$. $x = b$를 대입하면 $\\int_a^b f(t)\\,dt = G(b) = F(b) - F(a)$. ∎',
    },
    {
      kind: 'keyPoint',
      markdown:
        '**미분의 역이 적분이다.** 미적분학의 기본 정리는 이 두 연산이 서로 역 관계에 있음을 공식화한다. 어떤 함수의 역도함수(부정적분)를 알면, 정적분을 단 두 번의 대입으로 계산할 수 있다.',
    },
    {
      kind: 'note',
      variant: 'history',
      markdown:
        '리만합의 체계적 정의는 베른하르트 리만(1826~1866)이 제시했지만, 실질적인 적분의 개념과 기본 정리는 뉴턴과 라이프니츠에 의해 17세기에 이미 파악되었다. 리만의 공헌은 적분 가능성의 조건을 엄밀하게 정의한 데 있다.',
    },

    {
      kind: 'example',
      id: 'ex-3-1-1',
      number: '예제 3.5.1',
      problem:
        '정적분 $\\displaystyle\\int_0^1 x^2\\,dx$를 미적분학의 기본 정리를 이용해 계산하시오.',
      hint:
        '$x^2$의 역도함수는 $\\dfrac{x^3}{3}$이다. $[F(x)]_0^1 = F(1) - F(0)$을 계산하라.',
      solution:
        '**풀이.** $F(x) = \\dfrac{x^3}{3}$으로 놓으면 $F\'(x) = x^2$이다.\n\n$$\\int_0^1 x^2\\,dx = \\left[\\dfrac{x^3}{3}\\right]_0^1 = \\dfrac{1}{3} - 0 = \\dfrac{1}{3}.$$',
      visualize: [
        { kind: 'riemannSum', fn: 'x^2', a: 0, b: 1, n: 16, method: 'right' },
        { kind: 'definiteIntegral', fn: 'x^2', a: 0, b: 1 },
      ],
    },
    {
      kind: 'example',
      id: 'ex-3-1-2',
      number: '예제 3.5.2',
      problem:
        '정적분 $\\displaystyle\\int_1^2 (2x + 1)\\,dx$를 계산하시오.',
      hint:
        '합의 미분법의 역: $(2x + 1)$의 역도함수는 $x^2 + x$이다.',
      solution:
        '**풀이.** $F(x) = x^2 + x$로 놓으면\n\n$$\\int_1^2 (2x+1)\\,dx = [x^2 + x]_1^2 = (4 + 2) - (1 + 1) = 6 - 2 = 4.$$',
      visualize: [
        { kind: 'definiteIntegral', fn: '2*x + 1', a: 1, b: 2 },
      ],
    },
  ],

  keyTerms: [
    { term: '리만합', short: '$\\sum_{i=1}^{n} f(x_i^*)\\Delta x$. 곡선 아래를 직사각형으로 근사하는 합.' },
    { term: '정적분', short: '$\\int_a^b f(x)\\,dx$. 리만합의 $n \\to \\infty$ 극한. 곡선 아래의 (부호 있는) 넓이.' },
    { term: '역도함수', short: '$F\'(x) = f(x)$를 만족하는 함수 $F(x)$. 부정적분이라고도 한다.' },
    { term: '미적분학의 기본 정리', short: '$\\int_a^b f(x)\\,dx = F(b) - F(a)$. 미분과 적분을 연결하는 핵심 정리.' },
    { term: '부호 있는 넓이', short: '$x$축 아래에 있는 부분은 정적분에서 음수로 계산된다.' },
  ],

  exercises: [
    {
      id: 'exr-3-1-1',
      number: '연습문제 3.5.1',
      problem: '$\\displaystyle\\int_0^2 (x^3 - x)\\,dx$를 계산하시오.',
      hints: [
        '$x^3 - x$의 역도함수 $F(x) = \\dfrac{x^4}{4} - \\dfrac{x^2}{2}$를 구하라.',
        '$F(2) - F(0) = (4 - 2) - 0 = 2$를 계산하라.',
      ],
      solution:
        '**풀이.** $\\displaystyle\\int_0^2 (x^3-x)\\,dx = \\left[\\dfrac{x^4}{4} - \\dfrac{x^2}{2}\\right]_0^2 = (4 - 2) - 0 = 2.$',
      visualize: [
        { kind: 'definiteIntegral', fn: 'x^3 - x', a: 0, b: 2 },
      ],
    },
    {
      id: 'exr-3-1-2',
      number: '연습문제 3.5.2',
      problem: '$n = 4$인 오른쪽 리만합으로 $\\displaystyle\\int_0^2 x^2\\,dx$를 근사하고, 실제값과 비교하시오.',
      hints: [
        '$\\Delta x = 0.5$이고 대표점은 $x_1 = 0.5, x_2 = 1.0, x_3 = 1.5, x_4 = 2.0$이다.',
        '각 $f(x_i) = x_i^2$를 계산해 $R_4 = \\sum f(x_i) \\cdot 0.5$를 구하라.',
      ],
      solution:
        '**풀이.** $R_4 = (0.25 + 1 + 2.25 + 4) \\cdot 0.5 = 7.5 \\cdot 0.5 = 3.75.$ 실제값: $\\int_0^2 x^2\\,dx = \\left[\\dfrac{x^3}{3}\\right]_0^2 = \\dfrac{8}{3} \\approx 2.667.$ 오른쪽 리만합이 실제값보다 크다 (위로 볼록한 함수에서 오른쪽 합은 과대 추정).',
      visualize: [
        { kind: 'riemannSum', fn: 'x^2', a: 0, b: 2, n: 4, method: 'right' },
        { kind: 'riemannSum', fn: 'x^2', a: 0, b: 2, n: 64, method: 'right' },
      ],
    },
    {
      id: 'exr-3-1-3',
      number: '연습문제 3.5.3',
      problem: '$\\displaystyle\\int_{-1}^{2} (3x^2 - 2x + 1)\\,dx$를 계산하시오.',
      hints: [
        '역도함수 $F(x) = x^3 - x^2 + x$를 구하라.',
        '$F(2) - F(-1) = (8 - 4 + 2) - (-1 - 1 - 1)$을 계산하라.',
      ],
      solution:
        '**풀이.** $F(x) = x^3 - x^2 + x.$ $F(2) = 8 - 4 + 2 = 6.$ $F(-1) = -1 - 1 - 1 = -3.$ $\\int_{-1}^{2} (3x^2-2x+1)\\,dx = 6 - (-3) = \\mathbf{9}.$',
      visualize: [
        { kind: 'definiteIntegral', fn: '3*x^2 - 2*x + 1', a: -1, b: 2 },
      ],
    },
  ],
};
