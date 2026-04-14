import type { Page } from '@/types/content';

export const secantToTangentPage: Page = {
  slug: 'secant-to-tangent',
  chapter: 'II. 함수와 그래프',
  section: '3. 평균변화율과 접선',
  number: '2.3',
  title: '평균변화율에서 접선으로',
  subtitle: '두 점이 가까워질수록 할선은 접선이 된다',
  learningObjectives: [
    { id: 'lo1', text: '평균변화율을 두 점을 잇는 직선의 기울기로 볼 수 있다.' },
    { id: 'lo2', text: '두 점의 거리를 줄이면 할선이 접선에 가까워짐을 이해한다.' },
    { id: 'lo3', text: '순간변화율의 직관을 그래프에서 설명할 수 있다.' },
  ],
  blocks: [
    {
      kind: 'lead',
      markdown:
        '곡선 위의 두 점을 이으면 할선이 생긴다. 그런데 두 점을 점점 더 가까이 움직이면, 이 할선은 어느 순간 한 점에서 곡선에 닿는 접선처럼 보인다. 이 장면이 바로 평균변화율에서 순간변화율로 넘어가는 핵심이다.',
    },
    {
      kind: 'definition',
      id: 'def-secant-tangent',
      term: '할선과 접선',
      body:
        '곡선 위의 두 점을 잇는 직선이 할선이고, 한 점에서 곡선에 닿으며 그 점 근처의 방향을 나타내는 직선이 접선이다.',
    },
    {
      kind: 'figure',
      visualization: { kind: 'secantSlope', fn: 'x^2', a: 1, interactive: true },
      caption: '두 점 사이 거리 $h$를 줄이면 할선의 기울기가 접선의 기울기에 가까워진다.',
    },
    {
      kind: 'example',
      id: 'ex-mid-2-3',
      number: '예제 2.3.1',
      problem: '함수 $y=x^2$에서 $x=1$ 근처의 평균변화율을 관찰할 때, 두 점 사이 거리가 작아지면 어떤 일이 일어나는지 설명하시오.',
      hint: '할선의 방향과 접선의 방향을 비교하라.',
      solution:
        '**풀이.** 두 점 사이 거리가 작아질수록 할선은 점점 한 점에서의 방향을 더 잘 나타내게 된다. 즉, 할선의 기울기가 접선의 기울기에 가까워진다.',
      visualize: [
        { kind: 'text', markdown: '두 점 사이 거리 $h$를 줄이며 할선이 접선으로 가까워지는 모습을 본다.' },
        { kind: 'secantSlope', fn: 'x^2', a: 1, interactive: false },
      ],
    },
  ],
  keyTerms: [
    { term: '평균변화율', short: '두 점 사이에서의 변화량 비율. 할선의 기울기와 같다.' },
    { term: '접선', short: '한 점에서 곡선의 순간적인 방향을 나타내는 직선.' },
  ],
  exercises: [
    {
      id: 'exr-mid-2-3',
      number: '연습문제 2.3.1',
      problem: '$h$가 0에 가까워질수록 왜 할선의 기울기가 중요해지는지 쓰시오.',
      hints: [
        '한 점 근처의 변화를 더 정확하게 나타낸다.',
        '접선의 기울기와 연결된다.',
      ],
      solution: '**풀이.** $h$가 작아질수록 평균변화율이 한 점에서의 순간적인 변화를 더 잘 나타내기 때문이다. 그래서 접선의 기울기를 이해하는 데 중요하다.',
      visualize: [{ kind: 'secantSlope', fn: 'x^2', a: 1, interactive: false }],
    },
    {
      id: 'exr-mid-2-3-2',
      number: '연습문제 2.3.2',
      problem: '함수 $y=x^2$에서 $x=2$를 기준으로 할 때, 점 $B$가 $A$에 가까워질수록 할선의 기울기는 어떤 값에 가까워지는지 설명하시오.',
      hints: [
        '$x=2$에서의 접선 기울기를 떠올려 보라.',
        '할선은 두 점이 가까워질수록 접선의 방향을 더 잘 나타낸다.',
      ],
      solution:
        '**풀이.** 점 $B$가 $A$에 가까워질수록 할선의 기울기는 $x=2$에서의 접선 기울기에 가까워진다. 즉 평균변화율이 순간변화율에 가까워진다.',
      visualize: [{ kind: 'secantSlope', fn: 'x^2', a: 2, interactive: false }],
    },
    {
      id: 'exr-mid-2-3-3',
      number: '연습문제 2.3.3',
      problem: '함수 $y=x^2+1$에서 $x=1$ 근처의 평균변화율을 관찰할 때, 왜 두 점 사이 거리를 줄여 보는 것이 필요한지 설명하시오.',
      hints: [
        '우리가 알고 싶은 것은 한 점에서의 변화이다.',
        '두 점이 멀면 구간 전체 평균만 보이게 된다.',
      ],
      solution:
        '**풀이.** 두 점이 멀리 떨어져 있으면 구간 전체의 평균변화율만 알 수 있다. 거리를 줄이면 한 점 근처에서의 변화를 더 정확히 볼 수 있어 접선의 기울기, 즉 순간변화율을 이해할 수 있다.',
      visualize: [{ kind: 'secantSlope', fn: 'x^2 + 1', a: 1, interactive: false }],
    },
  ],
};
