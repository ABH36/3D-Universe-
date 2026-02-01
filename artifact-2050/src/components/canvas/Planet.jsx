import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../stores/use3DStore'; // 1. STORE CONNECTED

const Planet = () => {
  const earthRef = useRef();
  const cloudsRef = useRef();
  
  // 2. GET TIME SPEED FROM STORE (God Mode)
  const { timeSpeed } = useStore();

  // 3. LOAD LOCAL TEXTURES (Jo aapne download kiye)
  const [colorMap, normalMap, specularMap, cloudsMap] = useTexture([
    '/textures/earth_daymap.jpg',
    '/textures/earth_normal.jpg',
    '/textures/earth_specular.jpg',
    '/textures/earth_clouds.png'
  ]);

  useFrame((state, delta) => {
    // 4. DYNAMIC ROTATION (Time Speed ke hisaab se)
    // Ab agar aap slider badhaoge, Earth bhi tez ghumegi!
    
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05 * timeSpeed; 
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.07 * timeSpeed; 
    }
  });

  return (
    <group scale={[2.5, 2.5, 2.5]} rotation={[0, 0, 0.4]}> {/* Tilted Axis */}
      
      {/* LAYER 1: REAL EARTH SURFACE */}
      <Sphere ref={earthRef} args={[1, 64, 64]}>
        <meshPhongMaterial 
          map={colorMap} 
          normalMap={normalMap} 
          specularMap={specularMap} 
          shininess={15} 
        />
      </Sphere>

      {/* LAYER 2: MOVING CLOUDS */}
      <Sphere ref={cloudsRef} args={[1.02, 64, 64]}> 
        <meshStandardMaterial 
          map={cloudsMap} 
          transparent 
          opacity={0.8} 
          depthWrite={false} 
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* LAYER 3: ATMOSPHERE GLOW */}
      <Sphere args={[1.2, 64, 64]}>
        <meshPhysicalMaterial
          color="#4ca6ff"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          roughness={0.7}
        />
      </Sphere>
    </group>
  );
};

export default Planet;