import type { Page } from '@/types/content';

export const polynomialDerivativePage: Page = {
  slug: 'polynomial-derivative',
  chapter: 'II. 미분',
  section: '3. 다항함수의 도함수',
  number: '3.3',
  title: '다항함수의 도함수',
  subtitle: '원함수와 도함수의 동기화',

  learningObjectives: [
    { id: 'lo1', text: '합의 미분법으로 다항함수 전체를 한 번에 미분할 수 있다.' },
    { id: 'lo2', text: '도함수의 그래프에서 원함수의 증감을 읽어낼 수 있다.' },
    { id: 'lo3', text: '이계도함수 $f\'\'(x)$의 의미와 오목·볼록의 관계를 이해한다.' },
    { id: 'lo4', text: '극값의 조건을 도함수를 이용해 판별할 수 있다.' },
  ],

  blocks: [
    {
      kind: 'lead',
      markdown:
        '단항식 하나를 미분하는 법을 알았다면, 다항식 전체를 미분하는 것은 쉽다. 덧셈은 미분을 통과한다 — 각 항을 따로 미분하고 더하면 된다. 그런데 이 단순한 사실이 놀라운 그림을 만들어낸다. 함수의 그래프와 그 도함수의 그래프를 나란히 놓으면, 원함수가 올라가는 구간에서 도함수는 양수, 극값에서 도함수는 정확히 $0$, 내려가는 구간에서 도함수는 음수다. **두 그래프는 같은 리듬으로 춤을 춘다.**',
    },
    {
      kind: 'heading',
      level: 2,
      number: '3.3.1',
      text: '합과 차의 미분법',
      eyebrow: '선형성',
    },
    {
      kind: 'theorem',
      id: 'thm-sum-rule',
      number: '정리 3.3',
      statement:
        '두 함수 $f(x)$, $g(x)$가 $x$에서 미분가능하면,\n$$[f(x) \\pm g(x)]\' = f\'(x) \\pm g\'(x)$$\n가 성립한다.',
      proof:
        '**증명.** $\\lim_{h \\to 0} \\dfrac{[f(x+h) \\pm g(x+h)] - [f(x) \\pm g(x)]}{h}$\n$= \\lim_{h \\to 0} \\dfrac{f(x+h) - f(x)}{h} \\pm \\lim_{h \\to 0} \\dfrac{g(x+h) - g(x)}{h}$\n$= f\'(x) \\pm g\'(x).$ ∎',
    },
    {
      kind: 'paragraph',
      markdown:
        '합의 미분법과 상수 배수 법칙을 결합하면, 다항함수 $f(x) = a_n x^n + a_{n-1}x^{n-1} + \\cdots + a_1 x + a_0$의 도함수를 항별로 구할 수 있다.',
    },
    {
      kind: 'equation',
      latex:
        "f'(x) = na_nx^{n-1} + (n-1)a_{n-1}x^{n-2} + \\cdots + a_1",
      caption: '다항함수 도함수의 일반식',
    },

    {
      kind: 'heading',
      level: 2,
      number: '3.3.2',
      text: '원함수와 도함수의 동기화',
      eyebrow: '그래프 해석',
    },
    {
      kind: 'figure',
      visualization: {
        kind: 'derivativeGraph',
        fnLatex: 'x^3 - 3x',
        fn: 'x^3 - 3*x',
        domain: [-2.5, 2.5],
      },
      caption: '그림 3.3 — $f(x) = x^3 - 3x$와 $f\'(x) = 3x^2 - 3$. 수직선이 두 그래프를 동기화한다.',
    },
    {
      kind: 'definition',
      id: 'def-increasing-decreasing',
      term: '증가·감소와 도함수',
      body:
        '미분가능한 함수 $f(x)$에 대해 구간 $(a, b)$에서 $f\'(x) > 0$이면 $f$는 그 구간에서 순증가하고, $f\'(x) < 0$이면 순감소한다. $f\'(c) = 0$인 점 $c$를 **임계점**이라 한다.',
    },
    {
      kind: 'paragraph',
      markdown:
        '임계점에서 극값이 발생할 수 있다. $f\'(c) = 0$이고 $c$ 주변에서 $f\'$의 부호가 양에서 음으로 바뀌면 **극대**, 음에서 양으로 바뀌면 **극소**다. 이를 **1계 도함수 판정법**이라 한다.',
    },
    {
      kind: 'keyPoint',
      markdown:
        '도함수는 원함수의 **기울기 지도**다. $f\'(x) = 0$인 곳에서 원함수의 기울기는 수평이 되고, 그 직전·직후의 부호가 극값의 종류를 결정한다.',
    },

    {
      kind: 'heading',
      level: 2,
      number: '3.3.3',
      text: '이계도함수와 오목·볼록',
      eyebrow: '곡률',
    },
    {
      kind: 'definition',
      id: 'def-second-derivative',
      term: '이계도함수',
      body:
        '$f\'(x)$를 다시 한 번 미분한 함수를 **이계도함수** $f\'\'(x)$라 한다. $f\'\'(x) > 0$인 구간에서 그래프는 위로 볼록(오목), $f\'\'(x) < 0$인 구간에서는 아래로 볼록(볼록)이다.',
    },
    {
      kind: 'note',
      variant: 'tip',
      markdown:
        '극값 판정에 이계도함수를 쓸 수도 있다. $f\'(c) = 0$이고 $f\'\'(c) > 0$이면 극소, $f\'\'(c) < 0$이면 극대다. 단 $f\'\'(c) = 0$이면 이 판정법으로 결론 내릴 수 없다.',
    },

    {
      kind: 'interactiveInline',
      component: 'functionPlayground',
      props: { initialFn: 'x^3 - 3*x', domain: [-3, 3] },
    },

    {
      kind: 'example',
      id: 'ex-2-3-1',
      number: '예제 3.3.1',
      problem:
        '$f(x) = x^3 - 3x$의 도함수를 구하고, 극값과 증감 구간을 조사하시오.',
      hint:
        '$f\'(x) = 3x^2 - 3 = 3(x-1)(x+1)$이다. $f\'(x) = 0$의 근을 구하고, 각 구간에서 $f\'(x)$의 부호를 판단하라.',
      solution:
        '**풀이.** $f\'(x) = 3x^2 - 3 = 3(x-1)(x+1).$\n\n$f\'(x) = 0$의 해: $x = -1, 1.$\n\n부호 분석:\n- $x < -1$: $f\'(x) > 0$ (증가)\n- $-1 < x < 1$: $f\'(x) < 0$ (감소)\n- $x > 1$: $f\'(x) > 0$ (증가)\n\n$x = -1$: **극대**, $f(-1) = 2$\n\n$x = 1$: **극소**, $f(1) = -2$',
      visualize: [
        { kind: 'derivativeGraph', fnLatex: 'x^3 - 3x', fn: 'x^3 - 3*x', domain: [-2.5, 2.5] },
      ],
    },
    {
      kind: 'example',
      id: 'ex-2-3-2',
      number: '예제 3.3.2',
      problem:
        '$f(x) = 2x^3 - 6x^2 + 1$의 도함수를 구하고, 이계도함수를 이용해 $x = 2$에서의 극값 여부를 판별하시오.',
      hint:
        '$f\'(x)$를 구한 후 임계점을 찾고, $f\'\'(x)$를 계산해 각 임계점에서의 오목·볼록을 판단하라.',
      solution:
        '**풀이.** $f\'(x) = 6x^2 - 12x = 6x(x-2).$ 임계점: $x = 0, 2.$\n\n$f\'\'(x) = 12x - 12.$\n\n$f\'\'(0) = -12 < 0 \\Rightarrow x = 0$에서 **극대**, $f(0) = 1.$\n\n$f\'\'(2) = 12 > 0 \\Rightarrow x = 2$에서 **극소**, $f(2) = 2(8) - 6(4) + 1 = -7.$',
      visualize: [
        { kind: 'derivativeGraph', fnLatex: '2x^3 - 6x^2 + 1', fn: '2*x^3 - 6*x^2 + 1', domain: [-1, 3.5] },
      ],
    },
  ],

  keyTerms: [
    { term: '합의 미분법', short: '$[f \\pm g]\' = f\' \\pm g\'$. 덧셈과 뺄셈은 미분 연산을 통과한다.' },
    { term: '임계점', short: '$f\'(c) = 0$인 점 $c$. 극값이 발생할 수 있는 후보 지점이다.' },
    { term: '극대·극소', short: '주변보다 크면 극대, 작으면 극소. 도함수의 부호 변화로 판별한다.' },
    { term: '이계도함수', short: '$f\'\'(x) = (f\'(x))\'$. 오목·볼록과 변곡점을 결정한다.' },
    { term: '1계 도함수 판정법', short: '임계점 주변에서 $f\'$의 부호 변화로 극대·극소를 판별하는 방법.' },
  ],

  exercises: [
    {
      id: 'exr-2-3-1',
      number: '연습문제 3.3.1',
      problem: '$f(x) = x^4 - 4x^3$의 도함수를 구하고, 극값을 찾으시오.',
      hints: [
        '$f\'(x) = 4x^3 - 12x^2 = 4x^2(x-3)$임을 확인하라.',
        '$f\'(x) = 0$의 해 $x = 0, 3$에서 도함수의 부호 변화를 조사하라. $x = 0$ 근방에서 부호가 변하는지 주의 깊게 살피라.',
      ],
      solution:
        '**풀이.** $f\'(x) = 4x^3 - 12x^2 = 4x^2(x-3).$ $x = 0$에서는 $f\'$의 부호가 변하지 않아 **극값 없음**. $x = 3$에서 $f\'$가 $-$에서 $+$로 변하므로 **극소**, $f(3) = 81 - 108 = -27.$',
      visualize: [
        { kind: 'derivativeGraph', fnLatex: 'x^4 - 4x^3', fn: 'x^4 - 4*x^3', domain: [-1, 4.5] },
      ],
    },
    {
      id: 'exr-2-3-2',
      number: '연습문제 3.3.2',
      problem: '$f(x) = x^3 - 6x^2 + 9x - 2$의 모든 극값을 구하시오.',
      hints: [
        '$f\'(x) = 3x^2 - 12x + 9 = 3(x-1)(x-3)$.',
        '$x = 1$에서 극대, $x = 3$에서 극소가 발생한다. 각각의 함숫값을 계산하라.',
      ],
      solution:
        '**풀이.** $f\'(x) = 3(x-1)(x-3).$ $x = 1$: 극대, $f(1) = 1 - 6 + 9 - 2 = 2.$ $x = 3$: 극소, $f(3) = 27 - 54 + 27 - 2 = -2.$',
      visualize: [
        { kind: 'derivativeGraph', fnLatex: 'x^3 - 6x^2 + 9x - 2', fn: 'x^3 - 6*x^2 + 9*x - 2', domain: [-0.5, 4.5] },
      ],
    },
    {
      id: 'exr-2-3-3',
      number: '연습문제 3.3.3',
      problem: '$f(x) = x^3 - 3x + 2$의 이계도함수를 구하고, 변곡점을 구하시오.',
      hints: [
        '$f\'(x) = 3x^2 - 3$, $f\'\'(x) = 6x$임을 확인하라.',
        '$f\'\'(x) = 0$의 해 $x = 0$에서 $f\'\'$의 부호가 바뀌면 변곡점이다.',
      ],
      solution:
        '**풀이.** $f\'\'(x) = 6x.$ $x < 0$에서 $f\'\'(x) < 0$ (위로 볼록), $x > 0$에서 $f\'\'(x) > 0$ (아래로 볼록). 따라서 변곡점은 $(0, f(0)) = (0, 2)$이다.',
      visualize: [
        { kind: 'derivativeGraph', fnLatex: 'x^3 - 3x + 2', fn: 'x^3 - 3*x + 2', domain: [-2.5, 2.5] },
      ],
    },
  ],
};
