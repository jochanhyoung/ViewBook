import type { Page } from '@/types/content';

export const calendarPatternPage: Page = {
  slug: 'calendar-pattern',
  chapter: 'I. 규칙과 변화',
  section: '3. 달력의 규칙',
  number: '1.3',
  title: '달력 규칙 문제',
  subtitle: '날짜는 1씩, 요일은 7일마다 반복된다',
  learningObjectives: [
    { id: 'lo1', text: '날짜가 하루 늘면 요일도 한 칸씩 이동함을 이해한다.' },
    { id: 'lo2', text: '같은 열의 날짜가 7일 차이 난다는 규칙을 설명할 수 있다.' },
    { id: 'lo3', text: '날짜와 요일의 반복 패턴을 시각적으로 찾을 수 있다.' },
  ],
  blocks: [
    {
      kind: 'lead',
      markdown:
        '달력은 단순히 날짜를 적어 놓은 표가 아니다. 하루가 지나면 요일은 한 칸씩 움직이고, **7일이 지나면 같은 요일로 다시 돌아온다.** 그래서 달력에는 일정한 세로 규칙과 가로 규칙이 숨어 있다.',
    },
    {
      kind: 'keyPoint',
      markdown:
        '**같은 열 = 같은 요일.** 달력에서 같은 열에 있는 날짜들은 모두 7일 차이가 나며, 같은 요일을 나타낸다.',
    },
    {
      kind: 'figure',
      visualization: { kind: 'calendarPattern', day: 12, interactive: true },
      caption: '날짜를 선택하면 같은 요일에 해당하는 날짜들이 함께 강조된다.',
    },
    {
      kind: 'example',
      id: 'ex-el-1-3',
      number: '예제 1.3.1',
      problem: '어떤 달의 12일이 금요일이면 19일은 무슨 요일인지 알아보세요.',
      hint: '12일에서 19일은 7일 차이이다.',
      solution:
        '**풀이.** 19일은 12일보다 정확히 7일 뒤예요. 7일이 지나면 같은 요일이 반복되므로 19일도 **금요일**이에요.',
      visualize: [{ kind: 'calendarPattern', day: 12, interactive: false }],
    },
  ],
  keyTerms: [
    { term: '요일 패턴', short: '하루가 지나면 한 칸 이동하고, 7일마다 반복되는 규칙.' },
    { term: '같은 열', short: '달력에서 같은 요일을 나타내는 세로줄.' },
  ],
  exercises: [
    {
      id: 'exr-el-1-3',
      number: '연습문제 1.3.1',
      problem: '8일이 화요일이면 22일은 무슨 요일인지 알아보세요.',
      hints: [
        '22일은 8일보다 14일 뒤이다.',
        '14일은 7일이 두 번이므로 같은 요일이다.',
      ],
      solution: '**풀이.** 14일 차이는 7일의 두 배이므로 요일이 같아요. 따라서 22일은 **화요일**이에요.',
      visualize: [{ kind: 'calendarPattern', day: 8, interactive: false }],
    },
    {
      id: 'exr-el-1-3-2',
      number: '연습문제 1.3.2',
      problem: '5일이 월요일이면 26일은 무슨 요일인지 알아보세요.',
      hints: [
        '26일은 5일보다 21일 뒤이다.',
        '21일은 7일이 세 번이므로 같은 요일이다.',
      ],
      solution:
        '**풀이.** 21일은 7일의 세 배이므로 요일이 변하지 않아요. 따라서 26일은 **월요일**이에요.',
      visualize: [{ kind: 'calendarPattern', day: 5, interactive: false }],
    },
    {
      id: 'exr-el-1-3-3',
      number: '연습문제 1.3.3',
      problem: '11일이 수요일이면 18일과 25일은 각각 무슨 요일인지 알아보세요.',
      hints: [
        '18일은 11일보다 7일 뒤이다.',
        '25일은 18일보다 다시 7일 뒤이다.',
      ],
      solution:
        '**풀이.** 7일이 지나면 같은 요일이 반복돼요. 따라서 18일도 수요일이고, 25일도 다시 **수요일**이에요.',
      visualize: [{ kind: 'calendarPattern', day: 11, interactive: false }],
    },
  ],
};
