import type { Page } from '@/types/content';

export const systemOfEquationsPage: Page = {
  slug: 'system-of-equations',
  chapter: 'II. 함수와 그래프',
  section: '4. 연립방정식',
  number: '2.4',
  title: '연립방정식',
  subtitle: '두 직선의 교점이 해가 된다',
  learningObjectives: [
    { id: 'lo1', text: '두 일차방정식을 그래프로 나타낼 수 있다.' },
    { id: 'lo2', text: '두 직선의 교점이 연립방정식의 해임을 설명할 수 있다.' },
    { id: 'lo3', text: '직선의 위치에 따라 해의 개수가 달라짐을 이해한다.' },
  ],
  blocks: [
    {
      kind: 'lead',
      markdown:
        '연립방정식은 식만 보고 푸는 문제 같지만, 그래프로 보면 의미가 훨씬 분명해진다. 두 식을 각각 직선으로 그렸을 때 **둘이 만나는 점**이 바로 두 식을 동시에 만족하는 해다.',
    },
    {
      kind: 'definition',
      id: 'def-system-of-equations',
      term: '연립방정식의 해',
      body:
        '두 방정식을 모두 만족하는 값의 쌍을 연립방정식의 해라고 한다. 그래프에서는 두 직선의 교점으로 나타난다.',
    },
    {
      kind: 'figure',
      visualization: {
        kind: 'systemOfEquations',
        line1: { slope: 1, intercept: 1 },
        line2: { slope: -1, intercept: 3 },
      },
      caption: '두 직선의 교점이 자동으로 표시되며, 그 좌표가 연립방정식의 해가 된다.',
    },
    {
      // 예제 2.4.1 — 인터랙티브 그래프
      kind: 'example',
      id: 'ex-mid-2-4',
      number: '예제 2.4.1',
      problem:
        '$y=x+1$, $y=-x+3$의 해를 그래프로 구하시오. 슬라이더로 두 직선을 직접 맞춰 보며 교점을 찾아보자.',
      hint: '교점에서는 두 식의 $y$값이 같아진다.',
      solution:
        '**풀이.** 두 직선은 $(1, 2)$에서 만난다. 따라서 연립방정식의 해는 **$(1, 2)$**이다.',
      visualize: [
        {
          kind: 'systemOfEquations',
          line1: { slope: 1,  intercept: 1 },
          line2: { slope: -1, intercept: 3 },
          interactive: true,
        },
      ],
    },
  ],
  keyTerms: [
    { term: '교점', short: '두 그래프가 만나는 점.' },
    { term: '연립방정식의 해', short: '두 식을 동시에 만족하는 값의 쌍.' },
  ],
  exercises: [
    // ── 연습문제 2.4.1 ──
    {
      id: 'exr-mid-2-4',
      number: '연습문제 2.4.1',
      problem: '$y=2x+1$, $y=-x+4$의 해를 구하시오.',
      hints: [
        '두 식의 $y$가 같은 $x$를 찾는다.',
        '$2x+1=-x+4$가 되는 점을 구한다.',
      ],
      solution:
        '**풀이.** $2x+1=-x+4$이므로 $3x=3$, $x=1$. 대입하면 $y=3$. 해: **$(1, 3)$**.',
      visualize: [
        {
          kind: 'equationTransform',
          steps: [
            {
              label: '두 식을 같다고 놓기',
              latex: '2x + 1 = -x + 4',
              description: '교점에서는 두 직선의 y값이 같습니다.',
            },
            {
              label: 'x 항 이항',
              latex: '2x + x = 4 - 1',
              description: '-x를 좌변으로, 1을 우변으로 이항합니다.',
            },
            {
              label: '동류항 정리',
              latex: '3x = 3',
              description: '좌변의 x항, 우변의 상수항을 각각 계산합니다.',
            },
            {
              label: 'x 도출',
              latex: 'x = 1',
              description: '양변을 3으로 나눕니다.',
            },
            {
              label: '해 확정',
              latex: 'x = 1, \\quad y = 3',
              description: 'x=1을 y=2x+1에 대입하면 y=2(1)+1=3입니다.',
              highlight: true,
            },
          ],
        },
        {
          kind: 'systemOfEquations',
          line1: { slope: 2,  intercept: 1 },
          line2: { slope: -1, intercept: 4 },
        },
      ],
    },

    // ── 연습문제 2.4.2 ──
    {
      id: 'exr-mid-2-4-2',
      number: '연습문제 2.4.2',
      problem: '$y=x+2$, $y=-2x+5$의 해를 구하시오.',
      hints: [
        '교점에서는 두 식의 $y$값이 같다.',
        '$x+2=-2x+5$를 먼저 풀어라.',
      ],
      solution:
        '**풀이.** $x+2=-2x+5$이므로 $3x=3$, $x=1$. 대입하면 $y=3$. 해: **$(1, 3)$**.',
      visualize: [
        {
          kind: 'equationTransform',
          steps: [
            {
              label: '두 식을 같다고 놓기',
              latex: 'x + 2 = -2x + 5',
              description: '교점에서는 두 직선의 y값이 같습니다.',
            },
            {
              label: 'x 항 이항',
              latex: 'x + 2x = 5 - 2',
              description: '-2x를 좌변으로, 2를 우변으로 이항합니다.',
            },
            {
              label: '동류항 정리',
              latex: '3x = 3',
              description: '좌변의 x항, 우변의 상수항을 각각 계산합니다.',
            },
            {
              label: 'x 도출',
              latex: 'x = 1',
              description: '양변을 3으로 나눕니다.',
            },
            {
              label: '해 확정',
              latex: 'x = 1, \\quad y = 3',
              description: 'x=1을 y=x+2에 대입하면 y=1+2=3입니다.',
              highlight: true,
            },
          ],
        },
        {
          kind: 'systemOfEquations',
          line1: { slope: 1,  intercept: 2 },
          line2: { slope: -2, intercept: 5 },
        },
      ],
    },

    // ── 연습문제 2.4.3 ──
    {
      id: 'exr-mid-2-4-3',
      number: '연습문제 2.4.3',
      problem: '$y=3x-1$, $y=-x+7$의 해를 구하시오.',
      hints: [
        '$3x-1=-x+7$을 풀어 $x$를 구하라.',
        '구한 $x$값을 둘 중 하나의 식에 넣어 $y$를 찾는다.',
      ],
      solution:
        '**풀이.** $3x-1=-x+7$이므로 $4x=8$, $x=2$. 대입하면 $y=5$. 해: **$(2, 5)$**.',
      visualize: [
        {
          kind: 'equationTransform',
          steps: [
            {
              label: '두 식을 같다고 놓기',
              latex: '3x - 1 = -x + 7',
              description: '교점에서는 두 직선의 y값이 같습니다.',
            },
            {
              label: 'x 항 이항',
              latex: '3x + x = 7 + 1',
              description: '-x를 좌변으로, -1을 우변으로 이항합니다.',
            },
            {
              label: '동류항 정리',
              latex: '4x = 8',
              description: '좌변의 x항, 우변의 상수항을 각각 계산합니다.',
            },
            {
              label: 'x 도출',
              latex: 'x = 2',
              description: '양변을 4로 나눕니다.',
            },
            {
              label: '해 확정',
              latex: 'x = 2, \\quad y = 5',
              description: 'x=2를 y=3x-1에 대입하면 y=3(2)-1=5입니다.',
              highlight: true,
            },
          ],
        },
        {
          kind: 'systemOfEquations',
          line1: { slope: 3,  intercept: -1 },
          line2: { slope: -1, intercept: 7 },
        },
      ],
    },
  ],
};
