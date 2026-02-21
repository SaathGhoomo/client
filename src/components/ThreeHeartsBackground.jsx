import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";

const COLORS = [
  0xff2d55,
  0xff6b9d,
  0xff4d6d,
  0xff1744,
  0xf06292,
  0xe91e8c,
  0xff80ab,
  0xc2185b,
  0xff69b4,
];

function randCol() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function mkHeartGeo(depth) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0, -0.28, -0.5, -0.28, -0.5, 0);
  s.bezierCurveTo(-0.5, 0.28, 0, 0.4, 0, 0.58);
  s.bezierCurveTo(0, 0.4, 0.5, 0.28, 0.5, 0);
  s.bezierCurveTo(0.5, -0.28, 0, -0.28, 0, 0);

  const g = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelSegments: 10,
    steps: 2,
    bevelSize: depth * 0.22,
    bevelThickness: depth * 0.22,
    curveSegments: 28,
  });
  g.center();
  return g;
}

function glassMat(col, op = 0.65) {
  return new THREE.MeshPhongMaterial({
    color: col,
    transparent: true,
    opacity: op,
    shininess: 260,
    specular: new THREE.Color(0xffffff),
    emissive: new THREE.Color(col).multiplyScalar(0.12),
    side: THREE.DoubleSide,
  });
}

const ThreeHeartsBackground = forwardRef(function ThreeHeartsBackground(
  { enableTrail = true, trailTargetRef },
  ref
) {
  const threeCanvasRef = useRef(null);
  const trailCanvasRef = useRef(null);

  const trailBurstRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      burst() {
        trailBurstRef.current?.();
      },
    }),
    []
  );

  useEffect(() => {
    if (!threeCanvasRef.current) return;

    let raf3d = 0;
    let rafTrail = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      canvas: threeCanvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    scene.add(new THREE.AmbientLight(0xffffff, 0.45));

    const pointLight = (c, x, y, z, i) => {
      const l = new THREE.PointLight(c, i, 60);
      l.position.set(x, y, z);
      scene.add(l);
      return l;
    };

    const L1 = pointLight(0xff69b4, 6, 6, 8, 3);
    const L2 = pointLight(0xff1744, -6, -4, 5, 2.5);
    pointLight(0xffffff, 0, 8, 6, 1.5);
    pointLight(0xff80ab, 0, -6, -4, 2);

    const gSm = mkHeartGeo(0.16);
    const gMd = mkHeartGeo(0.26);

    const bgH = [];
    const CARD_SPAWN_Z = -8;

    function spawnBgHeart() {
      const big = Math.random() > 0.6;
      const mesh = new THREE.Mesh(big ? gMd : gSm, glassMat(randCol(), 0));
      mesh.position.set(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 5,
        CARD_SPAWN_Z
      );
      const sc = (big ? 0.1 : 0.06) + Math.random() * 0.08;
      mesh.scale.setScalar(0);
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      mesh.userData = {
        vx: (Math.random() - 0.5) * 0.018,
        vy: (Math.random() - 0.5) * 0.018,
        vz: 0.022 + Math.random() * 0.028,
        rx: (Math.random() - 0.5) * 0.01,
        ry: (Math.random() - 0.5) * 0.01,
        rz: (Math.random() - 0.5) * 0.006,
        bs: sc,
        age: 0,
        life: 220 + Math.floor(Math.random() * 120),
      };

      scene.add(mesh);
      bgH.push(mesh);
    }

    for (let i = 0; i < 90; i++) {
      spawnBgHeart();
      bgH[i].userData.age = Math.floor(Math.random() * bgH[i].userData.life);
      const d = bgH[i].userData;
      bgH[i].position.z = CARD_SPAWN_Z + d.vz * d.age;
      bgH[i].position.x += d.vx * d.age;
      bgH[i].position.y += d.vy * d.age;
      bgH[i].scale.setScalar(d.bs);
      bgH[i].material.opacity = 0.65;
    }

    const clock = new THREE.Clock();

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };

    window.addEventListener("mousemove", onMouseMove);

    const animate3D = () => {
      raf3d = window.requestAnimationFrame(animate3D);

      const t = clock.getElapsedTime();

      const tx = (mx / window.innerWidth - 0.5) * 2;
      const ty = (-(my / window.innerHeight - 0.5) * 2);

      camera.position.x += (tx - camera.position.x) * 0.012;
      camera.position.y += (ty - camera.position.y) * 0.012;

      camera.lookAt(0, 0, 0);

      L1.position.set(Math.sin(t * 0.4) * 9, Math.cos(t * 0.3) * 9, 8);
      L2.position.set(Math.cos(t * 0.35) * 8, Math.sin(t * 0.5) * 6, 5);

      for (let i = bgH.length - 1; i >= 0; i--) {
        const h = bgH[i];
        const d = h.userData;
        d.age++;
        const p = d.age / d.life;

        let op;
        if (p < 0.15) op = p / 0.15;
        else if (p < 0.8) op = 1.0;
        else op = 1 - (p - 0.8) / 0.2;

        h.material.opacity = 0.72 * Math.max(0, op);
        h.scale.setScalar(d.bs * Math.min(1, p / 0.1));
        h.position.x += d.vx;
        h.position.y += d.vy;
        h.position.z += d.vz;
        h.rotation.x += d.rx;
        h.rotation.y += d.ry;
        h.rotation.z += d.rz;

        if (d.age >= d.life || h.position.z > camera.position.z + 2) {
          scene.remove(h);
          bgH.splice(i, 1);
          spawnBgHeart();
        }
      }

      renderer.render(scene, camera);
    };

    animate3D();

    let trail = null;

    if (enableTrail && trailCanvasRef.current) {
      const tc = trailCanvasRef.current;
      const trailRenderer = new THREE.WebGLRenderer({
        canvas: tc,
        alpha: true,
        antialias: true,
      });
      trailRenderer.setSize(window.innerWidth, window.innerHeight);
      trailRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      const trailScene = new THREE.Scene();
      const trailCamera = new THREE.OrthographicCamera(
        -window.innerWidth / 2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        -window.innerHeight / 2,
        0.1,
        200
      );
      trailCamera.position.z = 10;

      trailScene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const tL1 = new THREE.PointLight(0xff69b4, 5, 600);
      tL1.position.set(180, 180, 80);
      trailScene.add(tL1);

      const tL2 = new THREE.PointLight(0xff1744, 4, 600);
      tL2.position.set(-180, -150, 60);
      trailScene.add(tL2);

      const tL3 = new THREE.DirectionalLight(0xffffff, 1.4);
      tL3.position.set(0, 1, 1);
      trailScene.add(tL3);

      const trailGeo = mkHeartGeo(0.32);
      const TCOLORS = [
        0xff2d55,
        0xff6b9d,
        0xff4d6d,
        0xff80ab,
        0xffb3c6,
        0xe91e8c,
        0xf06292,
        0xc2185b,
      ];
      const randTC = () => TCOLORS[Math.floor(Math.random() * TCOLORS.length)];

      const POOL = 55;
      const trailPool = [];
      for (let i = 0; i < POOL; i++) {
        const m = glassMat(randTC(), 0);
        const mesh = new THREE.Mesh(trailGeo, m.clone());
        mesh.visible = false;
        mesh.userData = { active: false };
        trailScene.add(mesh);
        trailPool.push(mesh);
      }

      let poolIdx = 0;

      const toOrtho = (sx, sy) => ({
        x: sx - window.innerWidth / 2,
        y: -(sy - window.innerHeight / 2),
      });

      const spawnTrailHeart = (sx, sy, minSz, extra, vxM, vyB, angle) => {
        const h = trailPool[poolIdx % POOL];
        poolIdx++;

        const col = randTC();
        h.material.color.setHex(col);
        h.material.emissive.setHex(col);
        h.material.emissive.multiplyScalar(0.22);

        const { x, y } = toOrtho(sx, sy);
        const maxSz = minSz + Math.random() * extra;

        h.position.set(x, y, 0);
        h.rotation.set(
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.4
        );
        h.scale.setScalar(0);

        let vx;
        let vy;
        if (angle !== undefined) {
          const sp = 2.5 + Math.random() * 3;
          vx = Math.cos(angle) * sp * vxM;
          vy = Math.sin(angle) * sp + vyB;
        } else {
          vx = (Math.random() - 0.5) * vxM;
          vy = Math.random() * vyB + 0.4;
        }

        h.userData = {
          active: true,
          age: 0,
          life: 55 + Math.floor(Math.random() * 28),
          maxSz,
          vx,
          vy,
          rz: (Math.random() - 0.5) * 0.05,
        };
        h.visible = true;
      };

      const onTrailMove = (e) => {
        if (Math.random() > 0.5) return;
        spawnTrailHeart(
          e.clientX + (Math.random() - 0.5) * 14,
          e.clientY + (Math.random() - 0.5) * 14,
          7,
          9,
          1.0,
          1.4
        );
      };

      window.addEventListener("mousemove", onTrailMove);

      const burstHearts = () => {
        const rect = trailTargetRef?.current?.getBoundingClientRect?.();
        if (!rect) return;

        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        for (let i = 0; i < 22; i++) {
          window.setTimeout(() => {
            spawnTrailHeart(
              cx + (Math.random() - 0.5) * rect.width * 0.75,
              cy + (Math.random() - 0.5) * rect.height * 0.75,
              13,
              14,
              1,
              1.2,
              Math.random() * Math.PI * 2
            );
          }, i * 22);
        }
      };

      const animateTrail = () => {
        rafTrail = window.requestAnimationFrame(animateTrail);

        trailPool.forEach((h) => {
          if (!h.userData.active) return;

          const d = h.userData;
          d.age++;
          const p = d.age / d.life;

          if (p >= 1) {
            h.visible = false;
            d.active = false;
            return;
          }

          const ease = p < 0.25 ? p / 0.25 : 1 - (p - 0.25) / 0.75;
          h.scale.setScalar(d.maxSz * ease);
          h.material.opacity = 0.9 * ease;
          h.position.x += d.vx;
          h.position.y += d.vy;
          h.rotation.z += d.rz;
          d.vx *= 0.96;
          d.vy *= 0.983;
        });

        trailRenderer.render(trailScene, trailCamera);
      };

      animateTrail();

      trail = {
        renderer: trailRenderer,
        scene: trailScene,
        camera: trailCamera,
        burstHearts,
        onTrailMove,
      };
    }

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      if (trail?.renderer && trail?.camera) {
        trail.camera.left = -window.innerWidth / 2;
        trail.camera.right = window.innerWidth / 2;
        trail.camera.top = window.innerHeight / 2;
        trail.camera.bottom = -window.innerHeight / 2;
        trail.camera.updateProjectionMatrix();
        trail.renderer.setSize(window.innerWidth, window.innerHeight);
        trail.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      }
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(raf3d);
      window.cancelAnimationFrame(rafTrail);

      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);

      if (trail?.onTrailMove) window.removeEventListener("mousemove", trail.onTrailMove);

      bgH.forEach((h) => scene.remove(h));

      gSm.dispose();
      gMd.dispose();

      renderer.dispose();

      if (trail?.renderer) {
        trail.renderer.dispose();
      }

      if (trailBurstRef.current === trail?.burstHearts) {
        trailBurstRef.current = null;
      }
    };
  }, [enableTrail, trailTargetRef]);

  return (
    <>
      <canvas id="threeCanvas" ref={threeCanvasRef} />
      <canvas id="trailCanvas" ref={trailCanvasRef} />
    </>
  );
});

export default ThreeHeartsBackground;
