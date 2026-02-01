import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../stores/use3DStore';
import gsap from 'gsap';

const UniverseControls = () => {
  const {
    // Universe States
    timeSpeed,
    setTimeSpeed,
    focusTarget,
    setFocusTarget,
    clearFocus,
    glitchIntensity,
    setGlitch,
    toggleUI,
    showUI
  } = useStore();
  
  const [isOpen, setIsOpen] = useState(true);

  // Planets List for Navigation
  const planets = [
    { name: 'Mercury', color: 'bg-gray-400' },
    { name: 'Venus', color: 'bg-yellow-600' },
    { name: 'Earth', color: 'bg-blue-500' },
    { name: 'Mars', color: 'bg-red-500' },
    { name: 'Jupiter', color: 'bg-orange-300' },
    { name: 'Saturn', color: 'bg-yellow-300' }
  ];

  if (!showUI) return null; // Cinematic Mode (Hide all UI)

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-4">
      
      {/* --- 1. MINIMIZE BUTTON --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-black/50 border border-white/20 text-white/50 hover:bg-white/10 flex items-center justify-center backdrop-blur-md transition-all"
      >
        {isOpen ? '▼' : '▲'}
      </button>

      {/* --- 2. MAIN DASHBOARD --- */}
      {isOpen && (
        <div className="p-5 bg-black/80 backdrop-blur-xl border border-blue-500/30 rounded-xl shadow-[0_0_30px_rgba(0,100,255,0.2)] w-80">
          
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-2">
            <h3 className="text-blue-300 text-sm font-mono font-bold tracking-widest">
              /// COSMOS_OS v2.0
            </h3>
            <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
          </div>
          
          <div className="space-y-6">
            
            {/* A. TIME WARP (Speed Control) */}
            <div>
                <div className="flex justify-between text-xs font-mono text-blue-200 mb-1">
                    <span>TIME_DILATION</span>
                    <span>{timeSpeed.toFixed(1)}x</span>
                </div>
                <input
                    type="range" min="0" max="10" step="0.1"
                    value={timeSpeed}
                    onChange={(e) => setTimeSpeed(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            {/* B. NAVIGATION GRID */}
            <div>
                <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">
                    Warp Destination
                </h4>
                <div className="grid grid-cols-3 gap-2">
                    <button 
                        onClick={() => clearFocus()}
                        className={`py-2 rounded text-[10px] font-mono border transition-all ${
                            !focusTarget 
                            ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_10px_rgba(0,100,255,0.5)]' 
                            : 'border-white/10 text-white/50 hover:bg-white/10'
                        }`}
                    >
                        UNIVERSE
                    </button>
                    {planets.map((p) => (
                        <button
                            key={p.name}
                            // Note: Position 0,0,0 bhej rahe hain kyunki SolarSystem.jsx update karega real position
                            onClick={() => setFocusTarget({ x:0, y:0, z:0 }, p.name)}
                            className={`py-2 rounded text-[10px] font-mono border transition-all flex items-center justify-center gap-2 ${
                                focusTarget?.name === p.name
                                ? 'bg-white/20 border-white text-white'
                                : 'border-white/10 text-white/50 hover:bg-white/10'
                            }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${p.color}`}></span>
                            {p.name.toUpperCase().substring(0, 3)}
                        </button>
                    ))}
                </div>
            </div>

            {/* C. BLACK HOLE GLITCH */}
            <div className="pt-4 border-t border-white/10">
                <label className="text-red-400/80 text-[10px] font-bold uppercase flex justify-between tracking-wider mb-1">
                    <span>Singularity Distortion</span>
                    <span>{glitchIntensity.toFixed(1)}</span>
                </label>
                <input
                    type="range" min="0" max="1" step="0.01"
                    value={glitchIntensity}
                    onChange={(e) => setGlitch(parseFloat(e.target.value))}
                    className="w-full accent-red-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            {/* FOOTER */}
            <div className="pt-2 flex justify-between text-[9px] text-white/20 font-mono">
                <span>COORDS: {focusTarget ? 'LOCKED' : 'DRIFTING'}</span>
                <span>SYS: STABLE</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default UniverseControls;