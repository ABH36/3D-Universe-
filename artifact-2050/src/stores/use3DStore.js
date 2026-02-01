import { create } from 'zustand';

export const useStore = create((set) => ({
  // --- 1. NAVIGATION (Travel System) ---
  focusTarget: null, // Abhi hum kahan hain? (null = Universe View)
  
  setFocusTarget: (position, name) => set({ focusTarget: { position, name } }),
  clearFocus: () => set({ focusTarget: null }),

  // --- 2. TIME CONTROL (God Mode) ---
  // Ye missing tha isliye crash hua (timeSpeed.toFixed error)
  timeSpeed: 1.0, 
  setTimeSpeed: (speed) => set({ timeSpeed: speed }),
  
  togglePause: () => set((state) => ({ timeSpeed: state.timeSpeed === 0 ? 1.0 : 0 })),

  // --- 3. VISUAL EFFECTS (Black Hole Glitch) ---
  // Ye bhi missing ho sakta hai
  glitchIntensity: 0, 
  setGlitch: (intensity) => set({ glitchIntensity: intensity }),

  // --- 4. UI VISIBILITY ---
  showUI: true,
  toggleUI: () => set((state) => ({ showUI: !state.showUI })),
}));