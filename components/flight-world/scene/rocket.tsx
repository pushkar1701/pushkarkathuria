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
import { SPAWN, WORLD_FALL_Y } from "@/lib/flight-world/layout";
import { playSfx } from "../audio";
import { useFlightWorld } from "../store";

const CRUISE_SPEED = 16;
const BOOST_SPEED = 12;
const TURN_RATE = 2.4;
const JUMP = 12;
const CHASE_DISTANCE = 14;
const CHASE_HEIGHT = 6;
const CAMERA_DAMPING = 3.2;
const MAX_RANGE = 90;

export function Rocket({ craft }: { craft: CraftDef }) {
  const body = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  const { respawnToken, respawn } = useFlightWorld();
  const keys = useMemo(() => createKeyState(), []);
  const desiredCam = useMemo(() => new THREE.Vector3(), []);
  const headingRef = useRef(SPAWN.lookYaw);
  const boostCool = useRef(0);
  const jumpCool = useRef(0);
  const lastRespawn = useRef(respawnToken);
  const spaceHeld = useRef(false);
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
    const outOfBounds =
      t.y < WORLD_FALL_Y ||
      Math.hypot(t.x, t.z) > MAX_RANGE ||
      t.y > 40;
    if (outOfBounds) {
      respawn();
      return;
    }

    // Arcade heading — A/D turn, not physics tumble
    headingRef.current += keys.yaw * TURN_RATE * dt;
    quat.setFromAxisAngle(yawAxis, headingRef.current);
    rb.setRotation({ x: quat.x, y: quat.y, z: quat.z, w: quat.w }, true);
    rb.setAngvel({ x: 0, y: 0, z: 0 }, true);

    const fx = -Math.sin(headingRef.current);
    const fz = -Math.cos(headingRef.current);

    // W/S drive on XZ; Shift adds boost; keep vertical from physics/jump
    const drive = keys.pitch;
    const boost = keys.throttle;
    const speed =
      drive === 0 && !boost
        ? 0
        : (Math.abs(drive) || (boost ? 1 : 0)) *
          (CRUISE_SPEED + boost * BOOST_SPEED) *
          Math.sign(drive || 1);

    const vel = rb.linvel();
    if (speed !== 0) {
      rb.setLinvel({ x: fx * speed, y: vel.y, z: fz * speed }, true);
    } else {
      // Friction on ground plane when idle
      rb.setLinvel({ x: vel.x * 0.9, y: vel.y, z: vel.z * 0.9 }, true);
    }

    if (boost && now > boostCool.current) {
      boostCool.current = now + 0.35;
      playSfx("boost");
    }

    if (spaceHeld.current && now > jumpCool.current) {
      jumpCool.current = now + 0.55;
      rb.setLinvel({ x: vel.x, y: JUMP, z: vel.z }, true);
      playSfx("boost");
    }

    desiredCam.set(
      t.x - fx * CHASE_DISTANCE,
      t.y + CHASE_HEIGHT,
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
  );
}
