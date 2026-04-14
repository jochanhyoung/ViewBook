import type { Page } from '@/types/content';

export const distanceTimePage: Page = {
  slug: 'distance-time',
  chapter: 'I. 규칙과 변화',
  section: '4. 거리와 시간',
  number: '1.4',
  title: '거리-시간 그래프',
  subtitle: '속력이 바뀌면 선의 기울기도 바뀐다',
  learningObjectives: [
    { id: 'lo1', text: '거리-시간 그래프에서 기울기가 속력을 뜻함을 이해한다.' },
    { id: 'lo2', text: '같은 시간 동안 더 멀리 갈수록 그래프가 더 가파름을 설명할 수 있다.' },
    { id: 'lo3', text: '속도 슬라이더로 그래프 변화와 이동 거리를 연결할 수 있다.' },
  ],
  blocks: [
    {
      kind: 'lead',
      markdown:
        '움직임을 그림으로 나타내면 선이 된다. 시간이 지날수록 거리가 빠르게 늘어나면 선은 가파르고, 천천히 늘어나면 선은 완만하다. 거리-시간 그래프는 결국 **속력의 크기를 기울기로 보여 주는 그림**이다.',
    },
    {
      kind: 'definition',
      id: 'def-distance-time',
      term: '거리-시간 그래프',
      body:
        '가로축을 시간, 세로축을 거리로 놓은 그래프이다. 직선의 기울기가 클수록 같은 시간에 더 많이 이동한 것이므로 속력이 더 크다.',
    },
    {
      kind: 'figure',
      visualization: { kind: 'distanceTime', speed: 40 },
      caption: '속도 슬라이더를 올리면 선의 기울기가 더 커지고, 같은 시간에서의 거리도 함께 증가한다.',
    },
    {
      kind: 'example',
      id: 'ex-el-1-4',
      number: '예제 1.4.1',
      problem: '자동차가 시속 50km로 3시간 동안 일정하게 달렸다. 이동 거리를 구하시오.',
      hint: '거리 = 속력 × 시간',
      solution:
        '**풀이.** 거리 = 속력 × 시간이므로 $50 \\times 3 = 150$이다. 따라서 이동 거리는 **150km**이다.',
      visualize: [{ kind: 'distanceTime', speed: 50 }],
    },
  ],
  keyTerms: [
    { term: '기울기', short: '그래프가 얼마나 가파른지를 나타내는 정도.' },
    { term: '속력', short: '단위 시간 동안 이동한 거리.' },
  ],
  exercises: [
    {
      id: 'exr-el-1-4',
      number: '연습문제 1.4.1',
      problem: '시속 60km로 2시간 이동하면 몇 km를 가는지 구하시오.',
      hints: [
        '거리 = 속력 × 시간',
        '$60 \\times 2$를 계산한다.',
      ],
      solution: '**풀이.** $60 \\times 2 = 120$이므로 **120km** 이동한다.',
      visualize: [{ kind: 'distanceTime', speed: 60 }],
    },
  ],
};
