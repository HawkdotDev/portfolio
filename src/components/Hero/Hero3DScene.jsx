import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";

// ─── Technology Network Data ───────────────────────────────────────
const NODES = [
  { label: "React",      color: "#61dafb" },
  { label: "TypeScript",  color: "#3178c6" },
  { label: "Next.js",     color: "#cccccc" },
  { label: "Tailwind",    color: "#38bdf8" },
  { label: "Node.js",     color: "#68a063" },
  { label: "Python",      color: "#ffd43b" },
  { label: "GraphQL",     color: "#e535ab" },
  { label: "Postgres",    color: "#4169e1" },
  { label: "MongoDB",     color: "#47a248" },
  { label: "Docker",      color: "#2496ed" },
  { label: "AWS",         color: "#ff9900" },
  { label: "Git",         color: "#f05032" },
  { label: "GSAP",        color: "#88ce02" },
  { label: "Redis",       color: "#dc382d" },
  { label: "Rust",        color: "#dea584" },
];

// Meaningful connections between technologies
const EDGES = [
  [0, 1], [0, 2], [0, 3], [0, 12],
  [2, 4], [4, 1], [4, 6], [4, 7], [4, 8],
  [7, 6], [8, 13],
  [9, 10], [9, 4],
  [5, 7], [5, 13],
  [14, 4],
  [11, 9], [10, 7], [1, 6],
];

// Code snippets per technology (scrolling background texture)
const SNIPPETS = {
  React:      ["import React", "const App = () => {", "  const [s, set]", "  = useState(0)", "  useEffect(() => {", "    fetch(url)", "  }, [])", "  return (", "    <div>", "      <Button />", "    </div>", "  )", "}"],
  TypeScript: ["interface User {", "  name: string", "  age: number", "}", "type Result<T> = {", "  data: T", "  error?: string", "}", "const fn = <T,>", "  (x: T): T => x", "keyof typeof obj"],
  "Next.js":  ["export default Page", "getServerSideProps", "const router =", "  useRouter()", "app/layout.tsx", "export async", "  function gen() {", "  return { props }", "}", "middleware.ts"],
  Tailwind:   ["className='flex", "  items-center'", "text-red-600", "bg-gradient-to-r", "hover:scale-105", "dark:bg-slate-900", "md:grid-cols-3", "backdrop-blur-md", "transition-all", "duration-300"],
  "Node.js":  ["const express =", "  require('express')", "app.get('/', fn)", "app.listen(3000)", "module.exports = {", "  handler", "}", "process.env.PORT", "const fs = require", "  ('fs')"],
  Python:     ["def main():", "  print('hello')", "import numpy as np", "class Model:", "  def __init__(s):", "    self.data = []", "  def train(self):", "    return loss", "if __name__ ==", "  '__main__':"],
  GraphQL:    ["type Query {", "  user(id: ID!)", "    : User", "  posts: [Post]", "}", "mutation {", "  createUser(", "    name: String", "  ): User", "}", "subscription"],
  Postgres:   ["SELECT * FROM", "  users WHERE", "  age > 18", "JOIN orders ON", "  u.id = o.uid", "CREATE INDEX", "  ON users(name)", "INSERT INTO", "  logs VALUES", "  (now(), $1)"],
  MongoDB:    ["db.collection", "  .find({", "    age: {$gt: 18}", "  })", "  .sort({name:1})", "aggregate([", "  {$match: {}},", "  {$group: {", "    _id: '$type'", "  }}", "])"],
  Docker:     ["FROM node:20", "WORKDIR /app", "COPY . .", "RUN npm ci", "EXPOSE 3000", "CMD ['node',", "  'server.js']", "ENV NODE_ENV=", "  production", "HEALTHCHECK"],
  AWS:        ["aws s3 cp . s3://", "lambda.invoke({", "  FunctionName:", "  Payload: data", "})", "ec2.describe()", "cloudfront.create", "dynamodb.put({", "  TableName:", "  Item: {}  })"],
  Git:        ["git commit -m ''", "git push origin", "git merge develop", "git rebase -i", "  HEAD~3", "git stash pop", "git log --oneline", "git diff --staged", "git cherry-pick", "  abc1234"],
  GSAP:       ["gsap.to('.el', {", "  x: 100,", "  duration: 1,", "  ease: 'power2'", "})", "ScrollTrigger({", "  trigger: el,", "  start: 'top'", "})", "gsap.timeline()"],
  Redis:      ["SET key value", "GET key", "HSET user name", "  'john'", "LPUSH queue msg", "SUBSCRIBE chan", "EXPIRE key 3600", "MULTI", "  INCR counter", "EXEC"],
  Rust:       ["fn main() {", "  let x = 42;", "  println!(\"{}\",", "    x);", "}", "impl Trait for T", "  {", "  fn method(", "    &self) -> i32", "  { self.val }"],
};

// ─── Fibonacci sphere distribution ─────────────────────────────────
function spherePosition(index, total, radius) {
  const golden = (1 + Math.sqrt(5)) / 2;
  const theta = (2 * Math.PI * index) / golden;
  const phi = Math.acos(1 - (2 * (index + 0.5)) / total);
  return [
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

// ─── Utility helpers ───────────────────────────────────────────────
function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function hexRgb(hex) {
  return `${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)}`;
}

function codeLineColor(text, brandColor) {
  const t = text.trimStart();
  if (/^(import|from|const|let|var|function|return|export|class|def|type|interface|enum|SELECT|FROM|WHERE|JOIN|CREATE|SET|GET|RUN|CMD|COPY|EXPOSE|WORKDIR|fn |impl |pub |use |git |aws |gsap|app\.|db\.)/.test(t))
    return brandColor;
  if (/['"`]/.test(t)) return "#98c379";
  if (/^[{}()<>[\]]/.test(t)) return "#61afef";
  if (/^(\/\/|#|--)/.test(t)) return "#555555";
  return "#7a7a90";
}

// ─── Glow sprite texture ───────────────────────────────────────────
let _glowTex = null;
function getGlowTexture() {
  if (_glowTex) return _glowTex;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.2, "rgba(255,255,255,0.4)");
  g.addColorStop(0.5, "rgba(255,200,200,0.12)");
  g.addColorStop(1, "rgba(255,50,50,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  _glowTex = new THREE.CanvasTexture(c);
  return _glowTex;
}

// ─── Draw one frame of a holographic code card ─────────────────────
const CW = 256, CH = 160; // canvas dimensions

function drawCard(ctx, node, time, isHovered, pulseTime) {
  const w = CW, h = CH;
  const snippets = SNIPPETS[node.label] || SNIPPETS.React;
  const totalLines = snippets.length;
  const scrollSpeed = isHovered ? 22 : 10;
  const scrollY = (time * scrollSpeed) % (totalLines * 12);

  ctx.clearRect(0, 0, w, h);

  // ── 1. Dark background ──
  rrect(ctx, 0, 0, w, h, 8);
  ctx.fillStyle = "#0d0d1a";
  ctx.fill();

  // ── 2. Scrolling code lines (background texture) ──
  ctx.save();
  rrect(ctx, 0, 0, w, h, 8);
  ctx.clip();
  ctx.font = "9px Consolas, 'Courier New', monospace";
  ctx.textAlign = "left";
  const lineH = 12;
  const visibleCount = Math.ceil(h / lineH) + 2;
  const startIdx = Math.floor(scrollY / lineH);
  const offsetY = -(scrollY % lineH);

  for (let i = 0; i < visibleCount; i++) {
    const li = (startIdx + i) % totalLines;
    const y = 10 + i * lineH + offsetY;
    if (y < -lineH || y > h + lineH) continue;
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = codeLineColor(snippets[li], node.color);
    ctx.fillText(snippets[li], 8, y);
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // ── 3. Center vignette (readability overlay) ──
  const vg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.55);
  vg.addColorStop(0, "rgba(13,13,26,0.95)");
  vg.addColorStop(0.45, "rgba(13,13,26,0.7)");
  vg.addColorStop(1, "rgba(13,13,26,0)");
  ctx.save();
  rrect(ctx, 0, 0, w, h, 8);
  ctx.clip();
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  // ── 4. Tech name (prominent center) ──
  ctx.font = "bold 26px Consolas, 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // Text shadow / glow
  ctx.shadowColor = node.color;
  ctx.shadowBlur = isHovered ? 18 : 8;
  ctx.fillStyle = node.color;
  ctx.fillText(node.label, w / 2, h / 2 + 2);
  ctx.shadowBlur = 0;

  // ── 5. Window dots (top-left) ──
  const dotColors = ["#ff5f57", "#ffbd2e", "#28ca41"];
  dotColors.forEach((c, i) => {
    ctx.beginPath();
    ctx.arc(12 + i * 12, 12, 3, 0, Math.PI * 2);
    ctx.fillStyle = c;
    ctx.fill();
  });

  // ── 6. Top bar separator line ──
  ctx.strokeStyle = `rgba(${hexRgb(node.color)}, 0.15)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(6, 22);
  ctx.lineTo(w - 6, 22);
  ctx.stroke();

  // ── 7. Border glow ──
  rrect(ctx, 0.5, 0.5, w - 1, h - 1, 8);
  ctx.strokeStyle = node.color;
  ctx.lineWidth = isHovered ? 2.5 : 1.2;
  ctx.globalAlpha = isHovered ? 0.95 : 0.35;
  ctx.stroke();
  ctx.globalAlpha = 1;

  // ── 8. Scan line on hover ──
  if (isHovered) {
    ctx.save();
    rrect(ctx, 0, 0, w, h, 8);
    ctx.clip();
    const scanY = (time * 60) % h;
    const sg = ctx.createLinearGradient(0, scanY - 8, 0, scanY + 8);
    sg.addColorStop(0, "transparent");
    sg.addColorStop(0.5, `rgba(${hexRgb(node.color)}, 0.12)`);
    sg.addColorStop(1, "transparent");
    ctx.fillStyle = sg;
    ctx.fillRect(0, scanY - 8, w, 16);
    ctx.restore();
  }

  // ── 9. Pulse flash overlay ──
  if (pulseTime) {
    const elapsed = performance.now() - pulseTime;
    if (elapsed < 700) {
      const alpha = 0.25 * Math.sin((elapsed / 700) * Math.PI);
      ctx.save();
      rrect(ctx, 0, 0, w, h, 8);
      ctx.clip();
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }
  }

  // ── 10. Blinking cursor ──
  if (Math.sin(time * 4) > 0) {
    const cursorLine = snippets[(Math.floor(scrollY / lineH) + 4) % totalLines];
    ctx.font = "9px Consolas, 'Courier New', monospace";
    const cursorX = 8 + ctx.measureText(cursorLine).width + 2;
    const cursorY = h / 2 + 24;
    ctx.fillStyle = node.color;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(Math.min(cursorX, w - 14), cursorY, 6, 10);
    ctx.globalAlpha = 1;
  }
}

// ─── Data-flow particles along edges ───────────────────────────────
function FlowParticles({ positions }) {
  const ref = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = EDGES.length * 2;

  const particles = useMemo(
    () =>
      EDGES.flatMap((_, ei) =>
        [0, 1].map(() => ({
          edge: ei,
          t: Math.random(),
          speed: 0.05 + Math.random() * 0.12,
          dir: Math.random() > 0.5 ? 1 : -1,
        }))
      ),
    []
  );

  useFrame((_, delta) => {
    if (!ref.current) return;
    const d = Math.min(delta, 0.05);
    particles.forEach((p, i) => {
      p.t = ((p.t + d * p.speed * p.dir) % 1 + 1) % 1;
      const [ai, bi] = EDGES[p.edge];
      const a = positions[ai], b = positions[bi];
      dummy.position.set(
        a[0] + (b[0] - a[0]) * p.t,
        a[1] + (b[1] - a[1]) * p.t,
        a[2] + (b[2] - a[2]) * p.t
      );
      dummy.scale.setScalar(0.015);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
    </instancedMesh>
  );
}

// ─── Main interactive network ──────────────────────────────────────
function TechNetwork() {
  const groupRef = useRef();
  const cardGroupRefs = useRef([]);
  const [hovered, setHovered] = useState(-1);
  const pulseRef = useRef({});
  const frameCount = useRef(0);

  const positions = useMemo(
    () => NODES.map((_, i) => spherePosition(i, NODES.length, 2.8)),
    []
  );

  const glowTex = useMemo(() => getGlowTexture(), []);

  // Create canvases + textures once
  const canvasData = useMemo(() =>
    NODES.map(() => {
      const canvas = document.createElement("canvas");
      canvas.width = CW;
      canvas.height = CH;
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      return { canvas, ctx: canvas.getContext("2d"), texture };
    }),
    []
  );

  // Pre-compute edge geometry buffers
  const edgeArrays = useMemo(
    () => EDGES.map(([a, b]) => new Float32Array([...positions[a], ...positions[b]])),
    [positions]
  );

  // Neighbors of hovered node
  const neighborSet = useMemo(() => {
    if (hovered < 0) return new Set();
    const s = new Set();
    EDGES.forEach(([a, b]) => {
      if (a === hovered) s.add(b);
      if (b === hovered) s.add(a);
    });
    return s;
  }, [hovered]);

  // Click → pulse + propagate to neighbors
  const handleClick = useCallback((idx) => {
    const now = performance.now();
    pulseRef.current[idx] = now;
    EDGES.forEach(([a, b]) => {
      const neighbor = a === idx ? b : b === idx ? a : null;
      if (neighbor !== null) {
        setTimeout(() => { pulseRef.current[neighbor] = performance.now(); }, 100 + Math.random() * 250);
      }
    });
  }, []);

  // Keyboard: random node pulse
  useEffect(() => {
    const handler = (e) => {
      if (e.repeat) return;
      const idx = Math.floor(Math.random() * NODES.length);
      pulseRef.current[idx] = performance.now();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useFrame(({ clock }) => {
    // Slow auto-rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }

    frameCount.current++;

    // Update canvas textures every 2 frames (30fps for sprite animations)
    if (frameCount.current % 2 === 0) {
      const time = clock.getElapsedTime();
      canvasData.forEach((cd, i) => {
        drawCard(cd.ctx, NODES[i], time, hovered === i, pulseRef.current[i]);
        cd.texture.needsUpdate = true;
      });
    }

    // Smooth scale animation for card groups (every frame for smoothness)
    cardGroupRefs.current.forEach((g, i) => {
      if (!g) return;
      const isHov = hovered === i;
      const isNeighbor = neighborSet.has(i);
      const target = isHov ? 1.5 : isNeighbor ? 1.15 : 1.0;
      const cs = g.scale.x;
      g.scale.setScalar(cs + (target - cs) * 0.1);
    });
  });

  return (
    <group ref={groupRef}>
      {/* ── Connection lines ──────────────────────────────────── */}
      {EDGES.map(([a, b], i) => {
        const lit = hovered === a || hovered === b;
        return (
          <line key={`e${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={edgeArrays[i]}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={lit ? "#ff4444" : "#888888"}
              transparent
              opacity={lit ? 0.5 : 0.06}
            />
          </line>
        );
      })}

      {/* ── Flow particles ────────────────────────────────────── */}
      <FlowParticles positions={positions} />

      {/* ── Animated sprite cards ─────────────────────────────── */}
      {NODES.map((node, i) => {
        const pos = positions[i];
        return (
          <Billboard key={node.label} position={pos}>
            <group ref={(el) => { cardGroupRefs.current[i] = el; }}>
              {/* Holographic code card */}
              <mesh>
                <planeGeometry args={[0.85, 0.53]} />
                <meshBasicMaterial
                  map={canvasData[i].texture}
                  transparent
                  side={THREE.DoubleSide}
                />
              </mesh>

              {/* Glow sprite behind card */}
              <sprite position={[0, 0, -0.02]} scale={[1.1, 0.7, 1]}>
                <spriteMaterial
                  map={glowTex}
                  color={node.color}
                  transparent
                  opacity={hovered === i ? 0.7 : 0.25}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </sprite>

              {/* Invisible hitbox */}
              <mesh
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHovered(i);
                  document.body.style.cursor = "pointer";
                }}
                onPointerOut={() => {
                  setHovered(-1);
                  document.body.style.cursor = "";
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(i);
                }}
              >
                <planeGeometry args={[0.95, 0.63]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
              </mesh>
            </group>
          </Billboard>
        );
      })}
    </group>
  );
}

// ─── Mouse-reactive camera parallax ────────────────────────────────
function CameraRig() {
  const { camera, gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    gl.domElement.addEventListener("pointermove", handler);
    return () => gl.domElement.removeEventListener("pointermove", handler);
  }, [gl]);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 1.5 - camera.position.x) * 0.03;
    camera.position.y += (mouse.current.y * 1.0 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Main export ───────────────────────────────────────────────────
export default function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-20">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
        <pointLight position={[-4, -2, 3]} intensity={0.25} color="#ff4444" />

        <TechNetwork />
        <CameraRig />
      </Canvas>
    </div>
  );
}
