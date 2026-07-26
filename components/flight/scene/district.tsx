"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SkyTheme } from "@/lib/flight/loadout";
import type { Collectible, FlightWorld } from "@/lib/flight/world";

export function District({
  world,
  sky,
  collectedIds,
}: {
  world: FlightWorld;
  sky: SkyTheme;
  collectedIds: Set<string>;
}) {
  return (
    <group>
      {world.solids.map((solid) => (
        <mesh key={solid.id} position={solid.position}>
          <boxGeometry args={solid.size} />
          <meshStandardMaterial
            color={sky.grid}
            roughness={0.85}
            metalness={0.05}
            transparent
            opacity={solid.id.startsWith("billboard") ? 0.55 : 0.9}
          />
        </mesh>
      ))}
      {/* Soft ground grid plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial
          color={sky.ground}
          roughness={1}
          metalness={0}
          transparent
          opacity={0.85}
        />
      </mesh>
      {world.collectibles.map((coin) =>
        collectedIds.has(coin.id) ? null : (
          <CoinMesh key={coin.id} coin={coin} color={sky.brandSecondary} />
        ),
      )}
    </group>
  );
}

function CoinMesh({ coin, color }: { coin: Collectible; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const spin = useMemo(() => 1.2 + coin.radius * 0.2, [coin.radius]);
  useFrame((_, dt) => {
    if (document.hidden || !ref.current) return;
    ref.current.rotation.y += dt * spin;
  });
  return (
    <mesh ref={ref} position={coin.position} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.55, 0.12, 8, 20]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.7}
        metalness={0.3}
        roughness={0.3}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}
