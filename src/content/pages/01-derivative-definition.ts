import type { Page } from '@/types/content';

export const derivativeDefinitionPage: Page = {
  slug: 'derivative-definition',
  chapter: 'II. 미분',
  section: '1. 미분계수와 도함수',
  number: '2.1',
  title: '미분의 정의',
  subtitle: '할선이 접선이 되는 순간',

  learningObjectives: [
    { id: 'lo1', text: '평균변화율의 의미를 그래프의 할선의 기울기와 연결하여 설명할 수 있다.' },
    { id: 'lo2', text: '구간을 한없이 좁히는 극한으로 순간변화율을 정의할 수 있다.' },
    { id: 'lo3', text: '함수 $f(x)$의 $x=a$에서의 미분계수 $f\'(a)$를 극한의 언어로 쓸 수 있다.' },
    { id: 'lo4', text: '미분가능성이 연속성을 함의하지만 그 역은 성립하지 않음을 이해한다.' },
    { id: 'lo5', text: '간단한 이차함수의 미분계수를 정의에 따라 직접 계산할 수 있다.' },
  ],

  blocks: [
    {
      kind: 'lead',
      markdown:
        '시속 60km로 서울에서 대전까지 달렸다고 해서, 여행 내내 속도계의 바늘이 60에 붙어 있었던 것은 아니다. 신호에 걸려 멈추었을 때는 0이었고, 고속도로에선 100을 넘기기도 했다. 우리가 "평균 속도"라고 부르는 수는 전체 거리를 전체 시간으로 나눈 값일 뿐, 어느 한 순간의 진짜 속도를 말해 주지는 않는다. 그렇다면 **"지금 이 순간의 속도"**는 어떻게 정의할 수 있을까. 이 질문에서 미분이 태어났다.',
    },
    {
      kind: 'paragraph',
      markdown:
        '달리는 차의 위치를 시간 $t$의 함수 $s(t)$로 두자. 시각 $a$에서 시각 $a+h$까지 $h$초 동안 움직인 거리는 $s(a+h) - s(a)$이다. 이 구간의 **평균 속도**는 거리를 시간으로 나눈 값, 즉',
    },
    {
      kind: 'equation',
      latex: '\\dfrac{s(a+h) - s(a)}{h}',
      caption: '시각 $a$에서 $a+h$까지의 평균변화율',
    },
    {
      kind: 'paragraph',
      markdown:
        '이다. 이 값을 함수 $s$의 그래프 위에서 해석해 보면, 두 점 $(a,\\, s(a))$와 $(a+h,\\, s(a+h))$를 잇는 **할선**의 기울기와 정확히 같다. 평균 속도는 곧 할선의 기울기인 것이다.',
    },

    {
      kind: 'definition',
      id: 'def-average-rate',
      term: '평균변화율',
      body:
        '함수 $y = f(x)$가 구간 $[a,\\, a+h]$에서 정의되어 있을 때, 이 구간에서의 **평균변화율**은 $x$의 증가량 $h$에 대한 $y$의 증가량의 비 $\\dfrac{f(a+h) - f(a)}{h}$로 정의한다. 이 값은 두 점 $(a, f(a))$와 $(a+h, f(a+h))$를 잇는 할선의 기울기와 같다.',
    },
    {
      kind: 'figure',
      visualization: {
        kind: 'limitDefinition',
        fn: 'x^2',
        x0: 1,
      },
      caption: '그림 2.1 — $f(x)=x^2$에서 $h=1$일 때, 두 점 $A(1,1)$과 $B(2,4)$를 잇는 할선의 기울기 $\\dfrac{\\Delta y}{\\Delta x} = \\dfrac{3}{1} = 3$이 바로 이 구간의 평균변화율이다. 슬라이더로 $h$를 줄여 보면 할선이 점점 접선에 가까워진다.',
    },
    {
      kind: 'paragraph',
      markdown:
        '이제 "지금 이 순간"이라는 말의 수학적 의미를 만들어 보자. 우리가 원하는 것은 $h$가 아주 작을 때의 평균 속도다. 그러나 $h = 0$을 그대로 대입하면 $\\dfrac{0}{0}$이 되어 버린다. 대신 $h$를 $0$이 **아닌 채로** 한없이 $0$에 가까이 보내고, 그때 평균변화율이 어떤 수로 수렴하는지를 본다. 이 극한이 존재한다면, 그 값을 $x = a$에서의 **순간변화율**이라 부른다.',
    },

    {
      kind: 'definition',
      id: 'def-derivative-coefficient',
      term: '미분계수',
      body:
        '함수 $y = f(x)$의 $x = a$에서의 **미분계수**를 $f\'(a)$로 쓰고, 극한 $f\'(a) = \\displaystyle\\lim_{h \\to 0} \\dfrac{f(a+h) - f(a)}{h}$로 정의한다. 이 극한이 존재할 때 $f$는 $x = a$에서 **미분가능하다**고 말하며, $f\'(a)$는 $x = a$에서의 순간변화율, 즉 그래프 위의 점 $(a, f(a))$에서 그은 접선의 기울기와 같다.',
    },
    {
      kind: 'keyPoint',
      markdown:
        '**할선 → 접선**. 두 점을 잇던 할선이, 한 점이 다른 점에 한없이 가까워질 때 그 극한 위치에 놓이는 직선이 바로 접선이다. 미분은 이 "한없이 가까워진다"는 기하학적 직관을 극한의 언어로 옮긴 것이다.',
    },

    {
      kind: 'theorem',
      id: 'thm-diff-implies-cont',
      number: '정리 2.1',
      statement:
        '함수 $f(x)$가 $x = a$에서 미분가능하면, $f(x)$는 $x = a$에서 연속이다. 그러나 그 역은 성립하지 않는다 — 연속이지만 미분불가능한 점이 존재한다.',
      proof:
        '**증명.** $f$가 $x=a$에서 미분가능하다고 하자. 이는 극한 $\\lim_{h \\to 0} \\dfrac{f(a+h) - f(a)}{h} = f\'(a)$ 가 존재한다는 뜻이다. 이제 $\\lim_{h \\to 0} (f(a+h) - f(a))$를 다음과 같이 변형한다:\n\n$$\\lim_{h \\to 0} (f(a+h) - f(a)) = \\lim_{h \\to 0} \\left( \\dfrac{f(a+h) - f(a)}{h} \\cdot h \\right) = f\'(a) \\cdot 0 = 0.$$\n\n따라서 $\\lim_{h \\to 0} f(a+h) = f(a)$가 성립하고, 이는 곧 $f$가 $x = a$에서 연속임을 의미한다. ∎\n\n역이 성립하지 않는 대표적인 예는 $f(x) = |x|$이다. 이 함수는 $x = 0$에서 연속이지만, 좌극한 $\\lim_{h \\to 0^-} \\dfrac{|h|}{h} = -1$과 우극한 $\\lim_{h \\to 0^+} \\dfrac{|h|}{h} = 1$이 일치하지 않으므로 미분계수가 존재하지 않는다.',
    },

    {
      kind: 'note',
      variant: 'history',
      markdown:
        '미분의 아이디어는 17세기 후반 뉴턴과 라이프니츠가 서로 독립적으로 도달했다. 뉴턴은 물체의 운동에서 "유율(fluxion)"이라는 개념으로, 라이프니츠는 무한히 작은 양 $dx$의 비 $\\dfrac{dy}{dx}$라는 기호로 같은 대상을 포착했다. 오늘날 우리가 쓰는 $f\'(x)$ 표기는 라그랑주가 도입한 것이다.',
    },

    {
      kind: 'interactiveInline',
      component: 'functionPlayground',
      props: { initialFn: 'x^2', domain: [-3, 3] },
    },

    {
      kind: 'example',
      id: 'ex-2-1-1',
      number: '예제 2.1.1',
      problem:
        '함수 $f(x) = x^2$에 대하여, 구간 $[1,\\, 1+h]$에서의 평균변화율을 구하고, 이를 이용하여 $x = 1$에서의 미분계수 $f\'(1)$을 정의에 따라 구하시오.',
      hint:
        '평균변화율은 $\\dfrac{f(1+h) - f(1)}{h}$이다. $f(1+h) = (1+h)^2$을 전개한 뒤 $f(1) = 1$을 빼고, 분자를 $h$로 묶어 약분한 다음 $h \\to 0$의 극한을 취하라.',
      solution:
        '**풀이.** 먼저 평균변화율을 계산한다. $f(1+h) - f(1) = (1+h)^2 - 1 = 1 + 2h + h^2 - 1 = 2h + h^2$ 이므로, 평균변화율은\n\n$$\\dfrac{f(1+h) - f(1)}{h} = \\dfrac{2h + h^2}{h} = 2 + h.$$\n\n이제 $h \\to 0$의 극한을 취하면 $f\'(1) = \\lim_{h \\to 0} (2 + h) = 2.$ 따라서 $x = 1$에서의 미분계수는 $\\mathbf{2}$이고, 이는 곡선 $y = x^2$의 점 $(1, 1)$에서 그은 접선의 기울기가 $2$임을 뜻한다.',
      visualize: [
        { kind: 'text', markdown: '평균변화율을 두 점을 잇는 할선의 기울기로 본다.' },
        { kind: 'limitDefinition', fn: 'x^2', x0: 1 },
        { kind: 'tangentLine', fn: 'x^2', x0: 1, domain: [-0.5, 2.5] },
        {
          kind: 'equationTransform',
          steps: [
            {
              label: '원식 (평균변화율)',
              latex: '\\dfrac{(1+h)^2 - 1}{h}',
              description: '정의에 값을 대입합니다.'
            },
            {
              label: '분자 전개',
              latex: '\\dfrac{1 + 2h + h^2 - 1}{h}',
              description: '(1+h)² = 1+2h+h² 으로 전개합니다.'
            },
            {
              label: '상수항 소거',
              latex: '\\dfrac{2h + h^2}{h}',
              description: '1 - 1 = 0 사라집니다.'
            },
            {
              label: 'h로 약분',
              latex: '\\dfrac{h(2 + h)}{h} = 2 + h',
              description: 'h ≠ 0 이므로 분모와 분자를 약분합니다.'
            },
            {
              label: '극한 (h → 0)',
              latex: '\\lim_{h \\to 0} (2 + h) = 2',
              description: 'h가 0으로 갈 때 극한값은 2입니다.',
              highlight: true
            }
          ]
        },
      ],
    },
    {
      kind: 'example',
      id: 'ex-2-1-2',
      number: '예제 2.1.2',
      problem:
        '함수 $f(x) = |x|$가 $x = 0$에서 연속이지만 미분불가능함을 극한을 이용해 설명하시오.',
      hint:
        '좌극한과 우극한을 따로 계산한다. $h > 0$일 때와 $h < 0$일 때 $|h|$의 부호가 달라진다는 점에 주목하라.',
      solution:
        '**풀이.** $x = 0$에서 연속임은 $\\lim_{x \\to 0} |x| = 0 = f(0)$로부터 자명하다. 미분계수를 정의에 따라 계산하면\n\n$$\\lim_{h \\to 0} \\dfrac{f(0+h) - f(0)}{h} = \\lim_{h \\to 0} \\dfrac{|h|}{h}.$$\n\n우극한 $(h \\to 0^+)$에서는 $|h| = h$이므로 $\\dfrac{h}{h} = 1$, 좌극한 $(h \\to 0^-)$에서는 $|h| = -h$이므로 $\\dfrac{-h}{h} = -1.$ 두 일방극한이 $1$과 $-1$로 서로 다르므로 극한은 존재하지 않는다. 따라서 $f(x) = |x|$는 $x = 0$에서 연속이지만 미분불가능하다.',
      visualize: [
        { kind: 'text', markdown: '$f(x)=|x|$는 $x=0$에서 연속이지만, 좌미분과 우미분이 달라 미분불가능하다.' },
        { kind: 'derivativeGraph', fnLatex: '|x|', fn: 'abs(x)', domain: [-2, 2] },
      ],
    },
  ],

  keyTerms: [
    {
      term: '평균변화율',
      short: '구간 $[a, a+h]$에서 $x$의 증가량에 대한 $y$의 증가량의 비. 할선의 기울기와 같다.',
    },
    {
      term: '할선',
      short: '곡선 위의 서로 다른 두 점을 잇는 직선. 평균변화율은 이 할선의 기울기를 의미한다.',
    },
    {
      term: '순간변화율',
      short: '평균변화율의 구간을 한없이 좁힐 때의 극한값. 접선의 기울기이며, $f\'(a)$로 쓴다.',
    },
    {
      term: '미분계수',
      short: '$x = a$에서의 순간변화율을 $f\'(a)$라 쓰며, 극한 $\\lim_{h \\to 0} \\dfrac{f(a+h) - f(a)}{h}$로 정의한다.',
    },
    {
      term: '미분가능',
      short: '점 $x = a$에서 미분계수가 존재할 때 $f$가 그 점에서 미분가능하다고 한다. 미분가능하면 반드시 연속이다.',
    },
  ],

  exercises: [
    {
      id: 'exr-2-1-1',
      number: '연습문제 2.1.1',
      problem: '함수 $f(x) = x^2 + 3x$에 대하여, 정의에 따라 $f\'(2)$를 구하시오.',
      hints: [
        '$\\dfrac{f(2+h) - f(2)}{h}$를 계산하는 것이 출발점이다. 먼저 $f(2+h)$와 $f(2)$를 각각 구하라.',
        '$f(2+h) = (2+h)^2 + 3(2+h) = 4 + 4h + h^2 + 6 + 3h = h^2 + 7h + 10$이고 $f(2) = 10$이다. 분자를 정리하면 $h^2 + 7h$가 되고, 이를 $h$로 약분하라.',
      ],
      solution:
        '**풀이.** $f(2+h) - f(2) = (h^2 + 7h + 10) - 10 = h^2 + 7h$이므로, 평균변화율은 $\\dfrac{h^2 + 7h}{h} = h + 7.$ 극한을 취하면 $f\'(2) = \\lim_{h \\to 0} (h + 7) = \\mathbf{7}.$',
      visualize: [
        { kind: 'secantSlope', fn: 'x^2 + 3*x', a: 2 },
        {
          kind: 'equationTransform',
          steps: [
            {
              label: '① 정의 대입',
              latex: '\\dfrac{f(2+h) - f(2)}{h}',
              description: 'f(x) = x² + 3x 이므로 f(2) = 4 + 6 = 10',
            },
            {
              label: '② f(x) 대입 · 전개',
              latex: '\\dfrac{(2+h)^2 + 3(2+h) - 10}{h}',
              description: '(2+h)² = 4+4h+h², 3(2+h) = 6+3h',
            },
            {
              label: '③ 분자 정리',
              latex: '\\dfrac{h^2 + 7h}{h}',
              description: '4+6-10 = 0 으로 상수항 소거, 4h+3h = 7h',
            },
            {
              label: '④ 인수분해 · 약분',
              latex: '\\dfrac{h(h + 7)}{h} = h + 7',
              description: 'h ≠ 0 이므로 분모와 분자의 h를 약분',
            },
            {
              label: '⑤ 극한',
              latex: '\\lim_{h \\to 0}\\,(h + 7)',
              description: 'h를 0으로 보낸다',
            },
            {
              label: '⑥ 답',
              latex: 'f\'(2) = 7',
              description: '접점 (2, 10) 에서 접선의 기울기는 7',
              highlight: true,
            },
          ],
        },
        { kind: 'tangentLine', fn: 'x^2 + 3*x', x0: 2, domain: [0, 4] },
      ],
    },
    {
      id: 'exr-2-1-2',
      number: '연습문제 2.1.2',
      problem:
        '함수 $f(x) = \\dfrac{1}{x}$의 $x = 1$에서의 미분계수를 정의에 따라 구하시오.',
      hints: [
        '$f(1+h) - f(1) = \\dfrac{1}{1+h} - 1$을 통분하는 것부터 시작하라.',
        '통분하면 $\\dfrac{1 - (1+h)}{1+h} = \\dfrac{-h}{1+h}$이다. 이를 $h$로 나누면 $\\dfrac{-1}{1+h}$이 된다.',
      ],
      solution:
        '**풀이.** 평균변화율 $\\dfrac{f(1+h) - f(1)}{h} = \\dfrac{1}{h}\\left( \\dfrac{1}{1+h} - 1 \\right) = \\dfrac{1}{h} \\cdot \\dfrac{-h}{1+h} = \\dfrac{-1}{1+h}.$ $h \\to 0$일 때 $f\'(1) = \\lim_{h \\to 0} \\dfrac{-1}{1+h} = \\mathbf{-1}.$',
      visualize: [
        {
          kind: 'equationTransform',
          steps: [
            {
              label: '원식',
              latex: '\\dfrac{\\frac{1}{1+h} - 1}{h}',
              description: '평균변화율 대입 식'
            },
            {
              label: '분자 통분',
              latex: '\\dfrac{\\frac{1 - (1+h)}{1+h}}{h}',
              description: '분자의 1을 분수 통분'
            },
            {
              label: '분자 정리',
              latex: '\\dfrac{\\frac{-h}{1+h}}{h}',
              description: '1 - (1+h) = -h 로 계산'
            },
            {
              label: '약분',
              latex: '\\dfrac{-1}{1+h}',
              description: '분모 h와 분자의 분자 부분 -h 약분'
            },
            {
              label: '극한 (h → 0)',
              latex: '\\lim_{h \\to 0} \\dfrac{-1}{1+h} = -1',
              description: 'h → 0 일때, 미분계수 = -1',
              highlight: true
            }
          ]
        },
        { kind: 'tangentLine', fn: '1/x', x0: 1, domain: [0.2, 3] },
      ],
    },
    {
      id: 'exr-2-1-3',
      number: '연습문제 2.1.3',
      problem:
        '함수 $f(x) = \\begin{cases} x^2 & (x \\geq 0) \\\\ -x^2 & (x < 0) \\end{cases}$는 $x = 0$에서 미분가능한가? 정의에 따라 판별하시오.',
      hints: [
        '좌극한과 우극한의 미분계수를 따로 계산해, 두 값이 같은지 확인해야 한다.',
        '우극한 $(h \\to 0^+)$: $\\dfrac{h^2 - 0}{h} = h \\to 0$. 좌극한 $(h \\to 0^-)$: $\\dfrac{-h^2 - 0}{h} = -h \\to 0$. 둘 다 $0$으로 수렴하는지 확인하라.',
      ],
      solution:
        '**풀이.** 우미분계수 $\\lim_{h \\to 0^+} \\dfrac{f(h) - f(0)}{h} = \\lim_{h \\to 0^+} \\dfrac{h^2}{h} = 0.$ 좌미분계수 $\\lim_{h \\to 0^-} \\dfrac{f(h) - f(0)}{h} = \\lim_{h \\to 0^-} \\dfrac{-h^2}{h} = 0.$ 두 일방극한이 모두 $0$으로 일치하므로, $f$는 $x = 0$에서 **미분가능**하며 $f\'(0) = 0$이다.',
      visualize: [
        { kind: 'text', markdown: '좌미분과 우미분이 모두 $0$으로 일치하므로 $x=0$에서 미분가능하다.' },
        {
          kind: 'piecewiseGraph',
          x0: 0,
          pieces: [
            { fn: '-x^2', fnLatex: '-x^2', condition: 'x < 0', domain: [-1.5, 0] },
            { fn: 'x^2', fnLatex: 'x^2', condition: 'x \\ge 0', domain: [0, 1.5] },
          ],
        },
      ],
    },
  ],
};
