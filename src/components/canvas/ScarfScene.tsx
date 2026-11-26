'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useStudioStore } from '@/store/useStudioStore';
import { ProceduralScarf } from './ProceduralScarf';

function InteractiveStudioLights() {
  const activeScarf = useStudioStore((state) => state.activeScarf);
  const pointLightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (pointLightRef.current) {
      const cursor = useStudioStore.getState().cursor;
      pointLightRef.current.position.x = THREE.MathUtils.lerp(
        pointLightRef.current.position.x,
        cursor.x * 2.5,
        0.1
      );
      pointLightRef.current.position.y = THREE.MathUtils.lerp(
        pointLightRef.current.position.y,
        cursor.y * 2.5,
        0.1
      );
      pointLightRef.current.intensity = cursor.isHovering ? 0.85 : 0.4;
    }
  });

  return (
    <>
      {/* Ambient Fill (Calibrated for cream/ivory open-weave textiles) */}
      <ambientLight intensity={0.48} />

      {/* Key Warm Directional Light */}
      <directionalLight
        position={[3.5, 4.5, 3.8]}
        intensity={1.05}
        color="#FFF9ED"
      />

      {/* Cool Fill Light */}
      <directionalLight
        position={[-3.5, -2.0, 2.5]}
        intensity={0.42}
        color="#D6E3F0"
      />

      {/* Backlight / Grazing Rim Light for Woven Fringe & Fold Relief */}
      <directionalLight
        position={[0, -3.5, -3.0]}
        intensity={0.68}
        color="#FFFFFF"
      />

      {/* Reactive Specular Cursor Spotlight */}
      <pointLight
        ref={pointLightRef}
        position={[0, 0, 2.4]}
        intensity={0.4}
        color={activeScarf.palette.sheen}
        distance={6}
        decay={2}
      />
    </>
  );
}

function CameraRig() {
  const zoomState = useStudioStore((state) => state.zoomState);

  useFrame((state) => {
    const is3DZoomed = zoomState.isZoomed && zoomState.target === '3d_scarf';
    const targetZ = is3DZoomed ? 5.5 / (zoomState.level || 1.8) : 5.5;
    const targetFov = is3DZoomed ? 28 : 42;

    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.08);
    if ('fov' in state.camera) {
      const persCamera = state.camera as THREE.PerspectiveCamera;
      persCamera.fov = THREE.MathUtils.lerp(persCamera.fov, targetFov, 0.08);
      persCamera.updateProjectionMatrix();
    }
  });

  return null;
}

export function ScarfScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const heroMode = useStudioStore((state) => state.heroMode);
  const setCursor = useStudioStore((state) => state.setCursor);
  const prevCoordRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  // Pause R3F Canvas rendering when scrolled out of view or when film mode is active (0% GPU idle)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shouldRender = isInView && heroMode === 'canvas';

  // Handle pointer movement and calculate interaction velocity / intensity
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      const now = performance.now();
      const dt = Math.max(16, now - prevCoordRef.current.time);
      const dx = x - prevCoordRef.current.x;
      const dy = y - prevCoordRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy) / (dt / 1000);
      const intensity = Math.min(1.2, speed * 0.4);

      prevCoordRef.current = { x, y, time: now };
      setCursor({ x, y, isHovering: true, intensity });
    },
    [setCursor]
  );

  const handlePointerLeave = useCallback(() => {
    setCursor({ x: 0, y: 0, isHovering: false, intensity: 0 });
  }, [setCursor]);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      className="relative w-full h-full min-h-[480px] md:min-h-[620px] cursor-grab active:cursor-grabbing select-none touch-none"
    >
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42, near: 0.1, far: 30 }}
        dpr={[1, 1.5]}
        frameloop={shouldRender ? 'always' : 'never'}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.94,
        }}
      >
        <InteractiveStudioLights />
        <CameraRig />
        <ProceduralScarf />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.75}
          minPolarAngle={Math.PI / 2.35}
          maxAzimuthAngle={Math.PI / 4}
          minAzimuthAngle={-Math.PI / 4}
          dampingFactor={0.06}
        />
      </Canvas>
    </div>
  );
}
