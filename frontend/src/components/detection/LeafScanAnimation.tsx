import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function LeafMesh() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.8
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#22C55E"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.1}
          emissive="#166534"
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  )
}

function ScanLine() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 1.2
    }
  })

  return (
    <mesh ref={ref}>
      <planeGeometry args={[3, 0.04]} />
      <meshBasicMaterial color="#A3E635" transparent opacity={0.8} />
    </mesh>
  )
}

function Particles() {
  const count = 40
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 4
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4
  }
  const ref = useRef<THREE.Points>(null)
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.05
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#A3E635" transparent opacity={0.6} />
    </points>
  )
}

export default function LeafScanAnimation() {
  return (
    <div style={{ width: '100%', height: '220px' }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#22C55E" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#A3E635" />
        <LeafMesh />
        <ScanLine />
        <Particles />
      </Canvas>
    </div>
  )
}
