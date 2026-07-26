"use client";

import {
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";
import { useRef } from "react";
import type { SkyTheme } from "@/lib/flight/loadout";
import type { BouncePadDef, CrateDef } from "@/lib/flight-world/layout";
import { useFlightWorld } from "../store";

function Smashable({
  def,
  color,
}: {
  def: CrateDef;
  color: string;
}) {
  const { registerSmash } = useFlightWorld();
  const hit = useRef(false);

  return (
    <RigidBody
      position={def.position}
      colliders="cuboid"
      restitution={0.35}
      friction={0.6}
      mass={0.8}
      onCollisionEnter={({ other }) => {
        if (hit.current) return;
        const vel = other.rigidBody?.linvel();
        const speed = vel ? Math.hypot(vel.x, vel.y, vel.z) : 0;
        if (speed > 5) {
          hit.current = true;
          registerSmash();
        }
      }}
    >
      <mesh castShadow>
        <boxGeometry args={def.size} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
    </RigidBody>
  );
}

function BouncePad({
  pad,
  color,
}: {
  pad: BouncePadDef;
  color: string;
}) {
  return (
    <RigidBody
      type="fixed"
      position={pad.position}
      colliders="cuboid"
      onCollisionEnter={({ other }) => {
        const body = other.rigidBody as RapierRigidBody | null;
        if (!body) return;
        body.applyImpulse({ x: 0, y: pad.impulse, z: 0 }, true);
      }}
    >
      <mesh>
        <boxGeometry args={pad.size} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>
    </RigidBody>
  );
}

export function Toys({ sky }: { sky: SkyTheme }) {
  const { layout } = useFlightWorld();
  return (
    <group>
      {layout.crates.map((crate) => (
        <Smashable key={crate.id} def={crate} color={sky.grid} />
      ))}
      {layout.pins.map((pin) => (
        <Smashable key={pin.id} def={pin} color={sky.brand} />
      ))}
      {layout.bouncePads.map((pad) => (
        <BouncePad key={pad.id} pad={pad} color={sky.brandSecondary} />
      ))}
    </group>
  );
}
