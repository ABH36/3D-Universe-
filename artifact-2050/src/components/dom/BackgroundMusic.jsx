import { useState, useRef, useEffect } from 'react';

const BackgroundMusic = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
    setHasInteracted(true);
  };

  // Browser Policy: User ke pehle click ke baad hi music baj sakta hai
  useEffect(() => {
    const handleFirstClick = () => {
      if (!hasInteracted && audioRef.current) {
        audioRef.current.volume = 0.4; // 40% Volume (Taaki loud na ho)
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
        setHasInteracted(true);
      }
    };

    window.addEventListener('click', handleFirstClick, { once: true });
    return () => window.removeEventListener('click', handleFirstClick);
  }, [hasInteracted]);

  return (
    <div className="fixed top-10 right-10 z-50">
      <audio ref={audioRef} loop src="/music/space_theme.mp3" />
      
      <button 
        onClick={(e) => {
            e.stopPropagation(); // Taaki click 3D scene pe register na ho
            toggleMusic();
        }}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full border 
          transition-all duration-300 backdrop-blur-md
          ${isPlaying 
            ? 'bg-blue-500/20 border-blue-400 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
            : 'bg-white/5 border-white/20 text-white/50 hover:bg-white/10'}
        `}
      >
        {/* Simple Icon Logic */}
        {isPlaying ? (
          <>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="font-mono text-xs tracking-widest">AUDIO ON</span>
          </>
        ) : (
          <span className="font-mono text-xs tracking-widest">AUDIO OFF</span>
        )}
      </button>
    </div>
  );
};

export default BackgroundMusic;