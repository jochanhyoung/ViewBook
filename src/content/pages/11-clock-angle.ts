import type { Page } from '@/types/content';

export const clockAnglePage: Page = {
  slug: 'clock-angle',
  chapter: 'I. 규칙과 변화',
  section: '1. 시계와 각도',
  number: '1.1',
  title: '시계 문제',
  subtitle: '시간이 바뀌면 각도도 함께 바뀐다',
  learningObjectives: [
    { id: 'lo1', text: '분침과 시침의 움직임을 각도로 설명할 수 있다.' },
    { id: 'lo2', text: '시간의 변화가 각도 변화와 연결됨을 이해한다.' },
    { id: 'lo3', text: '주어진 시각에서 작은 각과 큰 각을 구분할 수 있다.' },
  ],
  blocks: [
    {
      kind: 'lead',
      markdown:
        '시계는 시간을 알려 주는 도구이지만, 동시에 **각도를 만드는 기계**이기도 하다. 분침은 한 바퀴를 60분에 돌고, 시침은 한 바퀴를 12시간에 돈다. 따라서 시간이 조금만 달라져도 두 바늘 사이 각도는 계속 변한다.',
    },
    {
      kind: 'definition',
      id: 'def-clock-angle',
      term: '시계 각도',
      body:
        '분침은 1분에 $6^\\circ$, 시침은 1분에 $0.5^\\circ$ 움직인다. 따라서 어떤 시각에서 두 바늘 사이 각도는 각 바늘의 회전량 차이로 계산할 수 있다.',
    },
    {
      kind: 'figure',
      visualization: { kind: 'clockAngle', hour: 2, minute: 20, interactive: true },
      caption: '시간 슬라이더를 움직이면 시침과 분침의 위치가 함께 바뀌고, 두 바늘 사이의 작은 각이 즉시 계산된다.',
    },
    {
      kind: 'example',
      id: 'ex-el-1-1',
      number: '예제 1.1.1',
      problem: '2시 20분일 때 시침과 분침 사이의 작은 각을 구하시오.',
      hint: '분침은 $20 \\times 6 = 120^\\circ$, 시침은 $2 \\times 30 + 20 \\times 0.5 = 70^\\circ$ 움직였다.',
      solution:
        '**풀이.** 분침의 각도는 $120^\\circ$이고 시침의 각도는 $70^\\circ$이다. 따라서 두 바늘 사이 각은 $120 - 70 = 50^\\circ$이다. 작은 각은 **$50^\\circ$**이다.',
      visualize: [{ kind: 'clockAngle', hour: 2, minute: 20, interactive: false }],
    },
  ],
  keyTerms: [
    { term: '분침', short: '1분에 $6^\\circ$씩 움직이는 바늘.' },
    { term: '시침', short: '1분에 $0.5^\\circ$씩 움직이는 바늘.' },
    { term: '작은 각', short: '두 바늘 사이에서 더 작은 쪽의 각도.' },
  ],
  exercises: [
    {
      id: 'exr-el-1-1',
      number: '연습문제 1.1.1',
      problem: '3시 30분일 때 시침과 분침 사이의 작은 각을 구하시오.',
      hints: [
        '분침은 $180^\\circ$ 위치에 있다.',
        '시침은 $3 \\times 30 + 30 \\times 0.5 = 105^\\circ$ 위치에 있다.',
      ],
      solution: '**풀이.** 두 각의 차이는 $180 - 105 = 75$이므로 작은 각은 **$75^\\circ$**이다.',
      visualize: [{ kind: 'clockAngle', hour: 3, minute: 30, interactive: false }],
    },
    {
      id: 'exr-el-1-1-2',
      number: '연습문제 1.1.2',
      problem: '4시 10분일 때 시침과 분침 사이의 작은 각을 구하시오.',
      hints: [
        '분침은 $10 \\times 6 = 60^\\circ$ 위치에 있다.',
        '시침은 $4 \\times 30 + 10 \\times 0.5 = 125^\\circ$ 위치에 있다.',
      ],
      solution:
        '**풀이.** 시침은 $125^\\circ$, 분침은 $60^\\circ$ 위치에 있으므로 두 바늘 사이 각은 $125 - 60 = 65^\\circ$이다. 작은 각은 **$65^\\circ$**이다.',
      visualize: [{ kind: 'clockAngle', hour: 4, minute: 10, interactive: false }],
    },
    {
      id: 'exr-el-1-1-3',
      number: '연습문제 1.1.3',
      problem: '7시 40분일 때 시침과 분침 사이의 작은 각을 구하시오.',
      hints: [
        '분침은 $40 \\times 6 = 240^\\circ$ 위치에 있다.',
        '시침은 $7 \\times 30 + 40 \\times 0.5 = 230^\\circ$ 위치에 있다.',
      ],
      solution:
        '**풀이.** 시침은 $230^\\circ$, 분침은 $240^\\circ$ 위치에 있다. 두 바늘 사이 각은 $240 - 230 = 10^\\circ$이므로 작은 각은 **$10^\\circ$**이다.',
      visualize: [{ kind: 'clockAngle', hour: 7, minute: 40, interactive: false }],
    },
  ],
};
