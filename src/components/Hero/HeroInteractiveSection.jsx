import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useThemeStore } from "../../store/useThemeStore";

// ─── GLSL Simplex 3D Noise ──────────────────────────────────────────
const simplexNoiseGLSL = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float fbm(vec3 p, float freq, float lac, float gain) {
  float sum = 0.0, amp = 1.0, tot = 0.0;
  for (int i = 0; i < 3; i++) {
    sum += snoise(p * freq) * amp;
    tot += amp;
    freq *= lac;
    amp *= gain;
  }
  return sum / tot;
}
`;

// ─── Vertex Shader ──────────────────────────────────────────────────
const vertexShader = `
uniform float uTime;
uniform float uPrevSeed;
uniform float uSeed;
uniform float uPrevTarget;
uniform float uTarget;
uniform float uTransition;
uniform float uNoiseFreq;
uniform float uNoiseAmp;
uniform float uSpeed;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vNoise;

${simplexNoiseGLSL}

// ── Sphere-to-box projection with smooth edge rounding ──
vec3 cubeProject(vec3 pos, vec3 size, float rounding) {
  float mc = max(max(abs(pos.x), abs(pos.y)), abs(pos.z));
  vec3 cp = pos / max(mc, 0.0001);              // project onto unit cube
  vec3 scaled = cp * size;                        // scale to target dimensions
  // Round the corners by pulling extreme vertices inward
  vec3 clamped = clamp(scaled, -size + rounding, size - rounding);
  vec3 delta = scaled - clamped;
  float dl = length(delta);
  if (dl > 0.001) {
    scaled = clamped + delta * (rounding / dl);
  }
  return scaled;
}

// ── Shape 0: Organic sphere ──
vec3 shapeSphere(vec3 pos) {
  return pos * 1.23;
}

// ── Shape 1: Laptop (screen lid + keyboard deck) ──
vec3 shapeLaptop(vec3 pos) {
  float ny = pos.y / max(length(pos), 0.001);
  float len = max(length(pos), 0.001);

  // Shift hinge so laptop is perfectly centered at Y=0 and Z=0
  float hingeY = -1.04;
  float hingeZ = -0.69;

  // Remap ny for screen (ny from -0.15 to 1.0 -> -1.0 to 1.0)
  float screenY = (ny - 0.425) / 0.575;
  vec3 screenPos = vec3(pos.x, screenY * len, pos.z);
  vec3 screen = cubeProject(screenPos, vec3(1.8, 1.2, 0.05), 0.04);

  // Recess the screen on the front side (pos.z > 0.0)
  float localY = screen.y + 1.2; // 0 to 2.4
  if (pos.z > 0.0) {
    float screenMask = smoothstep(0.15, 0.3, localY) * (1.0 - smoothstep(2.1, 2.25, localY)) * (1.0 - smoothstep(1.5, 1.65, abs(screen.x)));
    screen.z -= screenMask * 0.025;
  }

  // Tilt screen backward ~20°
  float angle = 0.35;
  float tiltedY = -1.2 + localY * cos(angle);
  float tiltedZ = screen.z - localY * sin(angle);
  screen.y = tiltedY + hingeY + 1.2;
  screen.z = tiltedZ + hingeZ;

  // Remap ny for deck (ny from -1.0 to -0.15 -> -1.0 to 1.0)
  float deckY = (ny + 0.575) / 0.425;
  vec3 deckPos = vec3(pos.x, deckY * len, pos.z);
  vec3 deck = cubeProject(deckPos, vec3(1.8, 0.08, 1.05), 0.04);

  // Top of the deck: deck.y relative to deck center is > 0
  float localZ = deck.z + 1.05; // 0 to 2.1
  if (deck.y > 0.0) {
    // Keyboard well
    float kbMask = smoothstep(0.2, 0.35, localZ) * (1.0 - smoothstep(1.1, 1.25, localZ)) * (1.0 - smoothstep(1.4, 1.55, abs(deck.x)));
    deck.y -= kbMask * 0.035;

    // Trackpad well
    float tpMask = smoothstep(1.4, 1.55, localZ) * (1.0 - smoothstep(1.9, 2.05, localZ)) * (1.0 - smoothstep(0.35, 0.45, abs(deck.x)));
    deck.y -= tpMask * 0.015;
  }

  // Translate deck to meet hinge
  deck.z = localZ + hingeZ;
  deck.y = deck.y - 0.08 + hingeY;

  // Blend screen and deck
  float blend = smoothstep(-0.05, -0.22, ny);
  return mix(screen, deck, blend);
}

// ── Shape 2: Xbox Controller ──
vec3 shapeController(vec3 pos) {
  float ny = pos.y / max(length(pos), 0.001);
  float nx = pos.x / max(length(pos), 0.001);

  // Adjust yUp to center the controller perfectly at Y=0
  float yUp = 0.685;

  // --- Central body: wide rounded shape (Xbox is rounder than PS) ---
  vec3 body = cubeProject(pos, vec3(2.2, 0.75, 0.55), 0.3);
  body.y += yUp;

  // --- Left grip: thick, angled outward (Xbox style) ---
  vec3 gripL = cubeProject(pos, vec3(0.58, 1.4, 0.52), 0.22);
  gripL.x -= 1.65;
  gripL.y -= 0.9;
  gripL.y += yUp;

  // --- Right grip: mirror of left ---
  vec3 gripR = cubeProject(pos, vec3(0.58, 1.4, 0.52), 0.22);
  gripR.x += 1.65;
  gripR.y -= 0.9;
  gripR.y += yUp;

  // --- Bumpers/triggers: wide strip across top ---
  vec3 bumper = cubeProject(pos, vec3(1.9, 0.18, 0.4), 0.08);
  bumper.y += 0.75 + yUp;

  // --- Left thumbstick (higher up — Xbox asymmetric layout) ---
  vec3 lstick = cubeProject(pos, vec3(0.35, 0.35, 0.4), 0.12);
  lstick.x -= 0.65;
  lstick.y += 0.25 + yUp;
  lstick.z += 0.08;

  // --- Right thumbstick (lower — Xbox asymmetric layout) ---
  vec3 rstick = cubeProject(pos, vec3(0.35, 0.35, 0.4), 0.12);
  rstick.x += 0.65;
  rstick.y -= 0.15;
  rstick.y += yUp;
  rstick.z += 0.08;

  // --- Guide button center bump ---
  vec3 guide = cubeProject(pos, vec3(0.2, 0.2, 0.42), 0.1);
  guide.y += 0.35 + yUp;
  guide.z += 0.05;

  // Blending
  float leftGripBlend = smoothstep(-0.25, -0.6, nx) * smoothstep(0.2, -0.15, ny);
  float rightGripBlend = smoothstep(0.25, 0.6, nx) * smoothstep(0.2, -0.15, ny);
  float bumperBlend = smoothstep(0.5, 0.8, ny) * (1.0 - smoothstep(0.8, 0.95, abs(nx)));
  float lstickBlend = (1.0 - smoothstep(0.0, 0.45, abs(nx + 0.3))) * smoothstep(0.0, 0.35, ny) * (1.0 - smoothstep(0.5, 0.7, ny));
  float rstickBlend = (1.0 - smoothstep(0.0, 0.45, abs(nx - 0.3))) * smoothstep(-0.3, 0.0, ny) * (1.0 - smoothstep(0.15, 0.4, ny));
  float guideBlend = (1.0 - smoothstep(0.0, 0.25, abs(nx))) * smoothstep(0.1, 0.3, ny) * (1.0 - smoothstep(0.4, 0.55, ny));

  vec3 result = body;
  result = mix(result, gripL, leftGripBlend);
  result = mix(result, gripR, rightGripBlend);
  result = mix(result, bumper, bumperBlend * 0.5);
  result = mix(result, lstick, lstickBlend * 0.2);
  result = mix(result, rstick, rstickBlend * 0.2);
  result = mix(result, guide, guideBlend * 0.15);

  return result;
}

vec3 getShapePosition(float idx, vec3 pos) {
  if (idx < 0.5) return shapeSphere(pos);
  if (idx < 1.5) return shapeLaptop(pos);
  return shapeController(pos);
}

// Per-shape noise amplitude — shapes 1 & 2 get much less wobble
float getNoiseScale(float idx) {
  if (idx < 0.5) return 1.0;   // sphere: full noise
  if (idx < 1.5) return 0.15;  // laptop: barely visible ripple
  return 0.15;                  // xbox controller: subtle ripple
}

void main() {
  // Interpolate base shape
  vec3 posPrev = getShapePosition(uPrevTarget, position);
  vec3 posCurr = getShapePosition(uTarget, position);
  vec3 basePos = mix(posPrev, posCurr, uTransition);

  // Interpolate per-shape noise scaling
  float nsPrev = getNoiseScale(uPrevTarget);
  float nsCurr = getNoiseScale(uTarget);
  float noiseScale = mix(nsPrev, nsCurr, uTransition);

  // Multi-octave noise
  vec3 nPosPrev = basePos * uNoiseFreq + vec3(0.0, 0.0, uTime * uSpeed + uPrevSeed * 12.5);
  vec3 nPosCurr = basePos * uNoiseFreq + vec3(0.0, 0.0, uTime * uSpeed + uSeed * 12.5);
  float nPrev = fbm(nPosPrev, 1.0, 2.0, 0.45);
  float nCurr = fbm(nPosCurr, 1.0, 2.0, 0.45);
  float n = mix(nPrev, nCurr, uTransition);
  vNoise = n;

  // Displace — noiseScale dramatically reduces wobble on monitor/phone
  vec3 displaced = basePos + normal * n * uNoiseAmp * noiseScale;

  // Finite-difference normal recalculation for correct lighting
  float eps = 0.005;
  vec3 t1 = vec3(1.0, 0.0, 0.0);
  if (abs(dot(normal, t1)) > 0.99) t1 = vec3(0.0, 0.0, 1.0);
  t1 = normalize(cross(normal, t1));
  vec3 t2 = normalize(cross(normal, t1));

  vec3 pA = basePos + t1 * eps;
  vec3 pB = basePos + t2 * eps;
  float nA = fbm(pA * uNoiseFreq + vec3(0.0, 0.0, uTime * uSpeed + uSeed * 12.5), 1.0, 2.0, 0.45);
  float nB = fbm(pB * uNoiseFreq + vec3(0.0, 0.0, uTime * uSpeed + uSeed * 12.5), 1.0, 2.0, 0.45);
  vec3 dA = pA + normal * nA * uNoiseAmp * noiseScale;
  vec3 dB = pB + normal * nB * uNoiseAmp * noiseScale;

  vec3 reN = normalize(cross(dA - displaced, dB - displaced));
  vNormal = normalMatrix * reN;
  vWorldPos = (modelMatrix * vec4(displaced, 1.0)).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`;

// ─── Fragment Shader – Glass body ───────────────────────────────────
const fragmentShaderSolid = `
uniform vec3 uColor;
uniform float uOpacity;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vNoise;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);

  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.5);

  vec3 lightDir = normalize(vec3(0.6, 0.8, 0.5));
  float diff = max(dot(N, lightDir), 0.0) * 0.35;
  vec3 halfVec = normalize(lightDir + V);
  float spec = pow(max(dot(N, halfVec), 0.0), 32.0) * 0.4;

  vec3 baseColor = vec3(0.04, 0.04, 0.06);
  vec3 finalColor = mix(baseColor, uColor, fresnel * 0.9) + diff * uColor * 0.3 + spec * vec3(1.0);
  finalColor += vNoise * uColor * 0.06;

  float alpha = mix(uOpacity, 0.9, fresnel);
  gl_FragColor = vec4(finalColor, alpha);
}
`;

// ─── Fragment Shader – Wireframe ────────────────────────────────────
const fragmentShaderWire = `
uniform vec3 uWireColor;
varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);
  float fresnel = 1.0 - max(dot(N, V), 0.0);
  float alpha = mix(0.45, 0.1, pow(fresnel, 1.5));
  gl_FragColor = vec4(uWireColor, alpha);
}
`;

// ─── Cubic ease-in-out ─────────────────────────────────────────────
function cubicEaseInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ─── Organic Morphing Blob ─────────────────────────────────────────
function OrganicBlob({ activeIndex }) {
  const { gl } = useThree();
  const groupRef = useRef();
  const meshRef = useRef();
  const wireframeRef = useRef();

  const transitionRaw = useRef(1.0);
  const stateRef = useRef({ prevSeed: 0, currentSeed: 0, prevTarget: 0, currentTarget: 0 });
  
  // Interactive drag state
  const rotRef = useRef({ y: 0, x: 0 });
  const baseRot = useRef({ y: 0, x: 0 });
  const pointerStart = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  useEffect(() => {
    const newSeed = Math.random() * 100;
    stateRef.current = {
      prevSeed: stateRef.current.currentSeed,
      currentSeed: newSeed,
      prevTarget: stateRef.current.currentTarget,
      currentTarget: activeIndex
    };
    transitionRaw.current = 0.0;
  }, [activeIndex]);

  // Pointer drag event handlers
  useEffect(() => {
    const canvas = gl.domElement;
    
    const handlePointerDown = (e) => {
      isDragging.current = true;
      pointerStart.current = { x: e.clientX, y: e.clientY };
      baseRot.current = { x: rotRef.current.x, y: rotRef.current.y };
      canvas.style.cursor = "grabbing";
    };

    const handlePointerMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - pointerStart.current.x;
      const dy = e.clientY - pointerStart.current.y;
      
      // Update target rotation (scale factor controls sensitivity)
      rotRef.current.y = baseRot.current.y + dx * 0.007;
      rotRef.current.x = baseRot.current.x + dy * 0.007;
    };

    const handlePointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        canvas.style.cursor = "grab";
      }
    };

    canvas.style.cursor = "grab";
    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [gl]);

  // Per-shape parameters — monitor/phone get minimal noise, slow rotation
  const targetParams = useMemo(() => {
    if (activeIndex === 0) return { freq: 1.1, amp: 0.15, speed: 0.35, rotSpeed: 0.33, tiltX: 0 };
    if (activeIndex === 1) return { freq: 1.8, amp: 0.15, speed: 0.5, rotSpeed: 0.27, tiltX: 0 };
    return { freq: 1.5, amp: 0.15, speed: 0.45, rotSpeed: 0.27, tiltX: 0 };  // controller
  }, [activeIndex]);

  const currentParams = useRef({ freq: 1.1, amp: 0.15, speed: 0.35 });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPrevSeed: { value: 0 },
    uSeed: { value: 0 },
    uPrevTarget: { value: 0.0 },
    uTarget: { value: 0.0 },
    uTransition: { value: 1.0 },
    uNoiseFreq: { value: 1.1 },
    uNoiseAmp: { value: 0.22 },
    uSpeed: { value: 0.4 },
    uColor: { value: new THREE.Color("#ff4444") },
    uWireColor: { value: new THREE.Color("#000000") },
    uOpacity: { value: 0.15 },
  }), []);

  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime();
    const d = Math.min(delta, 0.05);

    // Advance transition
    if (transitionRaw.current < 1.0) {
      transitionRaw.current = Math.min(1.0, transitionRaw.current + d * 0.65);
    }
    const easedT = cubicEaseInOut(transitionRaw.current);

    // Smooth-lerp noise params
    const c = currentParams.current;
    const t = targetParams;
    const lr = 2.5 * d;
    c.freq += (t.freq - c.freq) * lr;
    c.amp += (t.amp - c.amp) * lr;
    c.speed += (t.speed - c.speed) * lr;

    // Theme colors from store
    const theme = useThemeStore.getState().currentTheme;
    const isDark = useThemeStore.getState().isDarkMode;
    const brandStr = isDark && theme.dark ? theme.dark.brand : theme.brand;
    const textStr = isDark && theme.dark ? theme.dark.text : theme.text;

    // Push uniforms to both materials
    const push = (mat) => {
      if (!mat?.uniforms) return;
      const u = mat.uniforms;
      u.uTime.value = elapsed;
      u.uPrevSeed.value = stateRef.current.prevSeed;
      u.uSeed.value = stateRef.current.currentSeed;
      u.uPrevTarget.value = stateRef.current.prevTarget;
      u.uTarget.value = stateRef.current.currentTarget;
      u.uTransition.value = easedT;
      u.uNoiseFreq.value = c.freq;
      u.uNoiseAmp.value = c.amp;
      u.uSpeed.value = c.speed;
      u.uColor.value.setStyle(brandStr);
      u.uWireColor.value.setStyle(textStr);
    };
    push(meshRef.current?.material);
    push(wireframeRef.current?.material);

    // Handle group rotation (manual dragging vs auto-spin)
    if (groupRef.current) {
      const r = rotRef.current;
      if (isDragging.current) {
        // Smoothly interpolate rotation to user drag target
        groupRef.current.rotation.y += (r.y - groupRef.current.rotation.y) * 0.2;
        groupRef.current.rotation.x += (r.x - groupRef.current.rotation.x) * 0.2;
      } else {
        // Increment automatic horizontal spin
        r.y += t.rotSpeed * d;
        // Slowly decay vertical rotation back to 0
        r.x += (0 - r.x) * 2.0 * d;

        // Smoothly glide to target position
        groupRef.current.rotation.y += (r.y - groupRef.current.rotation.y) * 0.1;
        groupRef.current.rotation.x += (r.x - groupRef.current.rotation.x) * 0.1;
      }
      // Floating animation
      groupRef.current.position.y = Math.sin(elapsed * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.8, 96, 96]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShaderSolid}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
      <mesh ref={wireframeRef}>
        <sphereGeometry args={[1.805, 40, 40]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShaderWire}
          uniforms={uniforms}
          wireframe
          transparent
          depthWrite={true}
        />
      </mesh>
    </group>
  );
}

// ─── Main Export ────────────────────────────────────────────────────
export default function HeroInteractiveSection({ activeIndex = 0 }) {
  return (
    <div className="absolute inset-0 z-0 transform translate-y-[25px]">
      <Canvas
        camera={{ position: [0, 0, 8.0], fov: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        <OrganicBlob activeIndex={activeIndex} />
      </Canvas>
    </div>
  );
}
