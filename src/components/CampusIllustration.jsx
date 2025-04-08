import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

function Building() {
  // Simple 3D building representation
  return (
    <mesh rotation={[0, Math.PI / 4, 0]} scale={[0.5, 0.5, 0.5]}>
      <boxGeometry args={[2, 3, 2]} />
      <meshStandardMaterial color="#334155" />
      <mesh position={[0, 1.8, 0]}>
        <coneGeometry args={[1.5, 1, 4]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      {/* Windows */}
      {[-0.5, 0.5].map((x) =>
        [-0.5, 0.5].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, y, 1.01]}>
            <planeGeometry args={[0.4, 0.4]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        ))
      )}
    </mesh>
  );
}

export default function CampusIllustration() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Building />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}