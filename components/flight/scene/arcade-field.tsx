"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ArcadeRing, ArcadeRock } from "@/lib/flight/arcade";
import type { SkyTheme } from "@/lib/flight/loadout";

export function ArcadeField({
  rings,
  rocks,
  collectedRingIds,
  sky,
}: {
  rings: ArcadeRing[];
  rocks: ArcadeRock[];
  collectedRingIds: Set<string>;
  sky: SkyTheme;
}) {
  return (
    <group>
      {rings.map((ring) =>
        collectedRingIds.has(ring.id) ? null : (
          <RingMesh key={ring.id} ring={ring} color={sky.brandSecondary} />
        ),
      )}
      {rocks.map((rock) => (
        <RockMesh key={rock.id} rock={rock} color={sky.grid} />
      ))}
    </group>
  );
}

function RingMesh({ ring, color }: { ring: ArcadeRing; color: string }) {
  const ref = useRef<THREE.Group>(null);
  const quat = useMemo(() => {
    const forward = new THREE.Vector3(...ring.forward).normalize();
    const q = new THREE.Quaternion();
    // Torus lies in XY by default; face the flyer by aligning +Z to path forward.
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), forward);
    return q;
  }, [ring.forward]);

  useFrame(({ clock }) => {
    if (document.hidden || !ref.current) return;
    // Soft spin on the gate axis only — no tumbling clutter.
    ref.current.rotation.z = clock.elapsedTime * 0.7;
  });

  return (
    <group position={ring.position} quaternion={quat}>
      <group ref={ref}>
        <mesh>
          <torusGeometry args={[1.35, 0.07, 8, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.75}
            metalness={0.2}
            roughness={0.35}
            transparent
            opacity={0.92}
          />
        </mesh>
      </group>
    </group>
  );
}

function RockMesh({ rock, color }: { rock: ArcadeRock; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const spin = useMemo(() => 0.25 + rock.radius * 0.3, [rock.radius]);
  useFrame((_, dt) => {
    if (document.hidden || !ref.current) return;
    ref.current.rotation.y += dt * spin;
  });
  return (
    <mesh ref={ref} position={rock.position}>
      <dodecahedronGeometry args={[rock.radius, 0]} />
      <meshStandardMaterial
        color={color}
        roughness={0.9}
        metalness={0.02}
        flatShading
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}
