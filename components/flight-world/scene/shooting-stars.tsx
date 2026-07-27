"use client";

import { useFrame } from "@react-three/fiber";
import {
  BallCollider,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { SkyTheme } from "@/lib/flight/loadout";
import { playSfx } from "../audio";
import { useFlightWorld } from "../store";

const POOL_HIGH = 18;
const POOL_LOW = 12;
const ROCKET_NAME = "rocket-craft";

const _dir = new THREE.Vector3();
const _target = new THREE.Vector3();
const _start = new THREE.Vector3();

type StarSlot = {
  active: boolean;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
};

function emptySlot(): StarSlot {
  return {
    active: false,
    x: 0,
    y: -500,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    life: 0,
  };
}

/** Shared GPU resources — one material set for every star. */
const fireMaterials = {
  core: new THREE.MeshBasicMaterial({
    color: "#fff6dc",
    transparent: true,
    opacity: 0.95,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
  flameInner: new THREE.MeshBasicMaterial({
    color: "#ffd060",
    transparent: true,
    opacity: 0.85,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
  flameOuter: new THREE.MeshBasicMaterial({
    color: "#ff5020",
    transparent: true,
    opacity: 0.5,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
};

const fireGeometries = {
  core: new THREE.SphereGeometry(0.5, 8, 8),
  flameInner: new THREE.ConeGeometry(0.65, 5.5, 6, 1, true),
  flameOuter: new THREE.ConeGeometry(1.0, 9, 6, 1, true),
};

const _axisFwd = new THREE.Vector3(0, 0, -1);

/** Deep-space shooting stars — spawn off-circuit; rocket hits return home. */
export function ShootingStars({ rich = true }: { sky: SkyTheme; rich?: boolean }) {
  const poolSize = rich ? POOL_HIGH : POOL_LOW;
  const { farFromPlatform, rocketWorldPosRef, respawn } = useFlightWorld();
  const slots = useRef<StarSlot[]>(
    Array.from({ length: POOL_HIGH }, () => emptySlot()),
  );
  const bodies = useRef<(RapierRigidBody | null)[]>(
    Array.from({ length: POOL_HIGH }, () => null),
  );
  const visuals = useRef<(THREE.Group | null)[]>(
    Array.from({ length: POOL_HIGH }, () => null),
  );
  const spawnAcc = useRef(0);
  const farRef = useRef(false);
  const hitCool = useRef(0);

  const quat = useMemo(() => new THREE.Quaternion(), []);

  useFrame((_, dt) => {
    farRef.current = farFromPlatform;
    hitCool.current = Math.max(0, hitCool.current - dt);

    if (!farFromPlatform) {
      spawnAcc.current = 0;
      for (let i = 0; i < poolSize; i += 1) {
        slots.current[i].active = false;
        bodies.current[i]?.setNextKinematicTranslation({ x: 0, y: -500, z: 0 });
        const vis = visuals.current[i];
        if (vis) vis.visible = false;
      }
      return;
    }

    const [px, py, pz] = rocketWorldPosRef.current;

    const spawnInterval = rich ? 0.65 : 0.9;
    spawnAcc.current += dt;
    while (spawnAcc.current > spawnInterval) {
      spawnAcc.current -= spawnInterval;
      const free = slots.current
        .slice(0, poolSize)
        .find((s) => !s.active);
      if (!free) break;

      const angle = Math.random() * Math.PI * 2;
      const dist = 55 + Math.random() * 45;
      const startX = px + Math.cos(angle) * dist;
      const startY = py + (Math.random() - 0.5) * 30;
      const startZ = pz + Math.sin(angle) * dist;

      _target.set(
        px + (Math.random() - 0.5) * 40,
        py + (Math.random() - 0.5) * 20,
        pz + (Math.random() - 0.5) * 40,
      );
      _start.set(startX, startY, startZ);
      _dir.copy(_target).sub(_start).normalize().multiplyScalar(42 + Math.random() * 28);

      free.active = true;
      free.x = startX;
      free.y = startY;
      free.z = startZ;
      free.vx = _dir.x;
      free.vy = _dir.y;
      free.vz = _dir.z;
      free.life = 3.5 + Math.random() * 2;
    }

    for (let i = 0; i < poolSize; i += 1) {
      const slot = slots.current[i];
      const rb = bodies.current[i];
      const vis = visuals.current[i];
      if (!slot.active) {
        rb?.setNextKinematicTranslation({ x: 0, y: -500, z: 0 });
        if (vis) vis.visible = false;
        continue;
      }

      slot.x += slot.vx * dt;
      slot.y += slot.vy * dt;
      slot.z += slot.vz * dt;
      slot.life -= dt;
      if (slot.life <= 0) {
        slot.active = false;
        rb?.setNextKinematicTranslation({ x: 0, y: -500, z: 0 });
        if (vis) vis.visible = false;
        continue;
      }

      rb?.setNextKinematicTranslation({ x: slot.x, y: slot.y, z: slot.z });

      if (vis) {
        vis.visible = true;
        vis.position.set(slot.x, slot.y, slot.z);
        _dir.set(slot.vx, slot.vy, slot.vz);
        if (_dir.lengthSq() > 0.01) {
          quat.setFromUnitVectors(_axisFwd, _dir.normalize());
          vis.quaternion.copy(quat);
        }
      }
    }
  });

  const onHitRocket = () => {
    if (!farRef.current || hitCool.current > 0) return;
    hitCool.current = 1.2;
    playSfx("boost");
    respawn();
  };

  return (
    <group>
      {Array.from({ length: poolSize }, (_, i) => (
        <group key={i}>
          <RigidBody
            ref={(rb) => {
              bodies.current[i] = rb;
            }}
            type="kinematicPosition"
            colliders={false}
            sensor
            onIntersectionEnter={({ other }) => {
              if (hitCool.current > 0) return;
              if (!slots.current[i]?.active) return;
              if (other.rigidBodyObject?.name !== ROCKET_NAME) return;
              slots.current[i].active = false;
              onHitRocket();
            }}
          >
            <BallCollider args={[2.6]} />
          </RigidBody>
          <group
            ref={(node) => {
              visuals.current[i] = node;
            }}
            visible={false}
          >
            <mesh geometry={fireGeometries.core} material={fireMaterials.core} />
            <mesh
              geometry={fireGeometries.flameInner}
              material={fireMaterials.flameInner}
              position={[0, 0, 3]}
              rotation={[Math.PI, 0, 0]}
            />
            <mesh
              geometry={fireGeometries.flameOuter}
              material={fireMaterials.flameOuter}
              position={[0, 0, 5.5]}
              rotation={[Math.PI, 0, 0]}
            />
          </group>
        </group>
      ))}
    </group>
  );
}

export { ROCKET_NAME };
