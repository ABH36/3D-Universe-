import { create } from 'zustand';
import * as THREE from 'three';

export const useStore = create((set) => ({
  // --- 1. NAVIGATION & EXPLORATION (Travel System) ---
  focusTarget: null, // Abhi kiske paas hain? (Earth, Mars, etc.)
  setFocusTarget: (position, name) => set({ focusTarget: { position, name } }),
  clearFocus: () => set({ focusTarget: null }),

  // --- 2. TIME CONTROL (God Mode) ---
  // Realism ke liye: Planets ki speed control karne ke liye
  timeSpeed: 1.0, 
  setTimeSpeed: (speed) => set({ timeSpeed: speed }),
  togglePause: () => set((state) => ({ timeSpeed: state.timeSpeed === 0 ? 1.0 : 0 })),

  // --- 3. CINEMATIC STATE (User ki file se inspired) ---
  // 'intro' (Start), 'exploration' (Free Roam), 'travel' (Warp Speed)
  currentPhase: 'exploration', 
  setPhase: (phase) => set({ currentPhase: phase }),

  // --- 4. VISUAL EFFECTS (Black Hole ke liye) ---
  glitchIntensity: 0, // 0 = Normal, 1 = Black Hole Chaos
  setGlitch: (intensity) => set({ glitchIntensity: intensity }),

  // --- 5. UI VISIBILITY ---
  showUI: true,
  toggleUI: () => set((state) => ({ showUI: !state.showUI })),
}));