"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type AmbientVariant = "orb" | "torus" | "grid" | "waves" | "ribbon";

type Props = {
  variant?: AmbientVariant;
  className?: string;
  density?: number;
  opacity?: number;
};

const POINT_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uAmplitude;
  attribute float aScale;
  attribute float aSeed;
  varying float vScale;
  varying float vSeed;

  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.32 + aSeed * 6.2831) * uAmplitude;
    p.y += cos(uTime * 0.27 + aSeed * 4.71) * uAmplitude;
    p.z += sin(uTime * 0.21 + aSeed * 3.14) * uAmplitude * 0.6;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * (1.0 / max(-mv.z, 0.001));
    vScale = aScale;
    vSeed = aSeed;
  }
`;

const POINT_FRAGMENT = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vScale;
  varying float vSeed;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.02, d);
    vec3 color = mix(uColorA, uColorB, clamp(vScale * 0.8 + vSeed * 0.2, 0.0, 1.0));
    gl_FragColor = vec4(color, alpha * (0.35 + vScale * 0.65));
  }
`;

const WAVE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aScale;
  varying float vScale;

  void main() {
    vec3 p = position;
    float wave = sin(p.x * 1.15 + uTime * 0.9) * 0.22;
    wave += cos(p.y * 1.35 + uTime * 0.7) * 0.22;
    p.z += wave;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * (1.0 / max(-mv.z, 0.001));
    vScale = aScale;
  }
`;

const WAVE_FRAGMENT = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vScale;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.02, d);
    gl_FragColor = vec4(mix(uColorA, uColorB, vScale), alpha * 0.55);
  }
`;

const FRESNEL_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRESNEL_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float fresnel = pow(1.0 - clamp(dot(vNormal, vView), 0.0, 1.0), 2.6);
    gl_FragColor = vec4(uColor, fresnel * uIntensity);
  }
`;

function makeField(count: number, inner: number, outer: number) {
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const radius = inner + Math.random() * (outer - inner);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
    positions[i * 3 + 2] = radius * Math.cos(phi);
    scales[i] = 0.35 + Math.random() * 1.4;
    seeds[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  return geometry;
}

function makeWaveGrid(size: number, segments: number) {
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  const count = geometry.attributes.position.count;
  const scales = new Float32Array(count);
  for (let i = 0; i < count; i++) scales[i] = 0.35 + Math.random() * 0.9;
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  return geometry;
}

function disposeScene(scene: THREE.Scene) {
  scene.traverse((object) => {
    const mesh = object as THREE.Mesh | THREE.Points | THREE.Line;
    if (mesh.geometry) mesh.geometry.dispose();
    const material = mesh.material;
    if (!material) return;
    const materials = Array.isArray(material) ? material : [material];
    materials.forEach((entry) => entry.dispose());
  });
}

export default function AmbientScene({
  variant = "orb",
  className,
  density = 1,
  opacity = 1,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch {
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      } catch {
        return;
      }
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.position.set(isMobile ? 0 : 1.15, isMobile ? 0.25 : 0.1, 0);
    group.scale.setScalar(isMobile ? 0.78 : 1);
    scene.add(group);

    const colorBlue = new THREE.Color("#3b82f6");
    const colorCyan = new THREE.Color("#22d3ee");
    const fieldCount = Math.round((isMobile ? 450 : 900) * density);
    const fieldGeometry = makeField(
      fieldCount,
      variant === "orb" ? 2.1 : 2.6,
      variant === "orb" ? 5.2 : 5.8,
    );
    const fieldMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: isMobile ? 62 : 78 },
        uAmplitude: { value: 0.12 },
        uColorA: { value: colorBlue },
        uColorB: { value: colorCyan },
      },
      vertexShader: POINT_VERTEX,
      fragmentShader: POINT_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const field = new THREE.Points(fieldGeometry, fieldMaterial);
    group.add(field);

    let waveMaterial: THREE.ShaderMaterial | null = null;

    if (variant === "orb" || variant === "torus" || variant === "ribbon") {
      const coreGeometry = new THREE.IcosahedronGeometry(
        variant === "orb" ? 1.55 : 1.15,
        4,
      );
      const coreMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: variant === "orb" ? colorCyan : colorBlue },
          uIntensity: { value: variant === "orb" ? 0.9 : 0.5 },
        },
        vertexShader: FRESNEL_VERTEX,
        fragmentShader: FRESNEL_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      group.add(core);

      const wireGeometry = new THREE.IcosahedronGeometry(
        variant === "orb" ? 2.05 : 1.65,
        2,
      );
      const wireMaterial = new THREE.MeshBasicMaterial({
        color: colorBlue,
        wireframe: true,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      });
      const wire = new THREE.Mesh(wireGeometry, wireMaterial);
      group.add(wire);

      if (variant === "torus" || variant === "ribbon") {
        const knotGeometry =
          variant === "ribbon"
            ? new THREE.TorusKnotGeometry(1.55, 0.16, 200, 8, 3, 4)
            : new THREE.TorusKnotGeometry(1.35, 0.32, 160, 12, 2, 3);
        const knotMaterial = new THREE.MeshBasicMaterial({
          color: colorCyan,
          wireframe: true,
          transparent: true,
          opacity: variant === "ribbon" ? 0.42 : 0.3,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const knot = new THREE.Mesh(knotGeometry, knotMaterial);
        group.add(knot);
      }
    }

    if (variant === "grid" || variant === "waves") {
      const waveGeometry = makeWaveGrid(
        variant === "grid" ? 8.4 : 9,
        variant === "grid" ? 36 : 42,
      );
      const wave = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: isMobile ? 34 : 44 },
          uColorA: { value: colorBlue },
          uColorB: { value: colorCyan },
        },
        vertexShader: WAVE_VERTEX,
        fragmentShader: WAVE_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      waveMaterial = wave;
      const points = new THREE.Points(waveGeometry, wave);
      points.rotation.x = variant === "grid" ? -1.16 : -0.75;
      points.rotation.z = variant === "grid" ? 0.18 : -0.1;
      points.position.y = variant === "grid" ? -0.7 : 0.6;
      group.add(points);

      const ringGeometry = new THREE.TorusGeometry(2.55, 0.006, 6, 128);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: colorCyan,
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2.4;
      group.add(ring);
    }

    const ringGeometry = new THREE.TorusGeometry(3.15, 0.005, 6, 128);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: colorBlue,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const outerRing = new THREE.Mesh(ringGeometry, ringMaterial);
    outerRing.rotation.set(1.18, 0.25, 0);
    group.add(outerRing);

    const secondRingGeometry = new THREE.TorusGeometry(3.55, 0.004, 6, 128);
    const secondRingMaterial = new THREE.MeshBasicMaterial({
      color: colorCyan,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const secondRing = new THREE.Mesh(secondRingGeometry, secondRingMaterial);
    secondRing.rotation.set(1.45, -0.4, 0.3);
    group.add(secondRing);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (event: PointerEvent) => {
      pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let visible = true;
    let running = false;
    let raf = 0;
    const startTime = performance.now();
    const elapsedSeconds = () => (performance.now() - startTime) / 1000;
    const baseX = group.position.x;
    const baseY = group.position.y;

    const render = (time: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;

      const scrollOffset =
        typeof window !== "undefined" ? Math.min(window.scrollY, 900) : 0;

      group.rotation.y = time * 0.075 + pointer.x * 0.3;
      group.rotation.x = Math.sin(time * 0.18) * 0.08 + pointer.y * 0.16;
      group.position.x = baseX + pointer.x * 0.18;
      group.position.y = baseY + pointer.y * 0.12 - scrollOffset * 0.00045;
      field.rotation.y = -time * 0.035;
      field.rotation.x = Math.sin(time * 0.11) * 0.08;
      outerRing.rotation.z = time * 0.05;
      secondRing.rotation.z = -time * 0.04;
      fieldMaterial.uniforms.uTime.value = time;
      if (waveMaterial) waveMaterial.uniforms.uTime.value = time;

      renderer.render(scene, camera);
    };

    const loop = () => {
      if (!running) return;
      render(elapsedSeconds());
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduced || running || !visible || document.hidden) return;
      running = true;
      loop();
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      if (reduced) render(0);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.01 },
    );
    intersectionObserver.observe(mount);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (reduced) {
      render(0);
    } else {
      start();
    }

    return () => {
      stop();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      disposeScene(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [variant, density]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={className}
      style={{ opacity, contain: "strict" }}
    />
  );
}
