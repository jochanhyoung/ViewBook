'use client';
import { create } from 'zustand';
import type { VisualizationStep } from '@/types/visualization';

export interface Solution {
  problemText: string;
  topic: 'powerRule' | 'polynomialDerivative' | 'tangentLine' | 'definiteIntegral' | 'other';
  steps: VisualizationStep[];
  finalAnswer: string;
}

interface TextbookState {
  currentPageSlug: string;
  setPage: (slug: string) => void;

  // 시각화 무대
  stageSteps: VisualizationStep[] | null;
  stageIndex: number;
  setStage: (steps: VisualizationStep[]) => void;
  advanceStage: () => void;
  retreatStage: () => void;

  // 열려 있는 증명/풀이
  revealed: Record<string, number>; // blockId -> 단계 (0: 접힘, 1: 힌트, 2: 풀이)
  reveal: (blockId: string, level: number) => void;

  // AI 모드
  cameraOpen: boolean;
  setCameraOpen: (open: boolean) => void;
  aiStatus: 'idle' | 'capturing' | 'solving' | 'error';
  lastSolution: Solution | null;
  setAiStatus: (s: TextbookState['aiStatus']) => void;
  setLastSolution: (s: Solution | null) => void;
}

export const useTextbookStore = create<TextbookState>((set) => ({
  currentPageSlug: 'derivative-definition',
  setPage: (slug) => set({ currentPageSlug: slug }),

  stageSteps: null,
  stageIndex: 0,
  setStage: (steps) => set({ stageSteps: steps, stageIndex: 0 }),
  advanceStage: () =>
    set((state) =>
      state.stageSteps
        ? { stageIndex: Math.min(state.stageIndex + 1, state.stageSteps.length - 1) }
        : {}
    ),
  retreatStage: () =>
    set((state) => ({ stageIndex: Math.max(state.stageIndex - 1, 0) })),

  revealed: {},
  reveal: (blockId, level) =>
    set((state) => ({ revealed: { ...state.revealed, [blockId]: level } })),

  cameraOpen: false,
  setCameraOpen: (open) => set({ cameraOpen: open }),
  aiStatus: 'idle',
  lastSolution: null,
  setAiStatus: (s) => set({ aiStatus: s }),
  setLastSolution: (s) => set({ lastSolution: s }),
}));
