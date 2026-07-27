"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BallCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import type { SkyTheme } from "@/lib/flight/loadout";
import type {
  BayDef,
  CoinDef,
  LandmarkDef,
} from "@/lib/flight-world/layout";
import { useFlightWorld } from "../store";

function sensorRadius(kind: LandmarkDef["kind"]) {
  if (kind === "secret") return 1.5;
  if (
    kind === "company" ||
    kind === "project" ||
    kind === "skill" ||
    kind === "hobby" ||
    kind === "achievement"
  ) {
    return 2.6;
  }
  return 2.4;
}

function BaySensor({ bay }: { bay: BayDef }) {
  const { setActiveBayId, clearBayIf } = useFlightWorld();
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
    };
  }, []);

  return (
    <RigidBody
      type="fixed"
      position={[bay.center[0], 2, bay.center[2]]}
      colliders={false}
      sensor
      onIntersectionEnter={() => {
        if (clearTimer.current) {
          clearTimeout(clearTimer.current);
          clearTimer.current = null;
        }
        setActiveBayId(bay.id);
      }}
      onIntersectionExit={() => {
        if (clearTimer.current) clearTimeout(clearTimer.current);
        clearTimer.current = setTimeout(() => {
          clearBayIf(bay.id);
          clearTimer.current = null;
        }, 2800);
      }}
    >
      <BallCollider args={[bay.sensorRadius]} />
    </RigidBody>
  );
}

function LandmarkBeacon({ landmark }: { landmark: LandmarkDef }) {
  const { discovered, discover, setNearId, clearNearIf, nearLandmark } =
    useFlightWorld();
  const isNear = nearLandmark?.id === landmark.id;
  const mesh = useRef<THREE.Mesh>(null);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const found = discovered.has(landmark.id);
  const radius = sensorRadius(landmark.kind);

  useEffect(() => {
    return () => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
    };
  }, []);

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
      colliders={false}
      sensor
      onIntersectionEnter={() => {
        if (clearTimer.current) {
          clearTimeout(clearTimer.current);
          clearTimer.current = null;
        }
        discover(landmark.id);
        setNearId(landmark.id);
      }}
      onIntersectionExit={() => {
        if (clearTimer.current) clearTimeout(clearTimer.current);
        clearTimer.current = setTimeout(() => {
          clearNearIf(landmark.id);
          clearTimer.current = null;
        }, 3200);
      }}
    >
      <BallCollider args={[radius]} />
      <mesh ref={mesh} frustumCulled={false}>
        {landmark.kind === "secret" ? (
          <octahedronGeometry args={[1.1, 0]} />
        ) : landmark.kind === "project" ? (
          <boxGeometry args={[1.6, 1.6, 1.6]} />
        ) : landmark.kind === "skill" ? (
          <dodecahedronGeometry args={[1.05, 0]} />
        ) : landmark.kind === "hobby" ? (
          <torusGeometry args={[0.85, 0.28, 8, 16]} />
        ) : landmark.kind === "achievement" ? (
          <cylinderGeometry args={[0.9, 0.9, 0.35, 6]} />
        ) : landmark.kind === "company" ? (
          <boxGeometry args={[1.5, 1.5, 1.5]} />
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
      {layout.bays.map((bay) => (
        <BaySensor key={bay.id} bay={bay} />
      ))}
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
