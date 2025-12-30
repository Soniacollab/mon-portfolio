// Keep typing-safe: avoid `any` casts below by narrowing types
import { Canvas } from "@react-three/fiber";
import { useGLTF, useAnimations, Center, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { Loader as CanvasLoader } from "../atoms";
import { Group, Object3D, Material } from "three";


const Robot = () => {
  const group = useRef<Group | null>(null);
  const { scene, animations } = useGLTF("/robot/robot_playground.glb");
  const { actions } = useAnimations(animations, group);

  // Stylisation futuriste du robot
  useEffect(() => {
    scene.traverse((child: Object3D) => {
      // Some children are Mesh with material — guard via duck-typing
      const maybeMesh = child as unknown as { isMesh?: boolean; material?: Material | { emissive?: { set?: (v: string) => void }; [key: string]: unknown } };
      if (maybeMesh.isMesh && maybeMesh.material) {
        const mat = maybeMesh.material as { transparent?: boolean; opacity?: number; emissive?: { set?: (v: string) => void }; emissiveIntensity?: number };
        mat.transparent = true;
        mat.opacity = 0.95;
        mat.emissive?.set?.("#915EFF");
        mat.emissiveIntensity = 0.6;
      }
    });
  }, [scene]);

  // Lancer les animations
  useEffect(() => {
    if (!actions) return;
    Object.values(actions).forEach((action) => {
      if (!action) return;
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
      className="absolute inset-0 z-20 pointer-events-auto opacity-95"
      // stopper la propagation pour que tout preventDefault global du contextmenu ne bloque pas le menu natif
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
