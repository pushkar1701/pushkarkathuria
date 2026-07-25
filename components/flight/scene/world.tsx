"use client";

/* eslint-disable react-hooks/immutability -- R3F's useThree().scene is a
 * live three.js Scene that background/fog are meant to be assigned onto
 * imperatively; it is not React-managed state. */

import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { resolveCssColor } from "./colors";

/** Sky/fog/ground + lighting. No shadows (perf budget). */
export function World() {
  const { scene } = useThree();
  const sky = useMemo(() => resolveCssColor("var(--background)", "#101018"), []);
  const ground = useMemo(() => resolveCssColor("var(--card)", "#1a1a24"), []);

  useEffect(() => {
    scene.background = new THREE.Color(sky);
    scene.fog = new THREE.Fog(sky, 45, 170);
    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [scene, sky]);

  return (
    <>
      <hemisphereLight args={["#5b6fa8", "#0a0a10", 0.65]} />
      <directionalLight position={[24, 32, 14]} intensity={1.05} color="#ffe2b8" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -9, 0]}>
        <planeGeometry args={[600, 600]} />
        <meshStandardMaterial color={ground} roughness={1} metalness={0} />
      </mesh>
    </>
  );
}
