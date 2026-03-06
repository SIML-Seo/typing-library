'use client';

import { create } from 'zustand';

const initialUiState = {
  isSettingsPanelOpen: false,
  isResumeDialogOpen: false,
};

export interface UiStoreState {
  isSettingsPanelOpen: boolean;
  isResumeDialogOpen: boolean;
  setSettingsPanelOpen: (open: boolean) => void;
  setResumeDialogOpen: (open: boolean) => void;
  resetUiState: () => void;
}

export const useUiStore = create<UiStoreState>((set) => ({
  ...initialUiState,
  setSettingsPanelOpen: (open) => set({ isSettingsPanelOpen: open }),
  setResumeDialogOpen: (open) => set({ isResumeDialogOpen: open }),
  resetUiState: () => set(initialUiState),
}));
