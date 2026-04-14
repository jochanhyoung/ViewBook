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
      kind: 'example',
      id: 'ex-mid-2-4',
      number: '예제 2.4.1',
      problem: '$y=x+1$, $y=-x+3$의 해를 그래프로 해석하시오.',
      hint: '교점에서는 두 식의 y값이 같아진다.',
      solution:
        '**풀이.** 두 직선은 $(1, 2)$에서 만난다. 따라서 연립방정식의 해는 **$(1, 2)$**이다.',
      visualize: [
        {
          kind: 'systemOfEquations',
          line1: { slope: 1, intercept: 1 },
          line2: { slope: -1, intercept: 3 },
        },
      ],
    },
  ],
  keyTerms: [
    { term: '교점', short: '두 그래프가 만나는 점.' },
    { term: '연립방정식의 해', short: '두 식을 동시에 만족하는 값의 쌍.' },
  ],
  exercises: [
    {
      id: 'exr-mid-2-4',
      number: '연습문제 2.4.1',
      problem: '$y=2x+1$, $y=-x+4$의 해를 구하시오.',
      hints: [
        '두 직선이 만나는 x좌표를 먼저 구한다.',
        '$2x+1=-x+4$가 되는 점을 찾는다.',
      ],
      solution: '**풀이.** $2x+1=-x+4$이므로 $3x=3$, $x=1$이다. 이 값을 대입하면 $y=3$이므로 해는 **$(1, 3)$**이다.',
      visualize: [
        {
          kind: 'systemOfEquations',
          line1: { slope: 2, intercept: 1 },
          line2: { slope: -1, intercept: 4 },
        },
      ],
    },
    {
      id: 'exr-mid-2-4-2',
      number: '연습문제 2.4.2',
      problem: '$y=x+2$, $y=-2x+5$의 해를 구하시오.',
      hints: [
        '교점에서는 두 식의 y값이 같다.',
        '$x+2=-2x+5$를 먼저 풀어라.',
      ],
      solution:
        '**풀이.** $x+2=-2x+5$이므로 $3x=3$, $x=1$이다. 이를 대입하면 $y=3$이므로 해는 **$(1, 3)$**이다.',
      visualize: [
        {
          kind: 'systemOfEquations',
          line1: { slope: 1, intercept: 2 },
          line2: { slope: -2, intercept: 5 },
        },
      ],
    },
    {
      id: 'exr-mid-2-4-3',
      number: '연습문제 2.4.3',
      problem: '$y=3x-1$, $y=-x+7$의 해를 구하시오.',
      hints: [
        '$3x-1=-x+7$을 풀어 x를 구하라.',
        '구한 x값을 둘 중 하나의 식에 넣어 y를 찾는다.',
      ],
      solution:
        '**풀이.** $3x-1=-x+7$이므로 $4x=8$, $x=2$이다. 이 값을 대입하면 $y=5$이므로 해는 **$(2, 5)$**이다.',
      visualize: [
        {
          kind: 'systemOfEquations',
          line1: { slope: 3, intercept: -1 },
          line2: { slope: -1, intercept: 7 },
        },
      ],
    },
  ],
};
