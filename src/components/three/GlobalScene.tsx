"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const POINT_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uScroll;
  uniform vec2 uPointer;
  attribute float aScale;
  attribute float aSeed;
  varying float vMix;

  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.16 + aSeed * 6.283) * 0.42 + uPointer.x * 0.55;
    p.y += cos(uTime * 0.13 + aSeed * 4.71) * 0.34 - uScroll * 1.4 + uPointer.y * 0.4;
    p.z += sin(uTime * 0.1 + aSeed * 3.14) * 0.28;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aScale * uPixelRatio * (58.0 / max(0.1, -mvPosition.z));

    vMix = clamp((p.y + 7.0) / 14.0, 0.0, 1.0);
  }
`;

const POINT_FRAGMENT = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vMix;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, dist) * 0.4;
    vec3 color = mix(uColorA, uColorB, vMix);
    gl_FragColor = vec4(color, alpha);
  }
`;

/**
 * One persistent, low-cost WebGL layer shared by every public page. It is the
 * common "air" behind the light sections: the same particle field and the same
 * wireframe language as the hero, so the site reads as one universe.
 */
export default function GlobalScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.15 : 1.4));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 80);
    camera.position.set(0, 0, 9);

    const group = new THREE.Group();
    scene.add(group);

    const count = isMobile ? 420 : 900;
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = -2 - Math.random() * 15;
      scales[i] = 0.35 + Math.random() * 1.5;
      seeds[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uScroll: { value: 0 },
        uPointer: { value: new THREE.Vector2() },
        uColorA: { value: new THREE.Color("#1d4ed8") },
        uColorB: { value: new THREE.Color("#0891b2") },
      },
      vertexShader: POINT_VERTEX,
      fragmentShader: POINT_FRAGMENT,
      transparent: true,
      depthWrite: false,
    });

    const field = new THREE.Points(geometry, material);
    group.add(field);

    const wireGeometry = new THREE.IcosahedronGeometry(4.6, 1);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x2563eb,
      wireframe: true,
      transparent: true,
      opacity: isMobile ? 0.045 : 0.065,
      depthWrite: false,
    });
    const wire = new THREE.Mesh(wireGeometry, wireMaterial);
    wire.position.set(isMobile ? 0 : 3.8, 0.5, -3);
    group.add(wire);

    const ringGeometry = new THREE.TorusGeometry(5.4, 0.008, 6, 180);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x0891b2,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(isMobile ? 0 : 3.8, 0.5, -3);
    ring.rotation.set(1.18, 0.2, 0);
    group.add(ring);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (event: PointerEvent) => {
      pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
    };

    let scrollProgress = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const clock = new THREE.Clock();
    let raf = 0;
    let last = 0;

    const render = (time: number) => {
      raf = requestAnimationFrame(render);
      if (document.hidden) return;

      // 30 fps is plenty for a decorative layer and halves the GPU cost.
      if (time - last < 1000 / 30) return;
      last = time;

      const elapsed = clock.getElapsedTime();
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      material.uniforms.uTime.value = elapsed;
      material.uniforms.uScroll.value = scrollProgress;
      (material.uniforms.uPointer.value as THREE.Vector2).set(pointer.x, pointer.y);

      group.position.y = scrollProgress * 1.1;
      group.rotation.y = pointer.x * 0.045;
      group.rotation.x = pointer.y * 0.03;
      wire.rotation.y = elapsed * 0.035;
      wire.rotation.x = elapsed * 0.018;
      ring.rotation.z = elapsed * 0.03;
      field.rotation.y = Math.sin(elapsed * 0.05) * 0.08;

      renderer.render(scene, camera);
    };

    if (reduced) {
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-20"
    />
  );
}
