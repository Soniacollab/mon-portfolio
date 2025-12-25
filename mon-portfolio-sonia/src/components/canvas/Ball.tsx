// src/components/canvas/Ball.tsx
import React, { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Decal, Float, OrbitControls, Preload } from "@react-three/drei";
import { Loader as CanvasLoader } from "../atoms";

// fallback sûr — ton fichier dans backend/uploads
const FALLBACK_IMG = "http://localhost:5000/uploads/skills/icon-1766599236793.png";

type BallProps = { imgUrl?: string | null };

const BallInner: React.FC<{ texture: THREE.Texture | null }> = ({ texture }) => {
  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#fff8eb"
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        {texture && (
          <Decal
            position={[0, 0, 1]}
            rotation={[2 * Math.PI, 0, 6.25]}
            scale={1}
            map={texture}
          />
        )}
      </mesh>
    </Float>
  );
};

const Ball: React.FC<BallProps> = ({ imgUrl }) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let mounted = true;
    const loader = new THREE.TextureLoader();

    const tryLoad = (url: string, onFail?: () => void) => {
      loader.load(
        url,
        (tex) => {
          if (!mounted) return;
          tex.encoding = THREE.sRGBEncoding; // améliore rendu si PNG/SVG
          setTexture(tex);
        },
        undefined,
        (err) => {
          console.warn("Texture load failed:", url, err);
          if (onFail) onFail();
          else setTexture(null);
        }
      );
    };

    const urlToLoad = imgUrl && imgUrl !== "undefined" ? imgUrl : FALLBACK_IMG;
    tryLoad(urlToLoad, () => {
      // si échec, on essaye le fallback (une seule fois)
      if (urlToLoad !== FALLBACK_IMG) tryLoad(FALLBACK_IMG);
    });

    return () => {
      mounted = false;
      // pas besoin d'appeler loader.dispose() ici — three gère les textures via garbage collector,
      // mais si tu veux libérer explicitement : texture?.dispose()
    };
  }, [imgUrl]);

  return <BallInner texture={texture} />;
};

export const BallCanvas: React.FC<{ icon?: string | null }> = ({ icon }) => {
  return (
    <Canvas frameloop="demand" dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }}>
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enablePan={false} enableZoom={false} />
        <Ball imgUrl={icon ?? null} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default BallCanvas;
