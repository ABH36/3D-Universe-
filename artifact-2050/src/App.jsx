import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import { EffectComposer, Bloom, Vignette, Noise, ToneMapping } from '@react-three/postprocessing'
import { OrbitControls, Html, Stars, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei' // ✅ NEW IMPORTS

// --- CORE COMPONENTS ---
import SolarSystem from './components/canvas/SolarSystem'
import UniverseBackground from './components/canvas/UniverseBackground'
import Sun from './components/canvas/Sun'
import CameraManager from './components/canvas/CameraManager'
import UniverseControls from './components/dom/UniverseControls' 
import BackgroundMusic from './components/dom/BackgroundMusic' 
import { useStore } from './stores/use3DStore'

// --- OBJECTS ---
import BlackHole from './components/canvas/BlackHole'
import AsteroidBelt from './components/canvas/AsteroidBelt'
import Pulsar from './components/canvas/Pulsar'
import Nebula from './components/canvas/Nebula'
import Comets from './components/canvas/Comets'
import Andromeda from './components/canvas/Andromeda'
import Betelgeuse from './components/canvas/Betelgeuse'
import BinarySystem from './components/canvas/BinarySystem'
import Wormhole from './components/canvas/Wormhole'
import RoguePlanet from './components/canvas/RoguePlanet'
import CosmicEye from './components/canvas/CosmicEye'
import DysonSphere from './components/canvas/DysonSphere'

// --- MULTIVERSE ---
import Multiverse from './components/canvas/Multiverse'
import LocalBubble from './components/canvas/LocalBubble'

// --- RESPONSIVE HELPER ---
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
};

const Scene = ({ isMobile }) => {
  return (
    <>
      <UniverseBackground />
      
      {/* ✅ OPTIMIZATION 1: Stars count kam kiya (Quality vs Performance) */}
      <Stars 
        radius={100000} 
        depth={100} 
        count={isMobile ? 3000 : 20000} // Pehle 50,000 tha, ab 20,000 (More than enough)
        factor={isMobile ? 6 : 10} 
        saturation={0} 
        fade 
        speed={1} 
      />

      {/* ✅ OPTIMIZATION 2: Adaptive Performance Tools */}
      {/* Jab camera hilega, quality thodi low hogi taaki FPS high rahe */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      
      {/* ZONE 1: HOME */}
      <group>
        <Sun />
        <SolarSystem />
        {/* Mobile par AsteroidBelt hata diya agar heavy ho */}
        {!isMobile && <AsteroidBelt />} 
        <Comets />
      </group>

      {/* ZONE 2: DEEP SPACE */}
      <group position={[-2000, 200, -2000]} scale={[50, 50, 50]} onClick={(e) => { e.stopPropagation(); useStore.getState().setFocusTarget({ x: -2000, y: 200, z: -2000 }, 'Supermassive Black Hole'); }}>
        <BlackHole />
      </group>

      <group position={[1500, -500, -1000]} scale={[20, 20, 20]}>
         <Pulsar />
      </group>

      <group position={[0, 1000, -1000]} scale={[40, 40, 40]}>
         <Nebula />
      </group>

      <group position={[-800, 400, 1000]} scale={[30, 30, 30]}>
         <Betelgeuse />
      </group>

      <group position={[2500, 0, 1000]} scale={[10, 10, 10]}>
         <BinarySystem />
      </group>

      {/* ZONE 3: STRANGE */}
      <group position={[-3000, 500, 3000]} scale={[25, 25, 25]}>
         <Wormhole />
      </group>

      <group position={[4000, -1000, -4000]} scale={[15, 15, 15]}>
         <RoguePlanet />
      </group>

      <group position={[0, 8000, 0]} scale={[100, 100, 100]} rotation={[Math.PI/2, 0, 0]}>
         <CosmicEye />
      </group>

      <group position={[-5000, -2000, 5000]} scale={[20, 20, 20]}>
         <DysonSphere />
      </group>

      {/* ZONE 4: MULTIVERSE */}
      <group position={[4000, 2000, 4000]} scale={[10, 10, 10]}>
         <Andromeda />
      </group>
      <LocalBubble />
      <Multiverse />

      <CameraManager /> 
      <ambientLight intensity={0.05} />
    </>
  )
}

// ✅ OPTIMIZATION 3: Effects Tuning
const Effects = ({ isMobile }) => {
  return (
    // 'multisampling={0}' sabse zaruri hai lag hatane ke liye
    <EffectComposer disableNormalPass multisampling={0}>
      <Bloom 
        luminanceThreshold={0.8} 
        mipmapBlur 
        intensity={1.2} // Thoda kam kiya
        radius={0.5} 
      />
      {/* Noise mobile pe band kar diya kyunki wo heavy hota hai */}
      {!isMobile && <Noise opacity={0.04} />}
      <Vignette eskil={false} offset={0.3} darkness={1.1} />
      <ToneMapping brightness={1.0} exposure={1.0} />
    </EffectComposer>
  )
}

export default function App() {
  const isMobile = useIsMobile();

  return (
    <>
      <Canvas
        // ✅ OPTIMIZATION 4: Performance Props
        dpr={isMobile ? [1, 1] : [1, 1.5]} // Mobile pe 1x, Desktop pe max 1.5x (2x mat karna)
        gl={{ 
            powerPreference: "high-performance", 
            antialias: false, // ✅ Post-processing ke sath antialias OFF rakho, performance badhegi
            stencil: false,
            depth: true
        }} 
        camera={{ position: [0, 100, 200], fov: 50, far: 2000000 }} 
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000000' }}
        performance={{ min: 0.5 }} // Frame rate girne par quality apne aap kam hogi
      >
        <Suspense fallback={<Html center><div className="text-white font-mono animate-pulse tracking-widest text-center px-4">LOADING UNIVERSE...</div></Html>}>
          <Scene isMobile={isMobile} />
          <Effects isMobile={isMobile} />
          
          <OrbitControls 
  makeDefault 
  enableDamping={true} 
  dampingFactor={0.04}   
  
  // Mobile par speed TEZ (1.0), Desktop par NORMAL (0.5)
  rotateSpeed={isMobile ? 1.0 : 0.5} 
  
  // Mobile Zoom (Pinch) sensitivity
  zoomSpeed={isMobile ? 1.2 : 0.8}
  
  enableZoom={true} 
  enablePan={false} // ⚠️ IMPORTANT: Mobile par Pan (2 finger drag) band rakho taaki Zoom aasaani se ho
  
  maxDistance={500000}   
  minDistance={5}        
/>
        
        </Suspense>
      </Canvas>
      
      <div className="fixed top-6 left-6 md:top-10 md:left-10 pointer-events-none z-10">
        <h1 className="text-3xl md:text-5xl text-white font-black tracking-tighter mix-blend-difference">
          OMNIVERSE
        </h1>
        <p className="text-blue-200 font-mono text-[10px] md:text-xs mt-1 md:mt-2 tracking-[0.2em] md:tracking-[0.3em]">
          EXPLORING THE INFINITE
        </p>
      </div>

      <UniverseControls />
      <BackgroundMusic />
    </>
  )
}