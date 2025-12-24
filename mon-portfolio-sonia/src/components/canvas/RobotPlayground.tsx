import { Canvas } from "@react-three/fiber";
import { useGLTF, useAnimations, Center, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { Loader as CanvasLoader } from "../atoms";


const Robot = () => {
  const group = useRef<any>();
  const { scene, animations } = useGLTF("/robot/robot_playground.glb");
  const { actions } = useAnimations(animations, group);

  // Stylisation futuriste du robot
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material.transparent = true;
        child.material.opacity = 0.95;
        child.material.emissive?.set("#915EFF");
        child.material.emissiveIntensity = 0.6;
      }
    });
  }, [scene]);

  // Play animations
  useEffect(() => {
    if (!actions) return;
    Object.values(actions).forEach((action: any) => {
      action.reset().fadeIn(0.5).play();
    });
  }, [actions]);

  return (
    <Center>
      <group ref={group}>
        <primitive
          object={scene}
          // réduire légèrement la taille et centrer (éviter offset Z qui rapproche le modèle)
          scale={1.1}
          position={[0, -1.05, 0]}
          rotation={[0, 0, 0]}
        />
      </group>
    </Center>
  );
};

const RobotPlayground = () => {
  return (
    <Canvas
      // caméra rapprochée (valeur restaurée)
      camera={{ position: [0, 1.4, 4.5], fov: 35 }}
      className="absolute inset-0 z-20 pointer-events-auto"
      // stop propagation so any global contextmenu preventDefault doesn't block the native menu
      onContextMenu={(e) => { e.stopPropagation(); /* don't call preventDefault -> allow native menu */ }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
    >
      {/* background removed to keep canvas transparent so CSS layers show through */}

      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[0, 3, -2]} intensity={1.8} color="#915EFF" />

      <Suspense fallback={<CanvasLoader />}>
        <Robot />
      </Suspense>


      {/* Contrôles pour pouvoir tourner le modèle facilement */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        minDistance={2}
        maxDistance={6}
        // limiter légèrement l'inclinaison verticale si souhaité
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.6}
        // sensibilité (facultatif)
        rotateSpeed={0.8}
        zoomSpeed={0.8}
      />
    </Canvas>
  );
};

export default RobotPlayground;
