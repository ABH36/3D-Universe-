import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Trail } from '@react-three/drei';
import * as THREE from 'three';

const SingleComet = ({ offset, speed, color, orbitSize, inclination }) => {
  const cometRef = useRef();
  
  useFrame((state) => {
    // Elliptical Orbit Logic
    const t = state.clock.elapsedTime * speed + offset;
    
    // X = Long distance (Door tak jayega)
    // Z = Short distance (Patla orbit)
    const x = Math.cos(t) * orbitSize.x; 
    const z = Math.sin(t) * orbitSize.z;
    
    // Speed variation (Kepler's Law: Sun ke paas tez, door dheere)
    // Hum simple rakhenge visual ke liye
    
    if (cometRef.current) {
        cometRef.current.position.set(x, 0, z);
    }
  });

  return (
    <group rotation={inclination}> {/* Orbit ko thoda tedha kiya */}
      <group ref={cometRef}>
        {/* The Rock */}
        <Sphere args={[0.8, 16, 16]}>
            <meshStandardMaterial 
                color={color} 
                emissive={color} 
                emissiveIntensity={2} 
                toneMapped={false} 
            />
        </Sphere>
        
        {/* The Tail */}
        <Trail 
            width={5} 
            length={12} 
            color={color} 
            attenuation={(t) => t * t}
        >
            <mesh visible={false} />
        </Trail>
      </group>
    </group>
  );
};

const Comets = () => {
  return (
    <group>
      {/* Comet 1: Halley's Style (Blue) - Standard Orbit */}
      <SingleComet 
        offset={0} 
        speed={0.3} 
        color="#00ffff" 
        orbitSize={{ x: 120, z: 30 }} // Lamba orbit
        inclination={[0.2, 0, 0.2]} 
      />

      {/* Comet 2: Rare Red Comet - Bohot bada orbit */}
      <SingleComet 
        offset={20} 
        speed={0.15} 
        color="#ff5500" 
        orbitSize={{ x: 200, z: 50 }} 
        inclination={[0.5, 0.5, 0]} 
      />

      {/* Comet 3: Fast White Comet - Cross orbit */}
      <SingleComet 
        offset={10} 
        speed={0.4} 
        color="#ffffff" 
        orbitSize={{ x: 90, z: 40 }} 
        inclination={[-0.3, 0, -0.5]} 
      />
    </group>
  );
};

export default Comets;