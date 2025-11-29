import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function HumanModel({ glb = "/models/human.glb", onModelClick = () => {} }) {
  const { scene } = useGLTF(glb, true);
  const group = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (!scene) return;
    const root = scene;
    let target = null;
    root.traverse((o) => { if (!target && o.isSkinnedMesh) target = o; });
    if (!target) target = root.getObjectByName("mixamorigHips") || root;

    const bbox = new THREE.Box3().setFromObject(target);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const center = new THREE.Vector3();
    bbox.getCenter(center);

    if (!isFinite(size.y) || size.y === 0) {
      root.scale.setScalar(1);
      root.position.set(0, -0.9, 0);
      camera.position.set(0, 1.55, 3.2);
      camera.updateProjectionMatrix();
      return;
    }

    const TARGET_HEIGHT = 1.9;
    const scale = TARGET_HEIGHT / size.y;
    root.scale.setScalar(scale);
    root.position.set(-center.x * scale, -center.y * scale + TARGET_HEIGHT / 2 - 1.05, -center.z * scale);
    camera.position.set(0, 1.55, 3.2);
    camera.updateProjectionMatrix();
  }, [scene, camera]);

  return (
    <group ref={group} onClick={onModelClick} dispose={null} style={{ cursor: "pointer" }}>
      {scene && <primitive object={scene} />}
    </group>
  );
}