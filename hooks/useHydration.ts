import { create } from 'zustand';

interface HydrationState {
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
}

export const useHydration = create<HydrationState>((set) => ({
  _hasHydrated: false,
  setHasHydrated: (value) => set({ _hasHydrated: value }),
})); 