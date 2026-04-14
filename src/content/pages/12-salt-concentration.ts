import type { Page } from '@/types/content';

export const saltConcentrationPage: Page = {
  slug: 'salt-concentration',
  chapter: 'I. 규칙과 변화',
  section: '2. 소금물의 농도',
  number: '1.2',
  title: '소금물 농도',
  subtitle: '물과 소금의 양이 바뀌면 농도도 바뀐다',
  learningObjectives: [
    { id: 'lo1', text: '농도를 전체에 대한 부분의 비율로 설명할 수 있다.' },
    { id: 'lo2', text: '물이나 소금의 양이 바뀌면 농도가 어떻게 달라지는지 예측할 수 있다.' },
    { id: 'lo3', text: '슬라이더로 농도의 변화를 실시간으로 확인할 수 있다.' },
  ],
  blocks: [
    {
      kind: 'lead',
      markdown:
        '소금물 문제는 "얼마나 짠가"를 수로 나타내는 문제다. 같은 소금이라도 물이 많아지면 덜 짜고, 같은 물이라도 소금이 많아지면 더 짜다. 결국 핵심은 **전체 중에서 소금이 차지하는 비율**이다.',
    },
    {
      kind: 'definition',
      id: 'def-salt-concentration',
      term: '농도',
      body:
        '소금물의 농도는 $\\dfrac{\\text{소금의 양}}{\\text{소금물의 전체 양}} \\times 100$으로 계산한다. 전체 양은 물의 양과 소금의 양을 더한 값이다.',
    },
    {
      kind: 'figure',
      visualization: { kind: 'saltConcentration', water: 200, salt: 20, interactive: true },
      caption: '물과 소금의 양을 각각 바꾸면 전체 용액과 농도가 실시간으로 달라진다.',
    },
    {
      kind: 'example',
      id: 'ex-el-1-2',
      number: '예제 1.2.1',
      problem: '물 180mL에 소금 20g을 넣었을 때 소금물의 농도를 구하시오.',
      hint: '전체 양은 $180 + 20 = 200$이다.',
      solution:
        '**풀이.** 농도는 $\\dfrac{20}{200} \\times 100 = 10$ 이므로, 소금물의 농도는 **10%**이다.',
      visualize: [{ kind: 'saltConcentration', water: 180, salt: 20, interactive: false }],
    },
  ],
  keyTerms: [
    { term: '농도', short: '전체 용액에서 소금이 차지하는 비율.' },
    { term: '전체 양', short: '물의 양과 소금의 양을 더한 값.' },
    { term: '백분율', short: '전체를 100으로 보았을 때의 비율.' },
  ],
  exercises: [
    {
      id: 'exr-el-1-2',
      number: '연습문제 1.2.1',
      problem: '물 240mL에 소금 60g을 넣었다. 이 소금물의 농도를 구하시오.',
      hints: [
        '전체 양은 $240 + 60 = 300$이다.',
        '농도는 $\\dfrac{60}{300} \\times 100$으로 계산한다.',
      ],
      solution: '**풀이.** $\\dfrac{60}{300} \\times 100 = 20$이므로 농도는 **20%**이다.',
      visualize: [{ kind: 'saltConcentration', water: 240, salt: 60, interactive: false }],
    },
    {
      id: 'exr-el-1-2-2',
      number: '연습문제 1.2.2',
      problem: '물 150mL에 소금 30g을 넣었다. 이 소금물의 농도를 구하시오.',
      hints: [
        '전체 양은 $150 + 30 = 180$이다.',
        '농도는 $\\dfrac{30}{180} \\times 100$이다.',
      ],
      solution:
        '**풀이.** $\\dfrac{30}{180} \\times 100 = 16.6\\overline{6}$이므로 농도는 약 **16.7%**이다.',
      visualize: [{ kind: 'saltConcentration', water: 150, salt: 30, interactive: false }],
    },
    {
      id: 'exr-el-1-2-3',
      number: '연습문제 1.2.3',
      problem: '물 300mL에 소금 45g을 넣었다. 이 소금물의 농도를 구하시오.',
      hints: [
        '전체 양은 $300 + 45 = 345$이다.',
        '농도는 $\\dfrac{45}{345} \\times 100$으로 계산한다.',
      ],
      solution:
        '**풀이.** $\\dfrac{45}{345} \\times 100 \\approx 13.04$이므로 농도는 약 **13.0%**이다.',
      visualize: [{ kind: 'saltConcentration', water: 300, salt: 45, interactive: false }],
    },
  ],
};
