import type { Page } from '@/types/content';

export const quadraticFunctionPage: Page = {
  slug: 'quadratic-function',
  chapter: 'II. 함수와 그래프',
  section: '2. 이차함수',
  number: '2.2',
  title: '이차함수',
  subtitle: '$a$ 값 하나가 포물선의 모양을 바꾼다',
  learningObjectives: [
    { id: 'lo1', text: '$y=ax^2$의 그래프가 포물선임을 안다.' },
    { id: 'lo2', text: '$a$의 부호에 따라 위로 또는 아래로 열림을 설명할 수 있다.' },
    { id: 'lo3', text: '$|a|$가 커질수록 포물선이 더 좁아짐을 확인할 수 있다.' },
  ],
  blocks: [
    {
      kind: 'lead',
      markdown:
        '이차함수 $y=ax^2$의 그래프는 포물선이다. 숫자 $a$ 하나만 바뀌어도 그래프는 위아래 방향이 달라지고, 폭도 넓어지거나 좁아진다.',
    },
    {
      kind: 'keyPoint',
      markdown:
        '**$a>0$이면 위로, $a<0$이면 아래로 열린다.** 또한 $|a|$가 클수록 그래프는 더 좁아진다.',
    },
    {
      kind: 'figure',
      visualization: { kind: 'quadraticFunction', a: 1, interactive: true },
      caption: '$a$ 슬라이더를 움직여 포물선의 방향과 폭이 어떻게 변하는지 확인할 수 있다.',
    },
    {
      kind: 'example',
      id: 'ex-mid-2-2',
      number: '예제 2.2.1',
      problem: '함수 $y=-2x^2$의 그래프는 위로 열리는가, 아래로 열리는가?',
      hint: '$a=-2$의 부호를 보라.',
      solution:
        '**풀이.** $a=-2<0$이므로 그래프는 **아래로 열린다.**',
      visualize: [{ kind: 'quadraticFunction', a: -2, interactive: false }],
    },
  ],
  keyTerms: [
    { term: '포물선', short: '이차함수 그래프의 모양.' },
    { term: '계수 a', short: '포물선의 방향과 폭을 결정하는 값.' },
  ],
  exercises: [
    {
      id: 'exr-mid-2-2',
      number: '연습문제 2.2.1',
      problem: '$y = 0.5x^2$의 그래프는 $y = x^2$보다 넓은가 좁은가?',
      hints: [
        '$|0.5| < 1$이다.',
        '$|a|$가 작아지면 그래프는 더 넓어진다.',
      ],
      solution: '**풀이.** $|a|$가 더 작으므로 $y=x^2$보다 **더 넓다.**',
      visualize: [{ kind: 'quadraticFunction', a: 0.5, interactive: false }],
    },
    {
      id: 'exr-mid-2-2-2',
      number: '연습문제 2.2.2',
      problem: '$y = 3x^2$의 그래프는 위로 열리는가, 아래로 열리는가? 또 $y=x^2$보다 넓은가 좁은가?',
      hints: [
        '$a=3>0$이므로 위로 열린다.',
        '$|3| > 1$이므로 더 좁아진다.',
      ],
      solution: '**풀이.** $a>0$이므로 그래프는 **위로 열리고**, $|a|$가 더 크므로 $y=x^2$보다 **더 좁다.**',
      visualize: [{ kind: 'quadraticFunction', a: 3, interactive: false }],
    },
    {
      id: 'exr-mid-2-2-3',
      number: '연습문제 2.2.3',
      problem: '$y = -0.5x^2$의 그래프는 위로 열리는가, 아래로 열리는가? 또 $y=-x^2$보다 넓은가 좁은가?',
      hints: [
        '$a=-0.5<0$이므로 아래로 열린다.',
        '$|-0.5| < 1$이므로 더 넓다.',
      ],
      solution: '**풀이.** $a<0$이므로 그래프는 **아래로 열리고**, $|a|$가 더 작으므로 $y=-x^2$보다 **더 넓다.**',
      visualize: [{ kind: 'quadraticFunction', a: -0.5, interactive: false }],
    },
  ],
};
