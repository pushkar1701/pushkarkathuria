"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import type { SkyTheme } from "@/lib/flight/loadout";
import type { CoinDef, LandmarkDef } from "@/lib/flight-world/layout";
import { useFlightWorld } from "../store";

function LandmarkBeacon({ landmark }: { landmark: LandmarkDef }) {
  const { discovered, discover, setNearId, nearLandmark } = useFlightWorld();
  const isNear = nearLandmark?.id === landmark.id;
  const mesh = useRef<THREE.Mesh>(null);
  const found = discovered.has(landmark.id);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const mat = mesh.current.material as THREE.MeshStandardMaterial;
    if (isNear) {
      mat.emissiveIntensity = 1 + Math.sin(clock.elapsedTime * 4) * 0.5;
      mesh.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3) * 0.08);
    } else {
      mat.emissiveIntensity = found ? 0.25 : 0.7;
      mesh.current.scale.setScalar(1);
    }
  });

  return (
    <RigidBody
      type="fixed"
      position={landmark.position}
      colliders="ball"
      sensor
      onIntersectionEnter={() => {
        discover(landmark.id);
        setNearId(landmark.id);
      }}
      onIntersectionExit={() => {
        if (nearLandmark?.id === landmark.id) setNearId(null);
      }}
    >
      <mesh ref={mesh}>
        {landmark.kind === "secret" ? (
          <octahedronGeometry args={[1.1, 0]} />
        ) : landmark.kind === "project" ? (
          <boxGeometry args={[1.6, 1.6, 1.6]} />
        ) : (
          <icosahedronGeometry args={[1.15, 0]} />
        )}
        <meshStandardMaterial
          color={landmark.accent}
          emissive={landmark.accent}
          emissiveIntensity={found ? 0.25 : 0.7}
          transparent
          opacity={found ? 0.45 : 0.95}
        />
      </mesh>
    </RigidBody>
  );
}

function Coin({
  coin,
  color,
  taken,
  onTake,
}: {
  coin: CoinDef;
  color: string;
  taken: boolean;
  onTake: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 2;
  });
  if (taken) return null;

  return (
    <RigidBody
      type="fixed"
      position={coin.position}
      colliders="ball"
      sensor
      onIntersectionEnter={onTake}
    >
      <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.14, 8, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </mesh>
    </RigidBody>
  );
}

export function Sensors({ sky }: { sky: SkyTheme }) {
  const { layout, collected, collect } = useFlightWorld();
  return (
    <group>
      {layout.landmarks.map((l) => (
        <LandmarkBeacon key={l.id} landmark={l} />
      ))}
      {layout.coins.map((c) => (
        <Coin
          key={c.id}
          coin={c}
          color={sky.brandSecondary}
          taken={collected.has(c.id)}
          onTake={() => collect(c.id)}
        />
      ))}
    </group>
  );
}
