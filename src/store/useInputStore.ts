import { create } from 'zustand'

interface InputState {
  boxId: string;
  selectedTags: string[];
  lockedTags: string[];
  
  setBoxId: (id: string) => void;
  toggleTag: (tag: string) => void;
  toggleLock: (tag: string) => void;
  clearUnlockedTags: () => void;
}

export const useInputStore = create<InputState>((set) => ({
  boxId: '',
  selectedTags: [],
  lockedTags: [],

  setBoxId: (id) => set({ boxId: id }),
  
  toggleTag: (tag) => set((state) => ({
    selectedTags: state.selectedTags.includes(tag)
      ? state.selectedTags.filter(t => t !== tag)
      : [...state.selectedTags, tag]
  })),

  toggleLock: (tag) => set((state) => {
    const isLocked = state.lockedTags.includes(tag)
    const newSelected = isLocked 
      ? state.selectedTags 
      : Array.from(new Set([...state.selectedTags, tag]))

    return {
      lockedTags: isLocked
        ? state.lockedTags.filter(t => t !== tag)
        : [...state.lockedTags, tag],
      selectedTags: newSelected
    }
  }),

  clearUnlockedTags: () => set((state) => ({
    selectedTags: [...state.lockedTags]
  }))
}))