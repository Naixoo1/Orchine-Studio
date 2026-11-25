'use client';

import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Lightformer } from '@react-three/drei';
import { createFrontCardTexture } from '@/utils/signatureCardTexture';

export interface Card3DHandle {
  captureSnapshot: () => string | null;
  resetView: () => void;
  flipCard: () => void;
  spinOnce: () => void;
}

interface Card3DSceneProps {
  serialNumber?: string;
  isFlipped?: boolean;
  autoRotate?: boolean;
  onFlipChange?: (flipped: boolean) => void;
}

function createRoundedShape(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x, y + radius);
  shape.lineTo(x, y + height - radius);
  shape.quadraticCurveTo(x, y + height, x + radius, y + height);
  shape.lineTo(x + width - radius, y + height);
  shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  shape.lineTo(x + width, y + radius);
  shape.quadraticCurveTo(x + width, y, x + width - radius, y);
  shape.lineTo(x + radius, y);
  shape.quadraticCurveTo(x, y, x, y + radius);
  return shape;
}

function createRoundedCardGeometry(
  width: number,
  height: number,
  radius: number,
  thickness: number,
  bevelThickness: number,
  bevelSize: number
) {
  // Inner artwork face shape (slightly inset from bevel outer edge so gold bevel frames it)
  const faceShape = createRoundedShape(width, height, radius);

  const frontGeom = new THREE.ShapeGeometry(faceShape, 24);
  const posF = frontGeom.attributes.position;
  const uvsF = frontGeom.attributes.uv;
  for (let i = 0; i < posF.count; i++) {
    uvsF.setXY(
      i,
      (posF.getX(i) + width / 2) / width,
      (posF.getY(i) + height / 2) / height
    );
  }
  uvsF.needsUpdate = true;
  frontGeom.computeVertexNormals();

  const backGeom = new THREE.ShapeGeometry(faceShape, 24);
  const posB = backGeom.attributes.position;
  const uvsB = backGeom.attributes.uv;
  for (let i = 0; i < posB.count; i++) {
    uvsB.setXY(
      i,
      (posB.getX(i) + width / 2) / width,
      (posB.getY(i) + height / 2) / height
    );
  }
  uvsB.needsUpdate = true;
  backGeom.computeVertexNormals();

  // Extruded champagne-gold bevel frame spanning z in [-(thickness/2 + bevelThickness), +(thickness/2 + bevelThickness)]
  const rimGeom = new THREE.ExtrudeGeometry(faceShape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize,
    bevelThickness,
    curveSegments: 24,
  });
  rimGeom.translate(0, 0, -thickness / 2);
  rimGeom.computeVertexNormals();

  return { frontGeom, backGeom, rimGeom };
}

function CardMesh({
  serialNumber,
  isFlipped,
  autoRotate,
  spinPulse,
  onFlipChange,
}: {
  serialNumber: string;
  isFlipped: boolean;
  autoRotate: boolean;
  spinPulse: number;
  onFlipChange?: (flipped: boolean) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const spinOffsetRef = useRef(0);
  const spinCurrentRef = useRef(0);
  const prevAutoRotateRef = useRef(autoRotate);
  const { pointer } = useThree();

  const [frontTex, setFrontTex] = useState<THREE.Texture | null>(null);
  const [backTex, setBackTex] = useState<THREE.Texture | null>(null);

  // Exact 5403 x 3634 card aspect ratio (~1.4868)
  const width = 3.5;
  const height = 2.354;
  const radius = 0.16;
  const thickness = 0.026;
  const bevelThickness = 0.006;
  const bevelSize = 0.014;
  // Place artwork faces cleanly outside the bevel's z extent (thickness/2 + bevelThickness = 0.019)
  const faceZOffset = thickness / 2 + bevelThickness + 0.0025;

  const geometries = useMemo(() => {
    return createRoundedCardGeometry(
      width,
      height,
      radius,
      thickness,
      bevelThickness,
      bevelSize
    );
  }, []);

  // Load back artwork (reference/back_sn.png)
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let isMounted = true;
    let loadedBack: THREE.Texture | null = null;

    loader.load('/passport/eco-passport-back.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = 8;
      tex.needsUpdate = true;
      if (isMounted) {
        loadedBack = tex;
        setBackTex(tex);
      } else {
        tex.dispose();
      }
    });

    return () => {
      isMounted = false;
      if (loadedBack) loadedBack.dispose();
    };
  }, []);

  // Generate front texture (reference/front_sc.png with dynamic #0000+ serial)
  useEffect(() => {
    let isMounted = true;
    let activeTex: THREE.Texture | null = null;

    createFrontCardTexture(serialNumber)
      .then((tex) => {
        if (isMounted) {
          activeTex = tex;
          setFrontTex(tex);
        } else {
          tex.dispose();
        }
      })
      .catch(() => {
        const loader = new THREE.TextureLoader();
        loader.load('/passport/eco-passport-front.png', (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.needsUpdate = true;
          if (isMounted) {
            activeTex = tex;
            setFrontTex(tex);
          } else {
            tex.dispose();
          }
        });
      });

    return () => {
      isMounted = false;
      if (activeTex) activeTex.dispose();
    };
  }, [serialNumber]);

  // Dispose geometries on unmount
  useEffect(() => {
    return () => {
      geometries.frontGeom.dispose();
      geometries.backGeom.dispose();
      geometries.rimGeom.dispose();
    };
  }, [geometries]);

  // Trigger a smooth 360-degree spin whenever spinPulse increments
  useEffect(() => {
    if (spinPulse > 0) {
      spinOffsetRef.current += Math.PI * 2;
    }
  }, [spinPulse]);

  // Normalize Y rotation when leaving autoRotate so flip takes shortest path
  useEffect(() => {
    if (prevAutoRotateRef.current && !autoRotate && groupRef.current) {
      const twoPi = Math.PI * 2;
      const normalized = ((groupRef.current.rotation.y % twoPi) + twoPi) % twoPi;
      groupRef.current.rotation.y = normalized > Math.PI ? normalized - twoPi : normalized;
      spinOffsetRef.current = 0;
      spinCurrentRef.current = 0;
    }
    prevAutoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const prevSpin = spinCurrentRef.current;
    spinCurrentRef.current = THREE.MathUtils.lerp(
      spinCurrentRef.current,
      spinOffsetRef.current,
      Math.min(1, delta * 4.5)
    );
    const spinDelta = spinCurrentRef.current - prevSpin;

    if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.55 + spinDelta;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.04;
    } else {
      const baseRotY = isFlipped ? Math.PI : 0;
      const targetRotY = baseRotY + spinOffsetRef.current;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        Math.min(1, delta * 5.5)
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        Math.sin(state.clock.elapsedTime * 1.0) * 0.025,
        0.05
      );
    }

    if (pointLightRef.current) {
      pointLightRef.current.position.x = THREE.MathUtils.lerp(
        pointLightRef.current.position.x,
        pointer.x * 3.2,
        0.08
      );
      pointLightRef.current.position.y = THREE.MathUtils.lerp(
        pointLightRef.current.position.y,
        pointer.y * 2.2,
        0.08
      );
      const isFacingBack = Math.cos(groupRef.current.rotation.y) < 0;
      pointLightRef.current.position.z = isFacingBack ? -3.0 : 3.0;
    }
  });

  return (
    <group>
      {/* Cursor-Tracking Specular Light */}
      <pointLight
        ref={pointLightRef}
        position={[0, 0, 3.0]}
        intensity={0.9}
        color="#FFFDF8"
        distance={12}
        decay={0}
      />

      {/* Main 3D Card Group */}
      <group
        ref={groupRef}
        onClick={() => {
          if (onFlipChange) onFlipChange(!isFlipped);
        }}
        rotation={[0.02, 0, -0.02]}
      >
        {/* Thin Champagne-Gold Bevel Rim */}
        <mesh geometry={geometries.rimGeom}>
          <meshStandardMaterial
            color="#F6DB92"
            metalness={0.85}
            roughness={0.18}
            envMapIntensity={1.15}
          />
        </mesh>

        {/* Front Rounded Face (+Z, outside bevel) */}
        <mesh
          key={`front-${frontTex?.uuid ?? 'loading'}`}
          geometry={geometries.frontGeom}
          position={[0, 0, faceZOffset]}
        >
          {frontTex ? (
            <meshPhysicalMaterial
              map={frontTex}
              emissiveMap={frontTex}
              emissive="#ffffff"
              emissiveIntensity={0.48}
              metalness={0}
              roughness={0.35}
              clearcoat={0.25}
              clearcoatRoughness={0.2}
              envMapIntensity={0.5}
            />
          ) : (
            <meshStandardMaterial color="#8E75D6" roughness={0.35} />
          )}
        </mesh>

        {/* Back Rounded Face (-Z, outside bevel) */}
        <mesh
          key={`back-${backTex?.uuid ?? 'loading'}`}
          geometry={geometries.backGeom}
          position={[0, 0, -faceZOffset]}
          rotation={[0, Math.PI, 0]}
        >
          {backTex ? (
            <meshPhysicalMaterial
              map={backTex}
              emissiveMap={backTex}
              emissive="#ffffff"
              emissiveIntensity={0.48}
              metalness={0}
              roughness={0.35}
              clearcoat={0.25}
              clearcoatRoughness={0.2}
              envMapIntensity={0.5}
            />
          ) : (
            <meshStandardMaterial color="#8E75D6" roughness={0.35} />
          )}
        </mesh>
      </group>
    </group>
  );
}

export const HolographicCard3DScene = forwardRef<Card3DHandle, Card3DSceneProps>(
  function HolographicCard3DScene(
    { serialNumber = '#0000', isFlipped = false, autoRotate = true, onFlipChange },
    ref
  ) {
    const controlsRef = useRef<any>(null);
    const glRef = useRef<THREE.WebGLRenderer | null>(null);
    const [spinPulse, setSpinPulse] = useState(0);

    useImperativeHandle(ref, () => ({
      captureSnapshot: () => {
        if (!glRef.current) return null;
        try {
          return glRef.current.domElement.toDataURL('image/png');
        } catch {
          return null;
        }
      },
      resetView: () => {
        if (controlsRef.current) {
          controlsRef.current.reset();
        }
      },
      flipCard: () => {
        if (onFlipChange) onFlipChange(!isFlipped);
      },
      spinOnce: () => {
        setSpinPulse((c) => c + 1);
      },
    }));

    return (
      <div className="w-full h-full relative">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 4.35], fov: 42 }}
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
          }}
          onCreated={({ gl }) => {
            glRef.current = gl;
          }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Bright Studio Softbox Environment */}
          <Environment resolution={256}>
            <group rotation={[-Math.PI / 4, 0, 0]}>
              <Lightformer
                form="rect"
                intensity={3.5}
                color="#ffffff"
                scale={[10, 6, 1]}
                position={[0, 4, 5]}
              />
              <Lightformer
                form="rect"
                intensity={2.4}
                color="#fff6fd"
                scale={[8, 6, 1]}
                position={[-5, 0, 4]}
                rotation={[0, Math.PI / 3, 0]}
              />
              <Lightformer
                form="rect"
                intensity={2.4}
                color="#f3ecff"
                scale={[8, 6, 1]}
                position={[5, 0, 4]}
                rotation={[0, -Math.PI / 3, 0]}
              />
              <Lightformer
                form="rect"
                intensity={3.0}
                color="#ffffff"
                scale={[10, 6, 1]}
                position={[0, 2, -6]}
                rotation={[0, Math.PI, 0]}
              />
            </group>
          </Environment>

          {/* Bright Balanced Studio Lighting */}
          <ambientLight intensity={1.55} color="#FFFFFF" />
          <hemisphereLight args={['#FFFFFF', '#EDE6FF', 1.1]} />
          <directionalLight position={[3, 4, 5]} intensity={1.3} color="#FFFFFF" />
          <directionalLight position={[-4, -2, 4]} intensity={0.95} color="#FFF8FC" />
          <directionalLight position={[0, 3, -5]} intensity={1.3} color="#FFFFFF" />

          <CardMesh
            serialNumber={serialNumber}
            isFlipped={isFlipped}
            autoRotate={autoRotate}
            spinPulse={spinPulse}
            onFlipChange={onFlipChange}
          />

          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.06}
            minDistance={2.5}
            maxDistance={6.8}
            enablePan={false}
          />
        </Canvas>
      </div>
    );
  }
);
