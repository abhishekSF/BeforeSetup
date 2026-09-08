import * as THREE from "three";

/** An original, quiet constellation; no ThreeUI source is used. */
export function mountAtlasDepth(host: HTMLDivElement): () => void {
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false }); }
  catch { host.dataset.renderer = "unavailable"; return () => {}; }
  host.dataset.renderer = "webgl";
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 8;
  const positions = new Float32Array(270);
  for (let index = 0; index < positions.length; index++) {
    positions[index] = Math.sin(index * 137.508) * 7;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0x7eabc7, size: 0.015, transparent: true, opacity: 0.45 });
  const field = new THREE.Points(geometry, material);
  scene.add(field);
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let visible = false;
  function frame(time: number) {
    field.rotation.z = Math.sin(time * 0.00002) * 0.04;
    renderer.render(scene, camera);
  }
  function update() {
    renderer.setAnimationLoop(null);
    renderer.render(scene, camera);
    if (visible && !document.hidden && !motion.matches) renderer.setAnimationLoop(frame);
  }
  const observer = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    update();
  });
  observer.observe(host);
  const resize = new ResizeObserver(() => {
    const width = Math.max(host.clientWidth, 1);
    const height = Math.max(host.clientHeight, 1);
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    update();
  });
  resize.observe(host);
  motion.addEventListener("change", update);
  document.addEventListener("visibilitychange", update);
  function lost(event: Event) { event.preventDefault(); renderer.setAnimationLoop(null); host.dataset.renderer = "unavailable"; }
  renderer.domElement.addEventListener("webglcontextlost", lost);
  return () => {
    observer.disconnect(); resize.disconnect();
    motion.removeEventListener("change", update);
    document.removeEventListener("visibilitychange", update);
    renderer.domElement.removeEventListener("webglcontextlost", lost);
    renderer.setAnimationLoop(null);
    geometry.dispose(); material.dispose(); renderer.dispose();
    renderer.domElement.remove();
  };
}
