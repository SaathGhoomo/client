import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

export default function ThreeCoin() {
  const mountRef = useRef(null);
  const animationRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Remove old canvas if exists (prevents double coin)
    mountRef.current.innerHTML = "";

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(320, 320);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // LIGHTING (Enhanced for ultra-shiny effect)
    const ambient = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambient);

    // Torch-style spotlight pointing at coin
    const torchLight = new THREE.SpotLight(0xffffff, 4.5, 15, Math.PI / 6, 0.3, 2);
    torchLight.position.set(-4, 3, 4);
    torchLight.target.position.set(0, 0, 0);
    torchLight.angle = Math.PI / 8;
    torchLight.penumbra = 0.2;
    torchLight.decay = 2;
    scene.add(torchLight);
    scene.add(torchLight.target);

    // Bright accent light (theme-matching pink)
    const warmLight = new THREE.PointLight(0xff99cc, 3.0, 10);
    warmLight.position.set(3, 2, 3);
    scene.add(warmLight);

    // Cool rim light for depth
    const rimLight = new THREE.DirectionalLight(0x87ceeb, 1.5);
    rimLight.position.set(-2, -3, 5);
    scene.add(rimLight);

    // Add top light for maximum shine
    const topLight = new THREE.DirectionalLight(0xffffff, 2.0);
    topLight.position.set(0, 5, 2);
    scene.add(topLight);

    // Additional bright side light for extra shine
    const sideLight = new THREE.DirectionalLight(0xffffff, 1.8);
    sideLight.position.set(5, 0, 0);
    scene.add(sideLight);

    // ULTRA-SHINY MODERN SILVER MATERIAL
    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf0f0f0, // bright, shiny silver
      metalness: 1.0,
      roughness: 0.01, // ultra-smooth for maximum shine
      clearcoat: 0.9,
      clearcoatRoughness: 0.01,
      reflectivity: 1.0,
      envMapIntensity: 3.0,
      transmission: 0.0,
      thickness: 0,
      ior: 0.3,
      emissive: 0xff99cc,
      emissiveIntensity: 0.25,
      specularColor: 0xffffff,
      specularIntensity: 2.0,
    });

    const geometry = new THREE.CylinderGeometry(1, 1, 0.15, 100);
    geometry.rotateX(Math.PI / 2);

    const coin = new THREE.Mesh(geometry, goldMaterial);
    scene.add(coin);

    // Stage-style bottom lighting (yellow and white)
    const stageLight1 = new THREE.SpotLight(0xffff99, 2, 8, Math.PI / 4, 0.3, 1.5);
    stageLight1.position.set(0, -3, 2);
    stageLight1.target.position.set(0, 0, 0);
    scene.add(stageLight1);
    scene.add(stageLight1.target);

    const stageLight2 = new THREE.SpotLight(0xffffff, 1.5, 6, Math.PI / 4, 0.4, 1.8);
    stageLight2.position.set(-2, -2.5, 1);
    stageLight2.target.position.set(0, 0, 0);
    scene.add(stageLight2);
    scene.add(stageLight2.target);

    const stageLight3 = new THREE.SpotLight(0xffffff, 1.2, 6, Math.PI / 4, 0.4, 1.8);
    stageLight3.position.set(2, -2.5, 1);
    stageLight3.target.position.set(0, 0, 0);
    scene.add(stageLight3);
    scene.add(stageLight3.target);

    // Add realistic shadow plane
    const shadowGeometry = new THREE.PlaneGeometry(6, 6);
    const shadowMaterial = new THREE.ShadowMaterial({
      opacity: 0.4,
      transparent: true,
    });
    const shadowPlane = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.5;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Enable shadows in renderer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.width = 2048;
    renderer.shadowMap.height = 2048;

    // Configure lights to cast shadows
    torchLight.castShadow = true;
    torchLight.shadow.mapSize.width = 2048;
    torchLight.shadow.mapSize.height = 2048;
    torchLight.shadow.camera.near = 0.5;
    torchLight.shadow.camera.far = 15;
    torchLight.shadow.camera.fov = 30;

    warmLight.castShadow = true;
    warmLight.shadow.mapSize.width = 1024;
    warmLight.shadow.mapSize.height = 1024;

    topLight.castShadow = true;
    topLight.shadow.mapSize.width = 1024;
    topLight.shadow.mapSize.height = 1024;

    // Stage lights cast shadows
    stageLight1.castShadow = true;
    stageLight1.shadow.mapSize.width = 512;
    stageLight1.shadow.mapSize.height = 512;

    stageLight2.castShadow = true;
    stageLight2.shadow.mapSize.width = 512;
    stageLight2.shadow.mapSize.height = 512;

    stageLight3.castShadow = true;
    stageLight3.shadow.mapSize.width = 512;
    stageLight3.shadow.mapSize.height = 512;

    // Coin casts shadow
    coin.castShadow = true;

    // Load Font for "S" (front) and "C" (back)
    const loader = new FontLoader();
    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
      (font) => {
        // Front "S"
        const textGeoS = new TextGeometry("S", {
          font: font,
          size: 0.7,
          height: 0.08,
          curveSegments: 12,
        });
        textGeoS.center();

        const textMatS = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: 1,
          roughness: 0.2,
        });

        const textMeshS = new THREE.Mesh(textGeoS, textMatS);
        textMeshS.position.z = 0.09;
        coin.add(textMeshS);

        // Back "C"
        const textGeoC = new TextGeometry("C", {
          font: font,
          size: 0.7,
          height: 0.08,
          curveSegments: 12,
        });
        textGeoC.center();

        const textMatC = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: 1,
          roughness: 0.2,
        });

        const textMeshC = new THREE.Mesh(textGeoC, textMatC);
        textMeshC.position.z = -0.09;
        textMeshC.rotation.y = Math.PI; // flip to face back
        coin.add(textMeshC);
      }
    );

    // Animation loop with stage lighting effects
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Continuous rotation
      coin.rotation.y += 0.02;
      
      // Dynamic torch light movement (circles around coin)
      const torchRadius = 5;
      const torchAngle = Date.now() * 0.0005;
      torchLight.position.x = Math.cos(torchAngle) * torchRadius;
      torchLight.position.z = Math.sin(torchAngle) * torchRadius;
      torchLight.position.y = 3 + Math.sin(Date.now() * 0.001) * 0.5;
      
      // Torch always aims at coin center
      torchLight.target.position.set(0, 0, 0);
      
      // Stage lights pulse with theme
      const stageIntensity = 1.0 + Math.sin(Date.now() * 0.003) * 0.3;
      stageLight1.intensity = stageIntensity * 2;
      stageLight2.intensity = stageIntensity * 1.5;
      stageLight3.intensity = stageIntensity * 1.2;
      
      // Warm light pulses
      const warmIntensity = 1.8 + Math.sin(Date.now() * 0.002) * 0.4;
      warmLight.intensity = warmIntensity;
      
      // Hover effects
      if (hovering) {
        coin.scale.x = coin.scale.y = coin.scale.z = THREE.MathUtils.lerp(coin.scale.x, 1.15, 0.1);
        coin.position.y = Math.sin(Date.now() * 0.003) * 0.1;
        // Boost all lights on hover
        torchLight.intensity = THREE.MathUtils.lerp(torchLight.intensity, 5.5, 0.1);
        warmLight.intensity = warmIntensity * 1.5;
        stageLight1.intensity = stageIntensity * 3;
        stageLight2.intensity = stageIntensity * 2.2;
        stageLight3.intensity = stageIntensity * 1.8;
      } else {
        coin.scale.x = coin.scale.y = coin.scale.z = THREE.MathUtils.lerp(coin.scale.x, 1.0, 0.1);
        coin.position.y = Math.sin(Date.now() * 0.001) * 0.04;
        torchLight.intensity = THREE.MathUtils.lerp(torchLight.intensity, 4.0, 0.1);
      }
      
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: 320,
        height: 320,
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    />
  );
}