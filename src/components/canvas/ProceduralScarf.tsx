'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStudioStore } from '@/store/useStudioStore';
import { createProceduralBotanicalTexture } from './ProceduralTexture';

interface ShaderUniforms {
  uTime: { value: number };
  uFrequency: { value: number };
  uSpeed: { value: number };
  uAmplitude: { value: number };
  uCursor: { value: THREE.Vector2 };
  uCursorIntensity: { value: number };
}

export function ProceduralScarf() {
  const meshRef = useRef<THREE.Mesh>(null);
  const activeScarf = useStudioStore((state) => state.activeScarf);
  const viewPreset = useStudioStore((state) => state.viewPreset);

  // 1. Procedural High-Tessellation PlaneGeometry (40x40 segments = ~1,680 vertices, optimized for ultra-smooth 60-120fps)
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(3.2, 3.2, 40, 40);
  }, []);

  // 2. Procedural Botanical Texture (Updates reactively on activeScarf change)
  const texture = useMemo(() => {
    return createProceduralBotanicalTexture(activeScarf);
  }, [activeScarf]);

  // 3. Shader Uniforms Reference for GPU Wave Deformation
  const uniformsRef = useRef<ShaderUniforms>({
    uTime: { value: 0 },
    uFrequency: { value: activeScarf.wavePhysics.baseFrequency },
    uSpeed: { value: activeScarf.wavePhysics.baseSpeed },
    uAmplitude: { value: activeScarf.wavePhysics.amplitude },
    uCursor: { value: new THREE.Vector2(0, 0) },
    uCursorIntensity: { value: 0 },
  });

  // Keep wave parameters synced with the active scarf's physics specification
  useEffect(() => {
    uniformsRef.current.uFrequency.value = activeScarf.wavePhysics.baseFrequency;
    uniformsRef.current.uSpeed.value = activeScarf.wavePhysics.baseSpeed;
    uniformsRef.current.uAmplitude.value = activeScarf.wavePhysics.amplitude;
  }, [activeScarf]);

  // 4. MeshPhysicalMaterial with Silk Organza / Habotai Optical Properties (Single Forward Pass)
  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      map: texture,
      side: THREE.DoubleSide,
      roughness: activeScarf.materialProps.roughness,
      metalness: activeScarf.materialProps.metalness,
      sheen: activeScarf.materialProps.sheen,
      sheenRoughness: activeScarf.materialProps.sheenRoughness,
      sheenColor: new THREE.Color(activeScarf.materialProps.sheenColor),
      clearcoat: activeScarf.materialProps.clearcoat,
      clearcoatRoughness: activeScarf.materialProps.clearcoatRoughness,
      transparent: true,
      opacity: 0.98,
    });

    // GPU Vertex Wave Deformation & Normal Shimmer Injection
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniformsRef.current.uTime;
      shader.uniforms.uFrequency = uniformsRef.current.uFrequency;
      shader.uniforms.uSpeed = uniformsRef.current.uSpeed;
      shader.uniforms.uAmplitude = uniformsRef.current.uAmplitude;
      shader.uniforms.uCursor = uniformsRef.current.uCursor;
      shader.uniforms.uCursorIntensity = uniformsRef.current.uCursorIntensity;

      // Inject Uniform Declarations into Vertex Shader
      shader.vertexShader = `
        uniform float uTime;
        uniform float uFrequency;
        uniform float uSpeed;
        uniform float uAmplitude;
        uniform vec2 uCursor;
        uniform float uCursorIntensity;
        ${shader.vertexShader}
      `;

      // Inject Compound Wave & Cursor Ripple Math before vertex calculation
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>

        // Primary compound breeze wave
        float wave1 = sin(position.x * uFrequency + uTime * uSpeed) * cos(position.y * (uFrequency * 0.9) + uTime * (uSpeed * 0.85));
        float wave2 = sin((position.x + position.y) * (uFrequency * 1.4) + uTime * 1.1) * 0.3;
        
        // Touch & cursor localized ripple
        float distToCursor = distance(position.xy, uCursor * 1.6);
        float ripple = sin(distToCursor * 10.0 - uTime * 7.0) * exp(-distToCursor * 2.2) * uCursorIntensity * 0.4;

        // Total cloth displacement
        float totalDisplacement = (wave1 + wave2) * uAmplitude + ripple;
        transformed.z += totalDisplacement;

        // Perturb normal for dynamic silk sheen reflections
        float dX = cos(position.x * uFrequency + uTime * uSpeed) * uFrequency * uAmplitude;
        float dY = -sin(position.y * (uFrequency * 0.9) + uTime * (uSpeed * 0.85)) * (uFrequency * 0.9) * uAmplitude;
        vNormal = normalize(vNormal + vec3(-dX, -dY, 1.0));
        `
      );
    };

    mat.needsUpdate = true;
    return mat;
  }, [texture, activeScarf]);

  // 5. Strict Independent Three.js Disposal Routines (Decoupled lifecycles)
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  // 6. Interactive Animation Loop: GPU Uniform Update & Camera Preset Lerp
  // Reads cursor from store via getState() to decouple mousemove from React component reconciliation
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Advance wave clock
    uniformsRef.current.uTime.value += delta;

    // Direct store read avoids triggering component re-renders on high-frequency cursor updates
    const cursor = useStudioStore.getState().cursor;
    const targetCursorX = cursor.x;
    const targetCursorY = cursor.y;

    uniformsRef.current.uCursor.value.x = THREE.MathUtils.lerp(
      uniformsRef.current.uCursor.value.x,
      targetCursorX,
      0.08
    );
    uniformsRef.current.uCursor.value.y = THREE.MathUtils.lerp(
      uniformsRef.current.uCursor.value.y,
      targetCursorY,
      0.08
    );

    // Decay or boost ripple intensity based on hover / interaction
    const targetIntensity = cursor.isHovering ? Math.max(0.4, cursor.intensity) : 0.0;
    uniformsRef.current.uCursorIntensity.value = THREE.MathUtils.lerp(
      uniformsRef.current.uCursorIntensity.value,
      targetIntensity,
      0.06
    );

    // Subtle breathing floating rotation
    const t = state.clock.getElapsedTime();
    if (viewPreset === 'full_spin') {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, Math.sin(t * 0.5) * 0.08, 0.05);
      meshRef.current.position.set(0, 0, 0);
    } else if (viewPreset === 'drape_detail') {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -0.25, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0.35, 0.05);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -0.05, 0.05);
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, -0.3, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0.2, 0.05);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, 0.6, 0.05);
    } else {
      // Default 'front' floating perspective
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, Math.sin(t * 0.7) * 0.04, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, Math.cos(t * 0.5) * 0.05, 0.05);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.05);
      meshRef.current.position.set(0, Math.sin(t * 0.9) * 0.05, 0);
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
    />
  );
}
