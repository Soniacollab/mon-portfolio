import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Génère la texture du canvas
const generateTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 2;
  const context = canvas.getContext("2d")!;
  context.fillStyle = "white";
  context.fillRect(0, 1, 2, 1);
  return new THREE.CanvasTexture(canvas);
};

// Composant pour les lumières animées
const AnimatedLights = () => {
  const light1 = useRef<THREE.PointLight>(null!);
  const light2 = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (light1.current) {
      light1.current.position.set(
        Math.sin(time * 0.6) * 9,
        Math.sin(time * 0.7) * 9 + 6,
        Math.sin(time * 0.8) * 9
      );
      light1.current.rotation.x = time;
      light1.current.rotation.z = time;
    }

    if (light2.current) {
      const t2 = time + 10000;
      light2.current.position.set(
        Math.sin(t2 * 0.6) * 9,
        Math.sin(t2 * 0.7) * 9 + 6,
        Math.sin(t2 * 0.8) * 9
      );
      light2.current.rotation.x = t2;
      light2.current.rotation.z = t2;
    }
  });

  // Fonction pour créer la sphère texturée si nécessaire
  const texture = generateTexture();

  return (
    <>
      <ambientLight intensity={3} color={0x111122} />
      <pointLight ref={light1} intensity={200} distance={20} castShadow>
        <mesh>
          <sphereGeometry args={[0.3, 12, 6]} />
          <meshBasicMaterial color={0x0088ff} />
        </mesh>
        <mesh>
          <sphereGeometry args={[2, 32, 8]} />
          <meshPhongMaterial
            alphaMap={texture}
            alphaTest={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </pointLight>

      <pointLight ref={light2} intensity={200} distance={20} castShadow>
        <mesh>
          <sphereGeometry args={[0.3, 12, 6]} />
          <meshBasicMaterial color={0xff8888} />
        </mesh>
        <mesh>
          <sphereGeometry args={[2, 32, 8]} />
          <meshPhongMaterial
            alphaMap={texture}
            alphaTest={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </pointLight>
    </>
  );
};

// Cube central avec texture
const ShadowBox = () => {
  const texture = generateTexture();
  return (
    <mesh position={[0, 10, 0]} receiveShadow>
      <boxGeometry args={[30, 30, 30]} />
      <meshPhongMaterial
        color={0xa0adaf}
        side={THREE.BackSide}
        shininess={10}
        alphaMap={texture}
        alphaTest={0.5}
      />
    </mesh>
  );
};

// Canvas principal
const LightsCanvas = () => {
  return (
    <Canvas shadows camera={{ position: [0, 10, 40], fov: 45 }}>
      <OrbitControls target={[0, 10, 0]} />
      <AnimatedLights />
      <ShadowBox />
    </Canvas>
  );
};

export default LightsCanvas;
