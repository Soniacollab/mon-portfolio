import { Suspense, FC, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Preload } from "@react-three/drei";
import CanvasLoader from "../layout/Loader";

const TheFutureModel: FC<{ modelPos: [number, number, number]; rotationY: number }> = ({
  modelPos,
  rotationY,
}) => {
  const model = useGLTF("/the_future/thefuture.glb") as any;

  return (
    <primitive
      object={model.scene}
      scale={0.43} // taille parfaite déjà définie
      position={modelPos}
      rotation={[0, rotationY, 0]} // on applique l'orientation calculée pour regarder la caméra
    />
  );
};

const TheFutureCanvas: FC = () => {
  // --- Réglages rapides (modifie ces valeurs si besoin) ---
  const MODEL_X = 4; // position horizontale du modèle dans l'espace
  const MODEL_Y = -1.5; // vertical
  const MODEL_Z = 0; // profondeur
  const CAMERA_X_OFFSET = -10; // camera.x = model.x + CAMERA_X_OFFSET (valeur négative => caméra à gauche du modèle)
  const CAMERA_Y = 3;
  const CAMERA_Z = 12;
  // -------------------------------------------------------

  const modelPos = useMemo(() => [MODEL_X, MODEL_Y, MODEL_Z] as [number, number, number], [
    MODEL_X,
    MODEL_Y,
    MODEL_Z,
  ]);

  // Position calculée de la caméra (à gauche du modèle si CAMERA_X_OFFSET < 0)
  const cameraPos = useMemo(
    () => [MODEL_X + CAMERA_X_OFFSET, CAMERA_Y, CAMERA_Z] as [number, number, number],
    [MODEL_X, CAMERA_X_OFFSET, CAMERA_Y, CAMERA_Z]
  );

  // Calcul de rotation Y pour que le modèle "regarde" la caméra :
  // angle = atan2( deltaX, deltaZ )
  const rotationY = useMemo(() => {
    const dx = cameraPos[0] - modelPos[0];
    const dz = cameraPos[2] - modelPos[2];
    return Math.atan2(dx, dz);
  }, [cameraPos, modelPos]);

  return (
    <Canvas
      shadows
      style={{ width: "100%", height: "100%" }} // canvas full hero
      camera={{ position: cameraPos, fov: 35 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <hemisphereLight intensity={0.15} groundColor="black" />

        {/* Orbit controls — target = model position pour rotation propre */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          target={modelPos}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />

        {/* Le modèle (orienté pour regarder la caméra) */}
        <TheFutureModel modelPos={modelPos} rotationY={rotationY} />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default TheFutureCanvas;
