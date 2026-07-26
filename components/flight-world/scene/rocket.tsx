"use client";

/* eslint-disable react-hooks/immutability -- R3F chase cam mutates camera. */

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, type RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import {
  applyKeyEvent,
  createKeyState,
  isEditableTarget,
  isMovementKey,
  resetKeyState,
} from "@/lib/flight/controls";
import type { CraftDef } from "@/lib/flight/loadout";
import {
  PLATFORM_RADIUS,
  SPAWN,
  WORLD_FALL_Y,
} from "@/lib/flight-world/layout";
import { playSfx } from "../audio";
import { useFlightWorld } from "../store";

const CRUISE_SPEED = 16;
const BOOST_SPEED = 12;
const OPEN_SPACE_BONUS = 6;
const TURN_RATE = 2.4;
const JUMP = 12;
const CHASE_DISTANCE = 14;
const CAMERA_DAMPING = 3.2;
const HARD_VOID = 280;
const TRAIL_COUNT = 56;

type SmokePuff = {
  active: boolean;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
};

function BoostSmokeTrail({
  puffs,
  color,
}: {
  puffs: React.MutableRefObject<SmokePuff[]>;
  color: string;
}) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((_, dt) => {
    for (let i = 0; i < puffs.current.length; i += 1) {
      const puff = puffs.current[i];
      const mesh = meshRefs.current[i];
      if (!mesh) continue;
      if (!puff.active) {
        mesh.visible = false;
        continue;
      }
      puff.life -= dt;
      puff.x += puff.vx * dt;
      puff.y += puff.vy * dt;
      puff.z += puff.vz * dt;
      puff.vy += 1.2 * dt;
      if (puff.life <= 0) {
        puff.active = false;
        mesh.visible = false;
        continue;
      }
      const t = puff.life / puff.maxLife;
      mesh.visible = true;
      mesh.position.set(puff.x, puff.y, puff.z);
      const scale = puff.size * (0.55 + (1 - t) * 1.6);
      mesh.scale.setScalar(scale);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = t * 0.55;
    }
  });

  return (
    <group>
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <mesh
          key={i}
          ref={(node) => {
            meshRefs.current[i] = node;
          }}
          visible={false}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

export function Rocket({ craft }: { craft: CraftDef }) {
  const body = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  const { respawnToken, respawn, farFromPlatform, setFarFromPlatform } =
    useFlightWorld();
  const keys = useMemo(() => createKeyState(), []);
  const desiredCam = useMemo(() => new THREE.Vector3(), []);
  const headingRef = useRef(SPAWN.lookYaw);
  const boostCool = useRef(0);
  const jumpCool = useRef(0);
  const lastRespawn = useRef(respawnToken);
  const spaceHeld = useRef(false);
  const farRef = useRef(false);
  const trailCursor = useRef(0);
  const emitAcc = useRef(0);
  const puffs = useRef<SmokePuff[]>(
    Array.from({ length: TRAIL_COUNT }, () => ({
      active: false,
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      life: 0,
      maxLife: 1,
      size: 0.4,
    })),
  );
  const quat = useMemo(() => new THREE.Quaternion(), []);
  const yawAxis = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  useEffect(() => {
    function down(e: KeyboardEvent) {
      if (isEditableTarget(e.target)) return;
      if (e.code === "Space") {
        e.preventDefault();
        spaceHeld.current = true;
      }
      if (isMovementKey(e.code)) e.preventDefault();
      applyKeyEvent(keys, e, true);
    }
    function up(e: KeyboardEvent) {
      if (e.code === "Space") spaceHeld.current = false;
      applyKeyEvent(keys, e, false);
    }
    function blur() {
      resetKeyState(keys);
      spaceHeld.current = false;
    }
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, [keys]);

  useEffect(() => {
    if (respawnToken === lastRespawn.current) return;
    lastRespawn.current = respawnToken;
    headingRef.current = SPAWN.lookYaw;
    farRef.current = false;
    for (const puff of puffs.current) puff.active = false;
    const rb = body.current;
    if (!rb) return;
    rb.setTranslation(
      { x: SPAWN.position[0], y: SPAWN.position[1], z: SPAWN.position[2] },
      true,
    );
    rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
    rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
    quat.setFromAxisAngle(yawAxis, headingRef.current);
    rb.setRotation({ x: quat.x, y: quat.y, z: quat.z, w: quat.w }, true);
  }, [respawnToken, quat, yawAxis]);

  useFrame(({ clock }, dt) => {
    if (document.hidden) return;
    const rb = body.current;
    if (!rb) return;
    const now = clock.elapsedTime;

    const t = rb.translation();
    const planar = Math.hypot(t.x, t.z);
    const far = planar > PLATFORM_RADIUS || t.y > 32 || t.y < -8;

    if (far !== farRef.current) {
      farRef.current = far;
      setFarFromPlatform(far);
    }

    if (
      !Number.isFinite(t.x) ||
      !Number.isFinite(t.y) ||
      !Number.isFinite(t.z) ||
      planar > HARD_VOID ||
      t.y < WORLD_FALL_Y
    ) {
      respawn();
      return;
    }

    headingRef.current += keys.yaw * TURN_RATE * dt;
    quat.setFromAxisAngle(yawAxis, headingRef.current);
    rb.setRotation({ x: quat.x, y: quat.y, z: quat.z, w: quat.w }, true);
    rb.setAngvel({ x: 0, y: 0, z: 0 }, true);

    const fx = -Math.sin(headingRef.current);
    const fz = -Math.cos(headingRef.current);

    const drive = keys.pitch;
    const boost = keys.throttle;
    const openBonus = far ? OPEN_SPACE_BONUS : 0;
    const speed =
      drive === 0 && !boost
        ? 0
        : (Math.abs(drive) || (boost ? 1 : 0)) *
          (CRUISE_SPEED + openBonus + boost * BOOST_SPEED) *
          Math.sign(drive || 1);

    const vel = rb.linvel();
    let nextY = vel.y;

    if (far) {
      nextY += (2.2 - vel.y) * Math.min(1, dt * 1.5);
      if (keys.pitch !== 0) {
        nextY += keys.pitch * 4 * dt;
      }
    }

    if (speed !== 0) {
      rb.setLinvel({ x: fx * speed, y: nextY, z: fz * speed }, true);
    } else {
      rb.setLinvel(
        {
          x: vel.x * (far ? 0.985 : 0.9),
          y: nextY,
          z: vel.z * (far ? 0.985 : 0.9),
        },
        true,
      );
    }

    if (boost && now > boostCool.current) {
      boostCool.current = now + 0.35;
      playSfx("boost");
    }

    // Smoke trail while boosting
    if (boost) {
      emitAcc.current += dt;
      while (emitAcc.current > 0.028) {
        emitAcc.current -= 0.028;
        const i = trailCursor.current % TRAIL_COUNT;
        trailCursor.current += 1;
        const puff = puffs.current[i];
        const side = (Math.random() - 0.5) * 0.7;
        puff.active = true;
        puff.x = t.x + fx * -2.2 + (-fz) * side;
        puff.y = t.y - 0.15 + (Math.random() - 0.5) * 0.35;
        puff.z = t.z + fz * -2.2 + fx * side;
        puff.vx = -fx * (2 + Math.random() * 3) + (Math.random() - 0.5);
        puff.vy = 0.8 + Math.random() * 1.6;
        puff.vz = -fz * (2 + Math.random() * 3) + (Math.random() - 0.5);
        puff.maxLife = 0.55 + Math.random() * 0.45;
        puff.life = puff.maxLife;
        puff.size = 0.35 + Math.random() * 0.45;
      }
    } else {
      emitAcc.current = 0;
    }

    if (spaceHeld.current && now > jumpCool.current) {
      jumpCool.current = now + 0.55;
      const current = rb.linvel();
      rb.setLinvel({ x: current.x, y: JUMP + (far ? 4 : 0), z: current.z }, true);
      playSfx("boost");
    }

    const chaseHeight = far ? 8 : 6;
    desiredCam.set(
      t.x - fx * CHASE_DISTANCE,
      t.y + chaseHeight,
      t.z - fz * CHASE_DISTANCE,
    );
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      desiredCam.x,
      CAMERA_DAMPING,
      dt,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      desiredCam.y,
      CAMERA_DAMPING,
      dt,
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      desiredCam.z,
      CAMERA_DAMPING,
      dt,
    );
    camera.lookAt(t.x + fx * 6, t.y + 0.5, t.z + fz * 6);
  });

  return (
    <>
      <RigidBody
        ref={body}
        position={SPAWN.position}
        colliders="ball"
        linearDamping={0.2}
        angularDamping={1}
        canSleep={false}
        ccd
        restitution={0.15}
        friction={0.4}
        gravityScale={farFromPlatform ? 0.18 : 1}
        enabledRotations={[false, true, false]}
      >
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.45, 1.6, 4, 10]} />
            <meshStandardMaterial
              color={craft.body}
              emissive={craft.accent}
              emissiveIntensity={0.45}
              metalness={0.45}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 1.2, 0]}>
            <coneGeometry args={[0.4, 0.8, 8]} />
            <meshStandardMaterial
              color={craft.trail}
              emissive={craft.trail}
              emissiveIntensity={1.4}
            />
          </mesh>
        </group>
      </RigidBody>
      <BoostSmokeTrail puffs={puffs} color={craft.trail} />
    </>
  );
}
