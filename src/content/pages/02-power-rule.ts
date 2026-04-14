import type { Page } from '@/types/content';

export const powerRulePage: Page = {
  slug: 'power-rule',
  chapter: 'II. 미분',
  section: '2. 거듭제곱의 미분',
  number: '3.2',
  title: '거듭제곱의 미분법',
  subtitle: '지수가 계수로 내려오는 순간',

  learningObjectives: [
    { id: 'lo1', text: '거듭제곱 함수 $f(x) = x^n$의 도함수가 $f\'(x) = nx^{n-1}$임을 이해한다.' },
    { id: 'lo2', text: '이항 정리를 이용해 거듭제곱 미분 공식을 유도할 수 있다.' },
    { id: 'lo3', text: '상수 배수 법칙과 결합하여 $f(x) = ax^n$의 도함수를 구할 수 있다.' },
    { id: 'lo4', text: '음의 정수·분수 지수에도 같은 공식이 적용됨을 확인한다.' },
  ],

  blocks: [
    {
      kind: 'lead',
      markdown:
        '미분계수의 정의는 개념상 완결되어 있지만, 매번 극한 계산을 반복하는 것은 번거롭다. 수학의 힘은 반복을 패턴으로 압축하는 데 있다. $x^2$을 미분하면 $2x$, $x^3$을 미분하면 $3x^2$, $x^4$을 미분하면 $4x^3$ — 이 흐름에는 규칙이 있다. **지수가 계수로 내려오고, 지수는 1만큼 감소한다.** 이 한 문장이 거듭제곱 미분법의 전부다.',
    },
    {
      kind: 'heading',
      level: 2,
      number: '3.2.1',
      text: '공식의 유도',
      eyebrow: '거듭제곱 미분',
    },
    {
      kind: 'paragraph',
      markdown:
        '자연수 $n$에 대해 $f(x) = x^n$으로 두자. 정의에 따라 도함수를 구하면',
    },
    {
      kind: 'equation',
      latex:
        "f'(x) = \\lim_{h \\to 0} \\dfrac{(x+h)^n - x^n}{h}",
      caption: '도함수의 정의 적용',
    },
    {
      kind: 'paragraph',
      markdown:
        '이항 정리에 의해 $(x+h)^n = x^n + nx^{n-1}h + \\binom{n}{2}x^{n-2}h^2 + \\cdots + h^n$이다. 따라서',
    },
    {
      kind: 'equation',
      latex:
        "\\dfrac{(x+h)^n - x^n}{h} = nx^{n-1} + \\binom{n}{2}x^{n-2}h + \\cdots + h^{n-1}",
      caption: '$h$로 나눈 후 정리',
    },
    {
      kind: 'paragraph',
      markdown:
        '$h \\to 0$으로 보내면 $h$를 포함한 항은 모두 $0$이 되고, 첫 항 $nx^{n-1}$만 남는다.',
    },
    {
      kind: 'theorem',
      id: 'thm-power-rule',
      number: '정리 3.2',
      statement:
        '자연수 $n$에 대하여 $f(x) = x^n$이면 $f\'(x) = nx^{n-1}$이다. 이 공식은 음의 정수와 유리수 지수에도 성립한다.',
      proof:
        '**증명 (자연수).** 이항 정리로부터 $(x+h)^n = \\sum_{k=0}^{n} \\binom{n}{k}x^{n-k}h^k$이므로,\n\n$$\\dfrac{(x+h)^n - x^n}{h} = \\sum_{k=1}^{n} \\binom{n}{k} x^{n-k} h^{k-1} = nx^{n-1} + \\binom{n}{2}x^{n-2}h + \\cdots.$$\n\n$h \\to 0$에서 $h$의 양의 거듭제곱이 포함된 항들은 모두 $0$으로 수렴하므로 $f\'(x) = nx^{n-1}$. ∎',
    },

    {
      kind: 'figure',
      visualization: {
        kind: 'powerRule',
        coefficient: 3,
        exponent: 4,
      },
      caption: '그림 3.2 — $3x^4$의 미분. 지수 $4$가 계수 $3$에 곱해져 $12$가 되고, 지수는 $3$으로 감소한다.',
    },

    {
      kind: 'heading',
      level: 2,
      number: '3.2.2',
      text: '상수 배수 법칙',
      eyebrow: '선형성',
    },
    {
      kind: 'definition',
      id: 'def-constant-multiple',
      term: '상수 배수 법칙',
      body:
        '상수 $c$와 미분가능한 함수 $f(x)$에 대해 $(cf)\'(x) = c \\cdot f\'(x)$가 성립한다. 즉 상수 인수는 미분을 통과한다.',
    },
    {
      kind: 'paragraph',
      markdown:
        '거듭제곱 미분법과 상수 배수 법칙을 결합하면, $f(x) = ax^n$에 대해 $f\'(x) = anx^{n-1}$을 즉시 얻는다. 예컨대 $f(x) = 3x^4$이면 $f\'(x) = 3 \\cdot 4x^3 = 12x^3$이다.',
    },
    {
      kind: 'keyPoint',
      markdown:
        '**$(ax^n)\' = anx^{n-1}$**. 지수를 계수에 곱하고, 지수를 $1$ 줄인다. 이 한 규칙이 모든 단항식 미분을 처리한다.',
    },

    {
      kind: 'note',
      variant: 'tip',
      markdown:
        '지수가 분수인 경우, 예컨대 $f(x) = \\sqrt{x} = x^{1/2}$이면 $f\'(x) = \\dfrac{1}{2}x^{-1/2} = \\dfrac{1}{2\\sqrt{x}}$이다. 지수가 음수인 경우, $f(x) = \\dfrac{1}{x} = x^{-1}$이면 $f\'(x) = -x^{-2} = -\\dfrac{1}{x^2}$이다. 공식은 동일하게 적용된다.',
    },

    {
      kind: 'example',
      id: 'ex-2-2-1',
      number: '예제 3.2.1',
      problem:
        '다음 함수들의 도함수를 거듭제곱 미분법으로 구하시오.\n\n(1) $f(x) = x^7$ $\\qquad$ (2) $g(x) = 5x^3$ $\\qquad$ (3) $h(x) = \\dfrac{1}{2}x^6$',
      hint:
        '공식 $(ax^n)\' = anx^{n-1}$을 각 항에 적용하라. 지수를 계수에 곱하고, 지수를 1 줄인다.',
      solution:
        '**풀이.**\n\n(1) $f\'(x) = 7x^6$\n\n(2) $g\'(x) = 5 \\cdot 3x^2 = 15x^2$\n\n(3) $h\'(x) = \\dfrac{1}{2} \\cdot 6x^5 = 3x^5$',
      visualize: [
        { kind: 'powerRule', coefficient: 1, exponent: 7 },
        { kind: 'powerRule', coefficient: 5, exponent: 3 },
        { kind: 'powerRule', coefficient: 0.5, exponent: 6 },
      ],
    },
    {
      kind: 'example',
      id: 'ex-2-2-2',
      number: '예제 3.2.2',
      problem:
        '음수 및 분수 지수의 미분: $f(x) = x^{-3}$과 $g(x) = x^{2/3}$의 도함수를 구하시오.',
      hint:
        '지수가 음수이거나 분수여도 공식 $nx^{n-1}$은 그대로 적용된다. $n$에 그 값을 그대로 대입하면 된다.',
      solution:
        '**풀이.**\n\n$f\'(x) = -3x^{-4} = -\\dfrac{3}{x^4}$\n\n$g\'(x) = \\dfrac{2}{3}x^{2/3 - 1} = \\dfrac{2}{3}x^{-1/3} = \\dfrac{2}{3\\sqrt[3]{x}}$',
      visualize: [
        { kind: 'text', markdown: '지수가 음수·분수여도 공식 $(x^n)\'=nx^{n-1}$은 동일하게 적용된다.' },
        { kind: 'derivativeGraph', fnLatex: 'x^{-3}', fn: 'x^(-3)', domain: [0.6, 3] },
      ],
    },
  ],

  keyTerms: [
    { term: '거듭제곱 미분법', short: '$(x^n)\' = nx^{n-1}$. 지수를 계수로 내리고 지수를 $1$ 감소시키는 공식.' },
    { term: '상수 배수 법칙', short: '$(cf)\' = cf\'$. 상수 인수는 미분 연산을 통과한다.' },
    { term: '이항 정리', short: '$(x+h)^n$을 전개하는 공식. 거듭제곱 미분법의 증명에 사용된다.' },
    { term: '음의 지수', short: '$x^{-n} = \\dfrac{1}{x^n}$. 미분 공식은 음의 지수에도 동일하게 적용된다.' },
    { term: '분수 지수', short: '$x^{p/q} = \\sqrt[q]{x^p}$. 미분 공식은 유리수 지수에도 적용된다.' },
  ],

  exercises: [
    {
      id: 'exr-2-2-1',
      number: '연습문제 3.2.1',
      problem: '다음을 미분하시오: $f(x) = 4x^5 - 2x^{10}$',
      hints: [
        '각 항에 거듭제곱 미분법을 독립적으로 적용하라.',
        '$4x^5$를 미분하면 $20x^4$, $2x^{10}$을 미분하면 $20x^9$이다.',
      ],
      solution: '**풀이.** $f\'(x) = 4 \\cdot 5x^4 - 2 \\cdot 10x^9 = 20x^4 - 20x^9.$',
      visualize: [
        { kind: 'powerRule', coefficient: 4, exponent: 5 },
        { kind: 'powerRule', coefficient: -2, exponent: 10 },
      ],
    },
    {
      id: 'exr-2-2-2',
      number: '연습문제 3.2.2',
      problem: '$f(x) = \\sqrt[3]{x^2}$를 미분하시오.',
      hints: [
        '$\\sqrt[3]{x^2} = x^{2/3}$으로 변환하라.',
        '공식 $nx^{n-1}$에서 $n = \\dfrac{2}{3}$을 대입하라.',
      ],
      solution: '**풀이.** $f(x) = x^{2/3}$이므로 $f\'(x) = \\dfrac{2}{3}x^{-1/3} = \\dfrac{2}{3\\sqrt[3]{x}}.$',
      visualize: [
        { kind: 'text', markdown: '$\\sqrt[3]{x^2} = x^{2/3}$으로 변환한 뒤 거듭제곱 미분법을 적용한다.' },
        { kind: 'derivativeGraph', fnLatex: 'x^{2/3}', fn: 'x^(2/3)', domain: [-2, 2] },
      ],
    },
    {
      id: 'exr-2-2-3',
      number: '연습문제 3.2.3',
      problem: '$x = 2$에서 $f(x) = 3x^4$의 미분계수를 구하시오.',
      hints: [
        '먼저 $f\'(x)$를 거듭제곱 미분법으로 구하라.',
        '$f\'(x) = 12x^3$이다. 여기에 $x = 2$를 대입하라.',
      ],
      solution: '**풀이.** $f\'(x) = 12x^3$이므로 $f\'(2) = 12 \\cdot 2^3 = 12 \\cdot 8 = \\mathbf{96}.$',
      visualize: [
        { kind: 'powerRule', coefficient: 3, exponent: 4 },
        { kind: 'tangentLine', fn: '3*x^4', x0: 2, domain: [0, 2.5] },
      ],
    },
  ],
};
