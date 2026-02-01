import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '../../stores/use3DStore';
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';

const CameraManager = () => {
  const { focusTarget } = useStore(); 
  const { camera, controls } = useThree(); 
  
  // State to track if Intro is running
  const [introFinished, setIntroFinished] = useState(false);
  const isFlying = useRef(false);
  const prevTargetName = useRef(null);

  // --- 1. INITIAL SETUP (Intro Start Position) ---
  useEffect(() => {
    // Start from extreme distance (Multiverse View)
    camera.position.set(0, 20000, 40000); 
    
    // Intro ke dauran user control disable kar do
    if (controls) {
        controls.enabled = false;
        controls.target.set(0, 0, 0);
    }
  }, [camera, controls]);

  // --- 2. FOCUS CHANGE LOGIC (For clicking planets) ---
  useEffect(() => {
    if (introFinished && focusTarget?.name !== prevTargetName.current) {
      isFlying.current = true;
      prevTargetName.current = focusTarget?.name;
      if (controls) controls.autoRotate = false;
    }
  }, [focusTarget, introFinished, controls]);

  useFrame((state, delta) => {
    if (!controls) return;

    // ===========================
    // 🎥 PHASE 1: CINEMATIC INTRO
    // ===========================
    if (!introFinished) {
        // Destination: Home View (Solar System)
        const homePos = new THREE.Vector3(0, 100, 200);
        
        // Fly Logic (Fast at first, slow at end)
        // 2.5 is speed multiplier
        camera.position.lerp(homePos, delta * 2.5);
        controls.target.lerp(new THREE.Vector3(0, 0, 0), delta * 2.5);

        // Check Arrival (Jab hum paas pahunch jayein)
        if (camera.position.distanceTo(homePos) < 10) {
            setIntroFinished(true); // Intro Khatam
            controls.enabled = true; // User ko control dedo
            controls.maxDistance = 500000; // Limit khol do
        }
        
        controls.update();
        return; // Intro chal raha hai toh niche ka code mat chalao
    }

    // ===========================
    // 🕹️ PHASE 2: USER CONTROL
    // ===========================

    // --- SCENARIO A: PLANET FOCUS ---
    if (focusTarget) {
      const targetPos = focusTarget.position;
      controls.target.lerp(targetPos, delta * 3);

      if (isFlying.current) {
        const offset = 10;
        const destination = new THREE.Vector3(
          targetPos.x + offset, 
          targetPos.y + 6, 
          targetPos.z + offset
        );

        camera.position.lerp(destination, delta * 2);

        if (camera.position.distanceTo(destination) < 1.5) {
          isFlying.current = false; 
        }
      }
    } 
    
    // --- SCENARIO B: UNIVERSE VIEW ---
    else {
      controls.target.lerp(new THREE.Vector3(0, 0, 0), delta * 2);
      
      // Agar user bohot andar ghus gaya hai aur wapas Universe click karta hai
      if (camera.position.length() < 50) {
         camera.position.lerp(new THREE.Vector3(30, 40, 60), delta);
      }
      
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
    }

    controls.update();
  });

  return null;
};

export default CameraManager;