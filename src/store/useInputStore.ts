import { create } from 'zustand'

interface InputState {
  boxId: string;
  lockedShape: string | null;
  lockedColor: string | null;
  lockedMaterial: string | null;
  
  // Actions
  setBoxId: (id: string) => void;
  toggleLockShape: (shape: string) => void;
  toggleLockColor: (color: string) => void;
  toggleLockMaterial: (material: string) => void;
  resetLocks: () => void;
}

export const useInputStore = create<InputState>((set) => ({
  boxId: '',
  lockedShape: null,
  lockedColor: null,
  lockedMaterial: null,

  setBoxId: (id) => set({ boxId: id }),
  
  toggleLockShape: (shape) => set((state) => ({ 
    lockedShape: state.lockedShape === shape ? null : shape 
  })),
  toggleLockColor: (color) => set((state) => ({ 
    lockedColor: state.lockedColor === color ? null : color 
  })),
  toggleLockMaterial: (material) => set((state) => ({ 
    lockedMaterial: state.lockedMaterial === material ? null : material 
  })),
  
  resetLocks: () => set({ lockedShape: null, lockedColor: null, lockedMaterial: null }),
}))