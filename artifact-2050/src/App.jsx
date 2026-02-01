import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { EffectComposer, Bloom, Vignette, Noise, ToneMapping } from '@react-three/postprocessing'
import { OrbitControls, Html, Stars } from '@react-three/drei'

// ✅ 1. IMPORT ALL NEW COMPONENTS
import SolarSystem from './components/canvas/SolarSystem'
import UniverseBackground from './components/canvas/UniverseBackground'
import Sun from './components/canvas/Sun'
import BlackHole from './components/canvas/BlackHole'
import { FixedCameraRig } from './components/canvas/FixedCameraRig' // Hamara naya Pilot
import UniverseControls from './components/dom/UniverseControls' // Hamara naya Dashboard
import { useStore } from './stores/use3DStore'

const Scene = () => {
  return (
    <>
      {/* 1. BACKGROUND LAYER */}
      <UniverseBackground />
      <Stars radius={300} depth={60} count={10000} factor={4} saturation={0} fade speed={1} />
      
      {/* 2. STARS & PLANETS */}
      <Sun />
      <SolarSystem />
      
      {/* 3. DEEP SPACE OBJECTS */}
      {/* Black Hole Clickable Area */}
      <group 
        position={[-100, 10, -100]} 
        scale={[10, 10, 10]} 
        onClick={(e) => {
          e.stopPropagation();
          useStore.getState().setFocusTarget({ x: -100, y: 10, z: -100 }, 'Black Hole');
        }}
      >
        <BlackHole />
      </group>

      {/* 4. THE PILOT (Camera Logic) */}
      <FixedCameraRig />
      
      {/* 5. LIGHTING */}
      <ambientLight intensity={0.05} />
    </>
  )
}

const Effects = () => {
  return (
    <EffectComposer disableNormalPass>
      <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.6} />
      <Noise opacity={0.05} />
      <Vignette eskil={false} offset={0.3} darkness={1.2} />
      <ToneMapping brightness={1.1} exposure={1.0} />
    </EffectComposer>
  )
}

export default function App() {
  return (
    <>
      <Canvas
        gl={{ powerPreference: "high-performance", antialias: true }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 40, 60], fov: 45 }} 
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000000' }}
      >
        <Suspense fallback={<Html center><div className="text-white font-mono animate-pulse">INITIALIZING COSMOS...</div></Html>}>
          <Scene />
          <Effects />
          {/* Orbit Controls manual looking ke liye, lekin FixedCameraRig isse override karega jab hum travel karenge */}
          <OrbitControls enableZoom={true} enablePan={true} maxDistance={500} />
        </Suspense>
      </Canvas>
      
      {/* --- UI LAYER --- */}
      
      {/* 1. Title */}
      <div className="fixed top-10 left-10 pointer-events-none z-10">
        <h1 className="text-5xl text-white font-black tracking-tighter mix-blend-difference">
          COSMOS
        </h1>
        <p className="text-blue-200 font-mono text-xs mt-2 tracking-[0.3em]">
          INTERACTIVE SIMULATION
        </p>
      </div>

      {/* 2. The Dashboard (New Controller) */}
      <UniverseControls />
    </>
  )
}