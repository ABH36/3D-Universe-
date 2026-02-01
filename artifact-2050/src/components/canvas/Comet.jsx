import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../stores/use3DStore';

const Comet = () => {
  const cometRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.5;
    
    // Elliptical Orbit (Chapta gola)
    // Ye bohot door se aayega aur sun ke paas se jayega
    const x = Math.sin(t) * 80; // Door tak jayega
    const z = Math.cos(t) * 40; 
    const y = Math.sin(t * 2) * 20; // Upar neeche bhi hoga

    if (cometRef.current) {
        cometRef.current.position.set(x, y, z);
        
        // Agar Comet Focus mein hai, camera sath le chalo
        if (useStore.getState().focusTarget?.name === 'Halley Comet') {
            useStore.getState().focusTarget.position.copy(cometRef.current.position);
        }
    }
  });

  return (
    <group ref={cometRef} onClick={(e) => {
        e.stopPropagation();
        useStore.getState().setFocusTarget(new THREE.Vector3(), 'Halley Comet');
    }}>
      {/* The Rock */}
      <Sphere args={[0.5, 16, 16]}>
        <meshStandardMaterial color="#cccccc" emissive="#ffffff" emissiveIntensity={2} />
      </Sphere>

      {/* The Tail (Poonch) */}
      <Trail width={6} length={15} color="#00ffff" attenuation={(t) => t * t}>
         <mesh visible={false} />
      </Trail>
    </group>
  );
};

export default Comet;