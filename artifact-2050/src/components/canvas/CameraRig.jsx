import { useThree, useFrame } from '@react-three/fiber';
import { useStore } from '../../stores/use3DStore';
import * as THREE from 'three';

export const FixedCameraRig = () => {
  const { focusTarget } = useStore(); // Store se Target lo (Jupiter, Mars, etc.)
  const { camera, controls } = useThree(); // R3F Camera & Controls

  useFrame((state, delta) => {
    // Agar koi Planet focus mein hai, toh wahan Fly karo
    if (focusTarget && controls) {
      // 1. Target Position (Planet kahan hai)
      const targetPos = focusTarget.position;
      
      // 2. Camera Destination (Planet se thoda door aur upar)
      // Hum planet ke size ke hisaab se distance adjust kar sakte hain, abhi fixed 10 rakha hai
      const offset = 10; 
      const camDestination = new THREE.Vector3(
        targetPos.x + offset, 
        targetPos.y + 5, 
        targetPos.z + offset
      );

      // 3. Smooth Fly Animation (Lerp)
      // 0.05 = Speed (Jitna kam, utna smooth)
      camera.position.lerp(camDestination, 0.05);
      controls.target.lerp(targetPos, 0.05);
      
      // Update controls to avoid jitter
      controls.update();
    }
  });
  
  return null; // Ye component kuch render nahi karta, bas camera chalata hai
};