'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

export default function ThreeDeeSkinModel() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const frameIdRef = useRef<number>();
  const lastScrollY = useRef(0);

  const startColor = useRef(new THREE.Color('hsl(330, 80%, 65%)')); // Radiant Pink
  const midColor = useRef(new THREE.Color('hsl(300, 70%, 70%)')); // Soft Lavender
  const endColor = useRef(new THREE.Color('hsl(330, 20%, 34%)')); // Muted Purple

  const onScroll = useCallback(() => {
    if (meshRef.current && meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        const scrollDelta = window.scrollY - lastScrollY.current;
        const rotationAmount = (scrollDelta / (document.body.scrollHeight - window.innerHeight)) * (Math.PI / 8);
        meshRef.current.rotation.y += rotationAmount;
        lastScrollY.current = window.scrollY;

        const scrollPercent = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);
        
        const newColor = new THREE.Color();
        if (scrollPercent < 0.5) {
            newColor.lerpColors(startColor.current, midColor.current, scrollPercent * 2);
        } else {
            newColor.lerpColors(midColor.current, endColor.current, (scrollPercent - 0.5) * 2);
        }
        (meshRef.current.material as THREE.MeshStandardMaterial).color.set(newColor);
    }
  }, [endColor, midColor, startColor]);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    sceneRef.current = new THREE.Scene();

    cameraRef.current = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    cameraRef.current.position.z = 5;

    rendererRef.current = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rendererRef.current.setSize(currentMount.clientWidth, currentMount.clientHeight);
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(rendererRef.current.domElement);
    
    const geometry = new THREE.IcosahedronGeometry(2.5, 1);
    
    const material = new THREE.MeshStandardMaterial({
      color: startColor.current,
      wireframe: true,
      roughness: 0.5,
      metalness: 0.2,
      transparent: true,
      opacity: 0.3,
    });
    
    meshRef.current = new THREE.Mesh(geometry, material);
    sceneRef.current.add(meshRef.current);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xE6A8DE, 2); // Radiant Pink
    directionalLight.position.set(5, 5, 5);
    sceneRef.current.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xD99EEA, 4, 100); // Soft Lavender
    pointLight.position.set(-5, -5, -5);
    sceneRef.current.add(pointLight);


    const mouse = new THREE.Vector2();
    const targetRotation = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
        if (!currentMount) return;
        const rect = currentMount.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / currentMount.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / currentMount.clientHeight) * 2 + 1;
        targetRotation.x = mouse.y * 0.2;
        targetRotation.y = mouse.x * 0.2;
    }
    currentMount.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    lastScrollY.current = window.scrollY;

    const clock = new THREE.Clock();

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (meshRef.current && cameraRef.current && sceneRef.current && rendererRef.current) {
        const elapsedTime = clock.getElapsedTime();
        
        meshRef.current.rotation.y += (targetRotation.y - meshRef.current.rotation.y) * 0.02 + 0.0005;
        meshRef.current.rotation.x += (targetRotation.x - meshRef.current.rotation.x) * 0.02 + 0.0002;
        
        const scale = 1 + Math.sin(elapsedTime * 0.5) * 0.05;
        meshRef.current.scale.set(scale, scale, scale);

        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    const handleResize = () => {
      if (!currentMount || !rendererRef.current || !cameraRef.current) return;
      cameraRef.current.aspect = currentMount.clientWidth / currentMount.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', onScroll);
      if (currentMount) {
        currentMount.removeEventListener('mousemove', onMouseMove);
        if (rendererRef.current && rendererRef.current.domElement.parentElement === currentMount) {
          currentMount.removeChild(rendererRef.current.domElement);
        }
      }
      if(frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      geometry.dispose();
      material.dispose();
    };
  }, [onScroll]);

  return <div ref={mountRef} className="w-full h-full" aria-hidden="true" />;
}
