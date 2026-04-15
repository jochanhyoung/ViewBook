import type { Page } from '@/types/content';

export const linearFunctionPage: Page = {
  slug: 'linear-function',
  chapter: 'II. 함수와 그래프',
  section: '2. 일차함수',
  number: '2.2',
  title: '일차함수',
  subtitle: '기울기와 절편이 직선을 결정한다',
  learningObjectives: [
    { id: 'lo1', text: '일차함수 $y=mx+b$에서 $m$과 $b$의 의미를 설명할 수 있다.' },
    { id: 'lo2', text: '기울기가 바뀌면 직선의 방향이 달라짐을 이해한다.' },
    { id: 'lo3', text: '절편이 바뀌면 직선 전체가 위아래로 이동함을 확인할 수 있다.' },
  ],
  blocks: [
    {
      kind: 'lead',
      markdown:
        '일차함수는 가장 기본적인 직선의 식이다. 여기서 $m$은 기울기, $b$는 y절편이다. 두 수만 정해지면 직선은 완전히 결정된다.',
    },
    {
      kind: 'definition',
      id: 'def-linear-function',
      term: '일차함수',
      body:
        '식이 $y = mx + b$ 꼴인 함수를 일차함수라고 한다. $m$은 기울기, $b$는 y축과 만나는 점의 y좌표이다.',
    },
    {
      kind: 'figure',
      visualization: { kind: 'linearFunction', slope: 1, intercept: 2, interactive: true },
      caption: '$m$과 $b$ 슬라이더를 바꾸면 직선의 기울기와 위치가 실시간으로 바뀐다.',
    },
    {
      kind: 'example',
      id: 'ex-mid-2-2',
      number: '예제 2.2.1',
      problem: '함수 $y = 2x + 1$의 기울기와 y절편을 말하시오.',
      hint: '$y = mx + b$와 비교하라.',
      solution:
        '**풀이.** $m = 2$, $b = 1$이므로 기울기는 **2**, y절편은 **1**이다.',
      visualize: [{ kind: 'linearFunction', slope: 2, intercept: 1, interactive: false }],
    },
  ],
  keyTerms: [
    { term: '기울기', short: 'x가 1 증가할 때 y가 얼마나 변하는지 나타내는 값.' },
    { term: 'y절편', short: '직선이 y축과 만나는 점의 y좌표.' },
  ],
  exercises: [
    {
      id: 'exr-mid-2-2',
      number: '연습문제 2.2.1',
      problem: '$y = -3x + 4$의 기울기와 y절편을 구하시오.',
      hints: [
        '$m=-3$, $b=4$이다.',
        '기울기는 음수이므로 오른쪽으로 갈수록 내려가는 직선이다.',
      ],
      solution: '**풀이.** 기울기는 **-3**, y절편은 **4**이다.',
      visualize: [{ kind: 'linearFunction', slope: -3, intercept: 4, interactive: false }],
    },
    {
      id: 'exr-mid-2-2-2',
      number: '연습문제 2.2.2',
      problem: '$y = 0.5x - 2$의 기울기와 y절편을 구하시오.',
      hints: [
        '$y=mx+b$ 꼴에서 $m=0.5$, $b=-2$이다.',
        '기울기가 양수이므로 오른쪽으로 갈수록 올라간다.',
      ],
      solution: '**풀이.** 기울기는 **0.5**, y절편은 **-2**이다.',
      visualize: [{ kind: 'linearFunction', slope: 0.5, intercept: -2, interactive: false }],
    },
    {
      id: 'exr-mid-2-2-3',
      number: '연습문제 2.2.3',
      problem: '$y = -x - 1$의 기울기와 y절편을 구하시오.',
      hints: [
        '$-x$는 $-1x$이므로 기울기는 -1이다.',
        '상수항이 -1이므로 y절편은 -1이다.',
      ],
      solution: '**풀이.** 기울기는 **-1**, y절편은 **-1**이다.',
      visualize: [{ kind: 'linearFunction', slope: -1, intercept: -1, interactive: false }],
    },
  ],
};
