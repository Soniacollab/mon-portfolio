import { Canvas } from "@react-three/fiber";
import { Stars, Sphere } from "@react-three/drei";

const Planet = ({ position, size }: { position: [number, number, number]; size: number }) => {
  return (
    <Sphere args={[size, 64, 64]} position={position}>
      <meshStandardMaterial
        color="#6b5cff"
        roughness={1}
        metalness={0.2}
        emissive="#2a1f6f"
        emissiveIntensity={0.2}
      />
    </Sphere>
  );
};

const SpaceBackground = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      className="absolute inset-0 -z-10"
    >
      {/* Lights */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Stars */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Planètes */}
      <Planet position={[-6, -2, -10]} size={2.5} />
      <Planet position={[7, 3, -15]} size={1.8} />
    </Canvas>
  );
};

export default SpaceBackground;
