import { useStore } from '../../stores/use3DStore';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const RoguePlanet = () => {
  return (
    <group onClick={(e) => {
        e.stopPropagation();
        useStore.getState().setFocusTarget(new THREE.Vector3(), 'Rogue Planet (Frozen)');
    }}>
      {/* Dark, Frozen Surface */}
      <Sphere args={[6, 64, 64]}>
        <meshStandardMaterial 
            color="#1a1a1a" // Almost black
            roughness={0.9} // Dull surface
            emissive="#001133" // Thoda sa blue glow (Ice)
            emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Mysterious Aura */}
      <Sphere args={[7, 32, 32]}>
         <meshBasicMaterial color="#000000" transparent opacity={0.5} side={THREE.BackSide} />
      </Sphere>
      
      {/* Ghostly Marker text (Optional visual hint) */}
      <pointLight color="#0044ff" distance={30} intensity={2} />
    </group>
  );
};

export default RoguePlanet;