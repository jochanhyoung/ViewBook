'use client';
import { useMemo, useState } from 'react';

interface CalendarPatternProps {
  day: number;
  interactive?: boolean;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export function CalendarPattern({ day, interactive = true }: CalendarPatternProps) {
  const [selectedDay, setSelectedDay] = useState(day);
  const firstWeekday = 2;

  const cells = useMemo(() => {
    const items: Array<{ day: number; weekday: number; selected: boolean }> = [];
    for (let current = 1; current <= 31; current += 1) {
      items.push({
        day: current,
        weekday: (firstWeekday + current - 1) % 7,
        selected: current === selectedDay,
      });
    }
    return items;
  }, [selectedDay]);

  const selectedWeekday = WEEKDAYS[(firstWeekday + selectedDay - 1) % 7];
  const samePatternDays = cells.filter((cell) => cell.weekday === (firstWeekday + selectedDay - 1) % 7).map((cell) => cell.day);

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '18px', padding: '20px', overflowY: 'auto' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '6px' }}>
          {WEEKDAYS.map((weekday) => (
            <div key={weekday} style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', padding: '6px 0' }}>
              {weekday}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {Array.from({ length: firstWeekday }).map((_, index) => (
            <div key={`blank-${index}`} />
          ))}
          {cells.map((cell) => {
            const samePattern = cell.weekday === (firstWeekday + selectedDay - 1) % 7;
            return (
              <button
                key={cell.day}
                type="button"
                onClick={() => {
                  if (interactive) setSelectedDay(cell.day);
                }}
                style={{
                  height: '42px',
                  border: '1px solid var(--color-bg-surface)',
                  background: cell.selected ? 'var(--color-accent)' : samePattern ? 'var(--color-accent-bg)' : 'var(--color-bg-elevated)',
                  color: cell.selected ? 'var(--color-accent-fg)' : 'var(--color-text)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  cursor: interactive ? 'pointer' : 'default',
                }}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
          <span>{interactive ? '날짜 선택' : '문제 날짜'}</span>
          {interactive ? (
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)' }}>
              <span>날짜</span>
              <input
                type="number"
                min={1}
                max={31}
                value={selectedDay}
                onChange={(e) => setSelectedDay(Math.min(31, Math.max(1, Number(e.target.value) || 1)))}
                style={{ width: '68px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '4px 6px' }}
              />
            </label>
          ) : (
            <span>{selectedDay}일</span>
          )}
        </div>
        {interactive ? (
          <input type="range" min={1} max={31} step={1} value={selectedDay} onChange={(e) => setSelectedDay(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-accent)' }} />
        ) : (
          <div style={{ height: '1px', background: 'var(--color-bg-surface)', width: '100%' }} />
        )}
      </div>

      <div style={{ width: '100%', maxWidth: '420px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-bg-surface)', borderRadius: '8px', padding: '14px 18px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>규칙 강조</div>
        <div style={{ fontSize: '14px', color: 'var(--color-text)', lineHeight: 1.7 }}>
          {selectedDay}일은 <strong>{selectedWeekday}요일</strong>이고, 같은 열에 있는 날짜는 모두 7일 차이입니다: {samePatternDays.join(', ')}
        </div>
      </div>
    </div>
  );
}
