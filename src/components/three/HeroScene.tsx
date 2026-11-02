"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const POINT_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aScale;
  attribute float aPhase;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float drift = sin(uTime * 0.35 + aPhase) * 0.12;
    p.x += cos(aPhase) * drift;
    p.y += sin(aPhase * 1.3) * drift;
    p.z += cos(aPhase * 0.7) * drift;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aScale * uPixelRatio * (86.0 / max(0.001, -mvPosition.z));

    vAlpha = 0.16 + 0.84 * (0.5 + 0.5 * sin(uTime * 0.9 + aPhase));
  }
`;

const POINT_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, dist);
    gl_FragColor = vec4(uColor, glow * vAlpha);
  }
`;

const FRESNEL_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRESNEL_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.6);
    float pulse = 0.72 + 0.28 * sin(uTime * 0.8);
    gl_FragColor = vec4(uColor, fresnel * 0.36 * pulse);
  }
`;

function createParticleField(
  count: number,
  color: number,
  radiusMin: number,
  radiusMax: number,
): THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial> {
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const phases = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const radius = radiusMin + Math.pow(Math.random(), 1.6) * (radiusMax - radiusMin);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    scales[i] = 0.5 + Math.random() * 1.7;
    phases[i] = Math.random() * Math.PI * 2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uColor: { value: new THREE.Color(color) },
    },
    vertexShader: POINT_VERTEX,
    fragmentShader: POINT_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

export default function HeroScene({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      } catch {
        return;
      }
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 8.2);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";

    const group = new THREE.Group();
    scene.add(group);

    const nodeGroup = new THREE.Group();
    group.add(nodeGroup);

    let mobile = window.innerWidth < 1024;
    group.position.x = mobile ? 0 : 1.7;
    group.position.y = mobile ? 0.4 : 0;
    group.scale.setScalar(mobile ? 0.72 : 1.05);

    const pointCount = mobile ? 900 : 1800;
    const blueField = createParticleField(pointCount, 0x3b82f6, 2.7, 5.6);
    const cyanField = createParticleField(Math.round(pointCount * 0.55), 0x22d3ee, 2.2, 4.6);
    group.add(blueField, cyanField);

    const fresnelMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0x3b82f6) },
        uTime: { value: 0 },
      },
      vertexShader: FRESNEL_VERTEX,
      fragmentShader: FRESNEL_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const core = new THREE.Mesh(new THREE.SphereGeometry(2.35, 32, 32), fresnelMaterial);
    group.add(core);

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x2563eb,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const wireSphere = new THREE.Mesh(new THREE.IcosahedronGeometry(2.5, 3), wireMaterial);
    group.add(wireSphere);

    const outerWireMaterial = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const outerWire = new THREE.Mesh(new THREE.IcosahedronGeometry(3.5, 1), outerWireMaterial);
    group.add(outerWire);

    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const nodeGeometry = new THREE.OctahedronGeometry(0.07, 0);
    const nodes: THREE.Mesh[] = [];
    for (let i = 0; i < 14; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      const r = 2.9 + Math.random() * 1.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      node.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      );
      node.userData.speed = 0.15 + Math.random() * 0.4;
      node.userData.offset = Math.random() * Math.PI * 2;
      nodeGroup.add(node);
      nodes.push(node);
    }

    const startTime = performance.now();
    const elapsedSeconds = () => (performance.now() - startTime) / 1000;
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let scrollProgress = 0;

    const onPointerMove = (event: PointerEvent) => {
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const onScroll = () => {
      scrollProgress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.4);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const resize = () => {
      const { clientWidth: width, clientHeight: height } = container;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      mobile = width < 1024;
      group.position.x = mobile ? 0 : 1.7;
      group.position.y = mobile ? 0.4 : 0;
      group.scale.setScalar(mobile ? 0.72 : 1.05);

      blueField.material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
      cyanField.material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    let visible = true;
    let running = false;
    let frame = 0;

    const renderFrame = () => {
      const elapsed = reduced ? 0 : elapsedSeconds();
      pointer.x += (target.x - pointer.x) * 0.045;
      pointer.y += (target.y - pointer.y) * 0.045;

      if (!reduced) {
        group.rotation.y = elapsed * 0.08 + pointer.x * 0.32;
        group.rotation.x = pointer.y * 0.18;
        group.rotation.z = Math.sin(elapsed * 0.12) * 0.05 + scrollProgress * 0.25;

        group.position.y = (mobile ? 0.4 : 0) - scrollProgress * 1.8;
        group.position.z = -scrollProgress * 1.2;

        nodeGroup.rotation.y = -elapsed * 0.14;
        nodeGroup.rotation.x = elapsed * 0.05;

        nodes.forEach((node) => {
          const speed = node.userData.speed as number;
          const offset = node.userData.offset as number;
          node.rotation.x = elapsed * speed + offset;
          node.rotation.y = elapsed * speed * 1.4 + offset;
        });

        wireSphere.rotation.y = elapsed * 0.05;
        outerWire.rotation.y = -elapsed * 0.03;
        outerWire.rotation.z = elapsed * 0.02;

        blueField.material.uniforms.uTime.value = elapsed;
        cyanField.material.uniforms.uTime.value = elapsed * 1.15;
        fresnelMaterial.uniforms.uTime.value = elapsed;
      }

      const opacity = Math.max(0, 1 - scrollProgress * 1.25);
      canvas.style.opacity = String(opacity);

      renderer.render(scene, camera);
    };

    const loop = () => {
      if (!running) return;
      renderFrame();
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduced || running || !visible || document.hidden) return;
      running = true;
      loop();
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.01 },
    );
    visibilityObserver.observe(container);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (reduced) {
      renderFrame();
    } else {
      start();
    }

    return () => {
      stop();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();

      const disposedGeometry = new Set<THREE.BufferGeometry>();
      const disposedMaterial = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          if (!disposedGeometry.has(object.geometry)) {
            disposedGeometry.add(object.geometry);
            object.geometry.dispose();
          }
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => {
            if (disposedMaterial.has(material)) return;
            disposedMaterial.add(material);
            material.dispose();
          });
        }
      });

      renderer.dispose();
      renderer.forceContextLoss();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
