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

  // 1. Single Base Rectangular Shawl Mesh (2.1 x 3.4 matching real fringed scarf proportions)
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(2.1, 3.4, 48, 72);
  }, []);

  // 2. Synchronous Ivory Woven Fallback Texture (Instant paint while WebP loads)
  const fallbackTexture = useMemo(() => {
    return createProceduralBotanicalTexture(activeScarf);
  }, [activeScarf]);

  // 3. Shared Open-Weave Normal Map & Tassel Fringe Alpha Map (Created once per mount)
  const sharedMaps = useMemo(() => {
    const loader = new THREE.TextureLoader();

    const normalMap = loader.load('/textures/weave-normal.webp', (tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(12, 18);
      tex.needsUpdate = true;
    });
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(12, 18);

    const alphaMap = loader.load('/textures/scarf-alpha.webp', (tex) => {
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
    });
    alphaMap.wrapS = THREE.ClampToEdgeWrapping;
    alphaMap.wrapT = THREE.ClampToEdgeWrapping;

    return { normalMap, alphaMap };
  }, []);

  // 4. Shader Uniforms Reference for GPU Wave & Drape Deformation
  const uniformsRef = useRef<ShaderUniforms>({
    uTime: { value: 0 },
    uFrequency: { value: activeScarf.wavePhysics.baseFrequency },
    uSpeed: { value: activeScarf.wavePhysics.baseSpeed },
    uAmplitude: { value: activeScarf.wavePhysics.amplitude },
    uCursor: { value: new THREE.Vector2(0, 0) },
    uCursorIntensity: { value: 0 },
  });

  // Sync wave parameters with active scarf physics specification
  useEffect(() => {
    uniformsRef.current.uFrequency.value = activeScarf.wavePhysics.baseFrequency;
    uniformsRef.current.uSpeed.value = activeScarf.wavePhysics.baseSpeed;
    uniformsRef.current.uAmplitude.value = activeScarf.wavePhysics.amplitude;
  }, [activeScarf]);

  // 5. MeshPhysicalMaterial with Open-Weave Cotton-Silk Optics & Tassel Alpha Cutout
  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      map: fallbackTexture,
      normalMap: sharedMaps.normalMap,
      normalScale: new THREE.Vector2(0.32, 0.32),
      alphaMap: sharedMaps.alphaMap,
      alphaTest: 0.38,
      transparent: false,
      side: THREE.DoubleSide,
      roughness: activeScarf.materialProps.roughness,
      metalness: activeScarf.materialProps.metalness,
      sheen: activeScarf.materialProps.sheen,
      sheenRoughness: activeScarf.materialProps.sheenRoughness,
      sheenColor: new THREE.Color(activeScarf.materialProps.sheenColor),
      clearcoat: activeScarf.materialProps.clearcoat,
      clearcoatRoughness: activeScarf.materialProps.clearcoatRoughness,
    });

    // GPU Vertex Drape Pleats, Wind Waves, & Cursor Ripple Injection
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniformsRef.current.uTime;
      shader.uniforms.uFrequency = uniformsRef.current.uFrequency;
      shader.uniforms.uSpeed = uniformsRef.current.uSpeed;
      shader.uniforms.uAmplitude = uniformsRef.current.uAmplitude;
      shader.uniforms.uCursor = uniformsRef.current.uCursor;
      shader.uniforms.uCursorIntensity = uniformsRef.current.uCursorIntensity;

      shader.vertexShader = `
        uniform float uTime;
        uniform float uFrequency;
        uniform float uSpeed;
        uniform float uAmplitude;
        uniform vec2 uCursor;
        uniform float uCursorIntensity;
        ${shader.vertexShader}
      `;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>

        // Natural hanging vertical shawl pleats that deepen toward the fringed hem
        float drapeFactor = smoothstep(1.7, -1.7, position.y);
        float pleat = sin(position.x * 5.2 + sin(position.y * 1.1) * 0.55) * 0.085 * drapeFactor;
        float hangArch = -pow(abs(position.x) * 0.48, 2.0) * 0.14;

        // Primary compound breeze wave (stronger toward free lower half)
        float flutterWeight = 0.45 + 0.55 * drapeFactor;
        float wave1 = sin(position.x * uFrequency + uTime * uSpeed) * cos(position.y * (uFrequency * 0.85) + uTime * (uSpeed * 0.85));
        float wave2 = sin((position.x + position.y) * (uFrequency * 1.35) + uTime * 1.05) * 0.28;

        // Touch & cursor localized ripple
        float distToCursor = distance(position.xy, vec2(uCursor.x * 1.05, uCursor.y * 1.7));
        float ripple = sin(distToCursor * 9.5 - uTime * 7.0) * exp(-distToCursor * 2.1) * uCursorIntensity * 0.36;

        float totalDisplacement = (wave1 + wave2) * (uAmplitude * 0.72) * flutterWeight + ripple + pleat + hangArch;
        transformed.z += totalDisplacement;

        // Perturb vertex normal for realistic fold & weave shading
        float dPleatX = cos(position.x * 5.2 + sin(position.y * 1.1) * 0.55) * 5.2 * 0.085 * drapeFactor;
        float dWaveX = cos(position.x * uFrequency + uTime * uSpeed) * uFrequency * (uAmplitude * 0.72) * flutterWeight;
        float dWaveY = -sin(position.y * (uFrequency * 0.85) + uTime * (uSpeed * 0.85)) * (uFrequency * 0.85) * (uAmplitude * 0.72) * flutterWeight;
        vNormal = normalize(vNormal + vec3(-(dPleatX + dWaveX), -dWaveY, 1.0));
        `
      );
    };

    mat.needsUpdate = true;
    return mat;
  }, [fallbackTexture, sharedMaps, activeScarf]);

  // 6. Async Photo-Derived WebP Color Map Loader with Clean Disposal
  useEffect(() => {
    let cancelled = false;
    let loadedTexture: THREE.Texture | null = null;
    const loader = new THREE.TextureLoader();

    loader.load(activeScarf.texturePath, (tex) => {
      if (cancelled) {
        tex.dispose();
        return;
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;

      loadedTexture = tex;
      material.map = tex;
      material.needsUpdate = true;
    });

    return () => {
      cancelled = true;
      if (loadedTexture) {
        loadedTexture.dispose();
      }
    };
  }, [activeScarf.texturePath, material]);

  // 7. Strict Independent Disposal Routines on Unmount
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
      fallbackTexture.dispose();
    };
  }, [fallbackTexture]);

  useEffect(() => {
    return () => {
      sharedMaps.normalMap.dispose();
      sharedMaps.alphaMap.dispose();
    };
  }, [sharedMaps]);

  // 8. Interactive Animation Loop: GPU Uniform Update & Preset Pose Interpolation
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    uniformsRef.current.uTime.value += delta;

    const cursor = useStudioStore.getState().cursor;
    uniformsRef.current.uCursor.value.x = THREE.MathUtils.lerp(
      uniformsRef.current.uCursor.value.x,
      cursor.x,
      0.08
    );
    uniformsRef.current.uCursor.value.y = THREE.MathUtils.lerp(
      uniformsRef.current.uCursor.value.y,
      cursor.y,
      0.08
    );

    const targetIntensity = cursor.isHovering ? Math.max(0.4, cursor.intensity) : 0.0;
    uniformsRef.current.uCursorIntensity.value = THREE.MathUtils.lerp(
      uniformsRef.current.uCursorIntensity.value,
      targetIntensity,
      0.06
    );

    const t = state.clock.getElapsedTime();
    if (viewPreset === 'full_spin') {
      meshRef.current.rotation.y += delta * 0.45;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, Math.sin(t * 0.5) * 0.06, 0.05);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.05);
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.05);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, 0, 0.05);
    } else if (viewPreset === 'drape_detail') {
      // Focus toward lower fringed hem & weave details
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -0.22, 0.06);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0.36, 0.06);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -0.04, 0.06);
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, -0.15, 0.06);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0.55, 0.06);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, 1.05, 0.06);
    } else if (viewPreset === 'top_down') {
      // Tilted flat-lay angle showcasing full botanical pattern and fringes
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -0.68, 0.06);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0.08, 0.06);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.06);
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, 0.06);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0.05, 0.06);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, 0.25, 0.06);
    } else {
      // Default 'front' hanging drape presentation (lifted slightly above bottom preset bar)
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, Math.sin(t * 0.7) * 0.03, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, Math.cos(t * 0.45) * 0.09, 0.05);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.05);
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, 0.06);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0.16 + Math.sin(t * 0.9) * 0.04, 0.06);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, 0, 0.06);
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
