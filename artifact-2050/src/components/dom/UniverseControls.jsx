import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../stores/use3DStore';

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
    showUI
  } = useStore();
  
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  // ✅ UPDATED DESTINATION LIST (Includes Solar System + All New Objects)
  // Names MUST match the 'name' used in App.jsx and components
  const destinations = [
    // 1. Solar System
    { name: 'Mercury', color: 'bg-gray-400', type: 'PLANET' },
    { name: 'Venus', color: 'bg-yellow-600', type: 'PLANET' },
    { name: 'Earth', color: 'bg-blue-500', type: 'PLANET' },
    { name: 'Mars', color: 'bg-red-500', type: 'PLANET' },
    { name: 'Jupiter', color: 'bg-orange-300', type: 'PLANET' },
    { name: 'Saturn', color: 'bg-yellow-300', type: 'PLANET' },
    { name: 'Halley Comet', color: 'bg-white', type: 'COMET' },

    // 2. Deep Space
    { name: 'Betelgeuse (Red Supergiant)', color: 'bg-red-600', type: 'STAR' },
    { name: 'Binary Star System', color: 'bg-cyan-400', type: 'STAR' },
    { name: 'Pulsar', color: 'bg-blue-400', type: 'STAR' },
    { name: 'Nebula', color: 'bg-pink-500', type: 'NEBULA' },
    { name: 'Supermassive Black Hole', color: 'bg-purple-900', type: 'VOID' },

    // 3. Strange & Scary
    { name: 'Interstellar Wormhole', color: 'bg-indigo-500', type: 'MYSTERY' },
    { name: 'The Cosmic Eye', color: 'bg-red-500', type: 'MYSTERY' },
    { name: 'Rogue Planet (Frozen)', color: 'bg-gray-800', type: 'MYSTERY' },
    { name: 'Alien Dyson Sphere', color: 'bg-green-500', type: 'MYSTERY' },

    // 4. Multiverse
    { name: 'Andromeda Galaxy', color: 'bg-purple-500', type: 'GALAXY' },
    // Multiverse ke liye hum camera ko bas peeche bhej denge (Zoom out)
  ];

  if (!showUI) return null; // Cinematic Mode

  return (
    // ✅ NEW RESPONSIVE CONTAINER (Mobile Scrollable)
    <div className="
        fixed bottom-4 left-4 right-4 
        md:bottom-8 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 
        flex flex-col gap-2 z-50 max-w-[95vw] md:max-w-2xl
    ">
      
      {/* --- TOGGLE HEADER (Mobile Friendly) --- */}
      <div className="flex justify-between items-center bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-blue-300 text-xs font-mono font-bold tracking-widest">
               /// COSMOS_NAV v3.0
             </span>
        </div>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-white/50 hover:text-white text-xs font-mono uppercase border border-white/10 px-2 py-1 rounded"
        >
          {isOpen ? 'MINIMIZE' : 'EXPAND'}
        </button>
      </div>

      {/* --- MAIN DASHBOARD CONTENT --- */}
      {isOpen && (
        <div className="bg-black/80 backdrop-blur-xl border border-blue-500/30 rounded-xl p-4 shadow-[0_0_30px_rgba(0,100,255,0.15)] animate-in slide-in-from-bottom-5">
          
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* LEFT COLUMN: CONTROLS (Time & Glitch) */}
            <div className="flex md:flex-col gap-4 min-w-[150px] border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
                
                {/* Time Slider */}
                <div className="flex-1">
                    <div className="flex justify-between text-[10px] font-mono text-blue-200 mb-1">
                        <span>TIME DILATION</span>
                        <span>{timeSpeed.toFixed(1)}x</span>
                    </div>
                    <input
                        type="range" min="0" max="5" step="0.1"
                        value={timeSpeed}
                        onChange={(e) => setTimeSpeed(parseFloat(e.target.value))}
                        className="w-full accent-blue-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                {/* Glitch Slider */}
                <div className="flex-1">
                    <div className="flex justify-between text-[10px] font-mono text-red-300 mb-1">
                        <span>REALITY DISTORTION</span>
                        <span>{(glitchIntensity * 100).toFixed(0)}%</span>
                    </div>
                    <input
                        type="range" min="0" max="1" step="0.01"
                        value={glitchIntensity}
                        onChange={(e) => setGlitch(parseFloat(e.target.value))}
                        className="w-full accent-red-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>

            {/* RIGHT COLUMN: NAVIGATION (Scrollable Grid) */}
            <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-wider">
                        Warp Destinations
                    </h4>
                    <button 
                        onClick={() => clearFocus()}
                        className={`px-3 py-1 rounded text-[9px] font-mono border transition-all ${
                            !focusTarget 
                            ? 'bg-blue-600 border-blue-400 text-white' 
                            : 'border-white/20 text-white/50 hover:bg-white/10'
                        }`}
                    >
                        RESET VIEW
                    </button>
                </div>

                {/* SCROLLABLE BUTTONS LIST */}
                <div className="flex flex-wrap gap-2 max-h-[150px] md:max-h-[100px] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
                    {destinations.map((p) => (
                        <button
                            key={p.name}
                            onClick={() => setFocusTarget({ x:0, y:0, z:0 }, p.name)}
                            className={`
                                px-3 py-2 rounded-lg text-[10px] font-mono border transition-all flex items-center gap-2 flex-grow md:flex-grow-0
                                ${focusTarget?.name === p.name
                                ? 'bg-white/10 border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                                : 'bg-black/40 border-white/5 text-white/60 hover:bg-white/5 hover:border-white/20'}
                            `}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${p.color} shadow-[0_0_5px_currentColor]`}></span>
                            {p.name.split('(')[0].trim()} {/* Name ko short rakha display ke liye */}
                        </button>
                    ))}
                </div>
            </div>

          </div>
          
          {/* FOOTER INFO */}
          <div className="mt-3 pt-2 border-t border-white/5 flex justify-between text-[8px] text-white/30 font-mono tracking-widest">
            <span>CURRENT TARGET: {focusTarget ? focusTarget.name.toUpperCase() : 'DEEP SPACE'}</span>
            <span>STATUS: ONLINE</span>
          </div>

        </div>
      )}
    </div>
  );
};

export default UniverseControls;