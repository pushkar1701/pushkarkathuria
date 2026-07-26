"use client";

import { RigidBody, CuboidCollider } from "@react-three/rapier";
import type { SkyTheme } from "@/lib/flight/loadout";

/** Static island: ground, cliffs shelves, ramps, pier. */
export function Island({ sky }: { sky: SkyTheme }) {
  return (
    <group>
      {/* Main ground — brighter so the island reads */}
      <RigidBody type="fixed" colliders={false} position={[0, -0.5, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[90, 1, 90]} />
          <meshStandardMaterial color="#2a3148" roughness={0.92} metalness={0.05} />
        </mesh>
        <CuboidCollider args={[45, 0.5, 45]} />
      </RigidBody>

      {/* Center plaza */}
      <RigidBody type="fixed" position={[0, 0.25, 4]}>
        <mesh>
          <boxGeometry args={[16, 0.5, 16]} />
          <meshStandardMaterial color={sky.brandSecondary} roughness={0.7} emissive={sky.brandSecondary} emissiveIntensity={0.15} />
        </mesh>
      </RigidBody>

      {/* Company shelf */}
      <RigidBody type="fixed" position={[-10, 0.4, -12]}>
        <mesh>
          <boxGeometry args={[28, 0.8, 18]} />
          <meshStandardMaterial color="#1a1828" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Projects pier */}
      <RigidBody type="fixed" position={[26, 0.35, -2]}>
        <mesh>
          <boxGeometry args={[18, 0.7, 22]} />
          <meshStandardMaterial color="#182028" roughness={0.85} />
        </mesh>
      </RigidBody>

      {/* Ramp */}
      <RigidBody type="fixed" position={[2, 1.2, 14]} rotation={[0, 0, -0.35]}>
        <mesh>
          <boxGeometry args={[4, 0.4, 10]} />
          <meshStandardMaterial color={sky.brand} roughness={0.7} />
        </mesh>
      </RigidBody>

      {/* Circuit humps */}
      <RigidBody type="fixed" position={[10, 0.8, 6]}>
        <mesh>
          <boxGeometry args={[8, 1.6, 3]} />
          <meshStandardMaterial color="#222038" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-18, 1, 2]}>
        <mesh>
          <boxGeometry args={[6, 2, 4]} />
          <meshStandardMaterial color="#221818" />
        </mesh>
      </RigidBody>

      {/* Secret under ledge (negative Y pocket accessible via fall-around) */}
      <RigidBody type="fixed" position={[-6, -2.2, 2]}>
        <mesh>
          <boxGeometry args={[8, 0.5, 6]} />
          <meshStandardMaterial color="#0e1a14" />
        </mesh>
      </RigidBody>

      {/* Walls / billboards */}
      <RigidBody type="fixed" position={[0, 3, -22]}>
        <mesh>
          <boxGeometry args={[20, 5, 0.6]} />
          <meshStandardMaterial
            color={sky.brandSecondary}
            emissive={sky.brandSecondary}
            emissiveIntensity={0.25}
            transparent
            opacity={0.55}
          />
        </mesh>
      </RigidBody>

      {/* Hangar blocks */}
      <RigidBody type="fixed" position={[-4, 1.5, 24]}>
        <mesh>
          <boxGeometry args={[3, 3, 3]} />
          <meshStandardMaterial color="#2a2438" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[4, 1.2, 24]}>
        <mesh>
          <boxGeometry args={[2.4, 2.4, 2.4]} />
          <meshStandardMaterial color="#2a2438" />
        </mesh>
      </RigidBody>
    </group>
  );
}
