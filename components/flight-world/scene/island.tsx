"use client";

import { useMemo } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import type { SkyTheme } from "@/lib/flight/loadout";
import {
  CIRCUIT,
  CIRCUIT_BAYS,
  circuitPoint,
} from "@/lib/flight-world/layout";

function GlowPad({
  position,
  size,
  color,
  emissiveIntensity = 0.35,
  rotationY = 0,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  emissiveIntensity?: number;
  rotationY?: number;
}) {
  return (
    <RigidBody type="fixed" position={position} rotation={[0, rotationY, 0]}>
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.45}
          metalness={0.25}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>
    </RigidBody>
  );
}

function buildFlatTrackGeometry(a: number, b: number, halfWidth: number) {
  const outerA = a + halfWidth;
  const outerB = b + halfWidth;
  const innerA = Math.max(2, a - halfWidth);
  const innerB = Math.max(2, b - halfWidth);
  const segments = 96;

  const shape = new THREE.Shape();
  for (let i = 0; i <= segments; i += 1) {
    const t = (i / segments) * Math.PI * 2;
    const x = Math.sin(t) * outerA;
    const y = Math.cos(t) * outerB;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }

  const hole = new THREE.Path();
  for (let i = 0; i <= segments; i += 1) {
    const t = (i / segments) * Math.PI * 2;
    const x = Math.sin(t) * innerA;
    const y = Math.cos(t) * innerB;
    if (i === 0) hole.moveTo(x, y);
    else hole.lineTo(x, y);
  }
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.45,
    bevelEnabled: false,
    curveSegments: 1,
  });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, 0.45, 0);
  geo.computeVertexNormals();
  return geo;
}

function buildTrackCurve(a: number, b: number, scale = 1) {
  const pts: THREE.Vector3[] = [];
  const n = 96;
  for (let i = 0; i <= n; i += 1) {
    const t = (i / n) * Math.PI * 2;
    pts.push(
      new THREE.Vector3(Math.sin(t) * a * scale, 0, Math.cos(t) * b * scale),
    );
  }
  return new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.05);
}

function makeAsphaltTexture() {
  const size = 256;
  const canvas =
    typeof document !== "undefined" ? document.createElement("canvas") : null;
  if (!canvas) return null;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Neutral asphalt base (no green tint)
  ctx.fillStyle = "#2a2f3a";
  ctx.fillRect(0, 0, size, size);

  // Soft chequer — slight contrast only, reads as track plates
  const cell = 32;
  for (let y = 0; y < size / cell; y += 1) {
    for (let x = 0; x < size / cell; x += 1) {
      if ((x + y) % 2 !== 0) continue;
      ctx.fillStyle = "#343b4a";
      ctx.fillRect(x * cell, y * cell, cell, cell);
    }
  }

  // Grain
  for (let i = 0; i < 1200; i += 1) {
    const g = 30 + Math.floor(Math.random() * 40);
    ctx.fillStyle = `rgba(${g},${g},${g + 8},0.18)`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 1.5, 1.5);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(14, 3);
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

type Mark = {
  id: string;
  position: [number, number, number];
  yaw: number;
  size: [number, number, number];
  color: string;
  emissive: string;
};

function marksOnCurve(
  curve: THREE.CatmullRomCurve3,
  count: number,
  y: number,
  size: [number, number, number],
  color: string,
  emissive: string,
  prefix: string,
  closedGap = 0.72,
): Mark[] {
  return Array.from({ length: count }, (_, i) => {
    const t = (i + 0.5) / count;
    const p = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    const yaw = Math.atan2(tangent.x, tangent.z);
    return {
      id: `${prefix}-${i}`,
      position: [p.x, y, p.z] as [number, number, number],
      yaw,
      size: [size[0], size[1], size[2] * closedGap],
      color,
      emissive,
    };
  });
}

/** Flat elliptical asphalt with chequer grain + racing lane marks. */
function CircuitTrack(_props: { sky: SkyTheme }) {
  const { a, b, trackHalfWidth } = CIRCUIT;
  const centerCurve = useMemo(() => buildTrackCurve(a, b), [a, b]);
  const outerCurve = useMemo(
    () => buildTrackCurve(a, b, 1 + (trackHalfWidth - 0.55) / a),
    [a, b, trackHalfWidth],
  );
  const innerCurve = useMemo(
    () => buildTrackCurve(a, b, 1 - (trackHalfWidth - 0.55) / a),
    [a, b, trackHalfWidth],
  );

  const trackGeo = useMemo(
    () => buildFlatTrackGeometry(a, b, trackHalfWidth),
    [a, b, trackHalfWidth],
  );

  const asphaltMap = useMemo(() => makeAsphaltTexture(), []);

  const centerDashes = useMemo(
    () =>
      marksOnCurve(
        centerCurve,
        32,
        0.74,
        [0.28, 0.05, 2.4],
        "#f2f4f8",
        "#d8dce8",
        "center",
        0.55,
      ),
    [centerCurve],
  );

  const outerEdge = useMemo(
    () =>
      marksOnCurve(
        outerCurve,
        64,
        0.72,
        [0.42, 0.05, 3.2],
        "#f5c542",
        "#e0a820",
        "outer",
        0.92,
      ),
    [outerCurve],
  );

  const innerEdge = useMemo(
    () =>
      marksOnCurve(
        innerCurve,
        64,
        0.72,
        [0.36, 0.05, 3.2],
        "#eef2f8",
        "#c8d0dc",
        "inner",
        0.92,
      ),
    [innerCurve],
  );

  // Red/white kerbs — spaced, no shared planes
  const kerbs = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const t = (i + 0.5) / 20;
      const p = outerCurve.getPointAt(t);
      const tangent = outerCurve.getTangentAt(t);
      const yaw = Math.atan2(tangent.x, tangent.z);
      const red = i % 2 === 0;
      return {
        id: `kerb-${i}`,
        position: [p.x, 0.78, p.z] as [number, number, number],
        yaw,
        size: [1.1, 0.12, 2.0] as [number, number, number],
        color: red ? "#e24a3b" : "#f4f6fa",
        emissive: red ? "#a02820" : "#b8c0cc",
      };
    });
  }, [outerCurve]);

  const colliders = useMemo(() => {
    const segs = 24;
    return Array.from({ length: segs }, (_, i) => {
      const t = ((i + 0.5) / segs) * Math.PI * 2;
      const x = Math.sin(t) * a;
      const z = Math.cos(t) * b;
      const tx = Math.cos(t) * a;
      const tz = -Math.sin(t) * b;
      const yaw = Math.atan2(tx, tz);
      return { id: i, x, z, yaw };
    });
  }, [a, b]);

  return (
    <group>
      <mesh geometry={trackGeo} receiveShadow>
        <meshStandardMaterial
          color="#2e3440"
          map={asphaltMap ?? undefined}
          emissive="#1a1e28"
          emissiveIntensity={0.08}
          roughness={0.92}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {[...outerEdge, ...innerEdge, ...centerDashes, ...kerbs].map((m) => (
        <mesh
          key={m.id}
          position={m.position}
          rotation={[0, m.yaw, 0]}
          frustumCulled={false}
        >
          <boxGeometry args={m.size} />
          <meshStandardMaterial
            color={m.color}
            emissive={m.emissive}
            emissiveIntensity={0.35}
            roughness={0.55}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>
      ))}

      {colliders.map((c) => (
        <RigidBody
          key={c.id}
          type="fixed"
          position={[c.x, 0.35, c.z]}
          rotation={[0, c.yaw, 0]}
          colliders={false}
        >
          <CuboidCollider args={[trackHalfWidth + 0.4, 0.35, 5.2]} />
        </RigidBody>
      ))}
    </group>
  );
}

function ExitSpur({
  gate,
  center,
  accent,
}: {
  gate: [number, number, number];
  center: [number, number, number];
  accent: string;
}) {
  const mid: [number, number, number] = [
    (gate[0] + center[0]) / 2,
    0.2,
    (gate[2] + center[2]) / 2,
  ];
  const dx = center[0] - gate[0];
  const dz = center[2] - gate[2];
  const len = Math.hypot(dx, dz);
  const yaw = Math.atan2(dx, dz);
  return (
    <GlowPad
      position={mid}
      size={[5.5, 0.35, Math.max(6, len + 1)]}
      color={accent}
      emissiveIntensity={0.3}
      rotationY={yaw}
    />
  );
}

function RunwayLights({
  color,
  count = 24,
  radiusScale = 1.12,
}: {
  color: string;
  count?: number;
  radiusScale?: number;
}) {
  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const t = (i / count) * Math.PI * 2;
        const [x, , z] = circuitPoint(t, radiusScale);
        return (
          <mesh key={i} position={[x, 0.55, z]}>
            <sphereGeometry args={[0.16, 8, 8]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.35}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/** Oval career circuit + pit-stop bay pads. */
export function Island({ sky }: { sky: SkyTheme }) {
  return (
    <group>
      <RigidBody type="fixed" colliders={false} position={[0, -0.55, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[110, 1, 100]} />
          <meshStandardMaterial
            color="#12182a"
            emissive={sky.brandSecondary}
            emissiveIntensity={0.04}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        <CuboidCollider args={[55, 0.5, 50]} />
      </RigidBody>

      {/* Quiet infield — kept well below the track surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[14, 48]} />
        <meshStandardMaterial
          color="#0e1424"
          emissive={sky.brand}
          emissiveIntensity={0.05}
          roughness={0.95}
        />
      </mesh>

      <CircuitTrack sky={sky} />
      <RunwayLights color={sky.brand} count={28} radiusScale={1.14} />
      <RunwayLights color={sky.brandSecondary} count={28} radiusScale={0.9} />

      {CIRCUIT_BAYS.map((bay) => (
        <group key={bay.id}>
          <ExitSpur
            gate={[bay.gate[0], 0, bay.gate[2]]}
            center={[bay.center[0], 0, bay.center[2]]}
            accent={bay.accent}
          />
          <GlowPad
            position={[bay.center[0], 0.32, bay.center[2]]}
            size={bay.padSize}
            color={bay.accent}
            emissiveIntensity={0.28}
            rotationY={bay.yaw}
          />
        </group>
      ))}

      <RigidBody type="fixed" position={[0, -2.2, 8]}>
        <mesh>
          <boxGeometry args={[8, 0.5, 6]} />
          <meshStandardMaterial
            color="#0e2a22"
            emissive="#3dffa0"
            emissiveIntensity={0.3}
          />
        </mesh>
      </RigidBody>
    </group>
  );
}
