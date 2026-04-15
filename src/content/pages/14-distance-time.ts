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
      visualization: { kind: 'distanceTime', speed: 40, sampleTime: 6, interactive: true },
      caption: '속도 슬라이더를 올리면 선의 기울기가 더 커지고, 표시 점은 같은 시간에서 이동한 거리를 보여 준다.',
    },
    {
      kind: 'example',
      id: 'ex-el-1-4',
      number: '예제 1.4.1',
      problem: '자동차가 시속 50km로 3시간 동안 일정하게 달렸다. 이동 거리를 구하시오.',
      hint: '거리 = 속력 × 시간',
      solution:
        '**풀이.** 거리 = 속력 × 시간이므로 $50 \\times 3 = 150$이다. 따라서 이동 거리는 **150km**이다.',
      visualize: [{ kind: 'distanceTime', speed: 50, sampleTime: 3, interactive: false }],
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
      visualize: [{ kind: 'distanceTime', speed: 60, sampleTime: 2, interactive: false }],
    },
    {
      id: 'exr-el-1-4-2',
      number: '연습문제 1.4.2',
      problem: '자전거가 시속 15km로 4시간 동안 일정하게 달렸다. 이동 거리를 구하시오.',
      hints: [
        '거리 = 속력 × 시간',
        '$15 \\times 4$를 계산한다.',
      ],
      solution: '**풀이.** $15 \\times 4 = 60$이므로 **60km** 이동한다.',
      visualize: [{ kind: 'distanceTime', speed: 15, sampleTime: 4, interactive: false }],
    },
    {
      id: 'exr-el-1-4-3',
      number: '연습문제 1.4.3',
      problem: 'A 자동차는 시속 40km, B 자동차는 시속 70km로 각각 3시간 동안 달렸다. 어느 자동차가 더 멀리 갔고, 몇 km 더 갔는지 구하시오.',
      hints: [
        '두 자동차의 이동 거리를 각각 구한다.',
        'A는 $40 \\times 3$, B는 $70 \\times 3$이다.',
        '더 큰 거리에서 더 작은 거리를 뺀다.',
      ],
      solution:
        '**풀이.** A 자동차는 $40 \\times 3 = 120$km, B 자동차는 $70 \\times 3 = 210$km 이동한다. 따라서 **B 자동차가 90km 더 멀리** 갔다.',
      visualize: [
        { kind: 'distanceTime', speed: 40, sampleTime: 3, interactive: false },
        { kind: 'distanceTime', speed: 70, sampleTime: 3, interactive: false },
      ],
    },
  ],
};
