import { Cloud } from '@react-three/drei';
import { useStore } from '../../stores/use3DStore';
import * as THREE from 'three';

const Nebula = () => {
  return (
    <group 
        onClick={(e) => {
            e.stopPropagation();
            useStore.getState().setFocusTarget(new THREE.Vector3(), 'Nebula');
        }}
    >
      {/* Pink/Purple Cloud */}
      <Cloud 
        opacity={0.5} 
        speed={0.4} // Dheere dheere move karega
        width={20} 
        depth={5} 
        segments={20} 
        color="#ff00aa" 
      />
      
      {/* Cyan Tint Mix */}
      <Cloud 
        opacity={0.3} 
        speed={0.2} 
        width={15} 
        depth={10} 
        segments={10} 
        color="#00ffff" 
        position={[5, 5, 0]}
      />
      
      {/* Center Light */}
      <pointLight color="#ff00aa" intensity={2} distance={50} decay={2} />
    </group>
  );
};

export default Nebula;