import type { Page } from '@/types/content';

export const coordinatePlanePage: Page = {
  slug: 'coordinate-plane',
  chapter: 'II. 함수와 그래프',
  section: '1. 좌표평면',
  number: '2.1',
  title: '좌표평면',
  subtitle: '두 수의 쌍으로 평면 위의 모든 점을 나타낼 수 있다',
  learningObjectives: [
    { id: 'lo1', text: 'x축, y축, 원점의 의미를 설명할 수 있다.' },
    { id: 'lo2', text: '점의 좌표 $(x, y)$를 읽고 좌표평면에 나타낼 수 있다.' },
    { id: 'lo3', text: '네 사분면의 이름과 각 사분면에서 x, y의 부호를 말할 수 있다.' },
  ],
  blocks: [
    {
      kind: 'lead',
      markdown:
        '지도에서 위치를 표시할 때 가로줄과 세로줄을 함께 쓰듯, 평면 위의 점도 두 수의 쌍으로 정확하게 나타낼 수 있다. 이 두 수의 쌍을 **좌표**라고 하고, 좌표를 읽을 수 있는 평면을 **좌표평면**이라 한다.',
    },
    {
      kind: 'definition',
      id: 'def-coordinate-plane',
      term: '좌표평면',
      body:
        '수평 방향의 직선을 **x축**, 수직 방향의 직선을 **y축**이라 한다. 두 축이 만나는 점을 **원점(O)**이라 하고, 원점의 좌표는 $(0, 0)$이다. x축과 y축을 함께 그린 평면을 **좌표평면**이라 한다.',
    },
    {
      kind: 'figure',
      visualization: {
        kind: 'coordinatePlane',
        points: [
          { x: 3, y: 2, label: 'A' },
          { x: -2, y: 3, label: 'B' },
          { x: -3, y: -1, label: 'C' },
          { x: 2, y: -3, label: 'D' },
        ],
        interactive: false,
      },
      caption:
        '점 A(3, 2), B(-2, 3), C(-3, -1), D(2, -3)이 각각 어느 사분면에 있는지 확인할 수 있다.',
    },
    {
      kind: 'definition',
      id: 'def-quadrant',
      term: '사분면',
      body:
        'x축과 y축은 좌표평면을 네 구역으로 나눈다. 오른쪽 위부터 시계 반대 방향으로 **제1사분면, 제2사분면, 제3사분면, 제4사분면**이라 한다. 좌표축 위의 점은 어느 사분면에도 속하지 않는다.',
    },
    {
      kind: 'keyPoint',
      markdown:
        '| 사분면 | x의 부호 | y의 부호 |\n|---|---|---|\n| 제1사분면 | $+$ | $+$ |\n| 제2사분면 | $-$ | $+$ |\n| 제3사분면 | $-$ | $-$ |\n| 제4사분면 | $+$ | $-$ |',
    },
    {
      kind: 'example',
      id: 'ex-mid-2-1-1',
      number: '예제 2.1.1',
      problem:
        '점 $\\mathrm{P}(3, -2)$를 좌표평면에 나타내고, 어느 사분면에 속하는지 말하시오.',
      hint: 'x좌표가 양수이면 오른쪽, y좌표가 음수이면 아래쪽에 점이 있다.',
      solution:
        '**풀이.** x좌표가 $3 > 0$, y좌표가 $-2 < 0$이므로 점 P는 **제4사분면**에 있다.',
      visualize: [
        {
          kind: 'coordinatePlane',
          points: [{ x: 3, y: -2, label: 'P' }],
          interactive: false,
        },
      ],
    },
    {
      kind: 'note',
      variant: 'tip',
      markdown:
        '**좌표 읽는 순서:** 순서쌍 $(x, y)$에서 첫 번째 수는 항상 **x좌표(가로)**, 두 번째 수는 항상 **y좌표(세로)**이다. 순서를 바꾸면 전혀 다른 점이 된다.',
    },
  ],
  keyTerms: [
    { term: 'x축', short: '좌표평면의 수평 방향 기준선.' },
    { term: 'y축', short: '좌표평면의 수직 방향 기준선.' },
    { term: '원점', short: 'x축과 y축이 만나는 점. 좌표는 $(0, 0)$.' },
    { term: '순서쌍', short: '두 수를 순서에 맞게 짝 지은 것. $(x, y)$ 형태로 쓴다.' },
    { term: '사분면', short: '좌표축이 좌표평면을 나누는 네 구역.' },
  ],
  exercises: [
    {
      id: 'exr-mid-2-1-1',
      number: '연습문제 2.1.1',
      problem:
        '다음 점들이 각각 몇 사분면에 있는지 말하시오.\n\n$\\mathrm{A}(-1, 4)$, $\\mathrm{B}(2, -3)$, $\\mathrm{C}(-2, -1)$, $\\mathrm{D}(3, 1)$',
      hints: [
        'x좌표의 부호와 y좌표의 부호를 각각 확인한다.',
        'x가 음수이고 y가 양수이면 제2사분면이다.',
      ],
      solution:
        '**풀이.**\n- A(-1, 4): x<0, y>0 → **제2사분면**\n- B(2, -3): x>0, y<0 → **제4사분면**\n- C(-2, -1): x<0, y<0 → **제3사분면**\n- D(3, 1): x>0, y>0 → **제1사분면**',
      visualize: [
        {
          kind: 'coordinatePlane',
          points: [
            { x: -1, y: 4, label: 'A' },
            { x: 2, y: -3, label: 'B' },
            { x: -2, y: -1, label: 'C' },
            { x: 3, y: 1, label: 'D' },
          ],
          interactive: false,
        },
      ],
    },
    {
      id: 'exr-mid-2-1-2',
      number: '연습문제 2.1.2',
      problem:
        '점 $\\mathrm{Q}(a, b)$가 제3사분면에 있을 때, $a$와 $b$의 부호를 말하시오. 또 점 $\\mathrm{R}(-a, b)$는 몇 사분면에 있는지 구하시오.',
      hints: [
        '제3사분면에서는 x < 0, y < 0이다.',
        '$-a$의 부호는 $a$의 반대이다.',
      ],
      solution:
        '**풀이.** Q가 제3사분면이므로 $a < 0$, $b < 0$이다.\n$-a$는 $a$의 반대 부호이므로 $-a > 0$이다. $b < 0$이므로 점 R$(-a, b)$는 x>0, y<0, 즉 **제4사분면**에 있다.',
      visualize: [
        {
          kind: 'coordinatePlane',
          points: [
            { x: -2, y: -1, label: 'Q' },
            { x: 2, y: -1, label: 'R' },
          ],
          interactive: false,
        },
      ],
    },
    {
      id: 'exr-mid-2-1-3',
      number: '연습문제 2.1.3',
      problem:
        '좌표평면에서 점 $\\mathrm{A}(3, 2)$와 x축에 대해 대칭인 점의 좌표를 구하시오.',
      hints: [
        'x축에 대해 대칭이면 x좌표는 그대로이고 y좌표의 부호만 바뀐다.',
        'A(3, 2)에서 y좌표의 부호를 바꾸면?',
      ],
      solution:
        '**풀이.** x축 대칭이면 y좌표의 부호가 반대가 된다. 따라서 대칭인 점의 좌표는 **(3, -2)**이다.',
      visualize: [
        {
          kind: 'coordinatePlane',
          points: [
            { x: 3, y: 2, label: 'A' },
            { x: 3, y: -2, label: "A'" },
          ],
          interactive: false,
        },
      ],
    },
  ],
};
