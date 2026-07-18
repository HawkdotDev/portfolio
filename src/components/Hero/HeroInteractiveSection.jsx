import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useThemeStore } from "../../store/useThemeStore";

// ─── GLSL Simplex Noise Shader Implementation ───────────────────────
const simplexNoiseGLSL = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - D.yyy;

  i = mod(i, 289.0 );
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}
`;

// ─── Vertex Shader ──────────────────────────────────────────────────
// Morphs between Sphere, Monitor, and Phone base shapes, then adds organic wobbly noise
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
varying vec3 vPosition;
varying float vNoise;

${simplexNoiseGLSL}

// Mathematical mapping to generate Sphere, Monitor, or Phone shapes proceduraly
vec3 getShapePosition(float shapeIndex, vec3 pos) {
  // Shape 0: Sphere
  if (shapeIndex < 0.5) {
    return pos * 1.5;
  }
  
  // Spherical-to-box projection
  float maxCoord = max(max(abs(pos.x), abs(pos.y)), abs(pos.z));
  vec3 boxProj = pos / max(maxCoord, 0.001);
  
  // Shape 1: Computer Monitor
  if (shapeIndex < 1.5) {
    vec3 monitorPos = boxProj * vec3(1.7, 1.15, 0.25);
    
    // Procedural neck stand
    if (pos.y < -0.45 && abs(pos.x) < 0.2) {
      monitorPos.y -= 0.6;
    }
    // Procedural base stand
    if (pos.y < -0.8 && abs(pos.x) < 0.65) {
      monitorPos.y = -1.15;
      monitorPos.x *= 1.35;
    }
    return monitorPos;
  } 
  // Shape 2: Smartphone
  else {
    return boxProj * vec3(0.9, 1.6, 0.18);
  }
}

void main() {
  vNormal = normal;
  
  // Interpolate the base shape coordinates smoothly
  vec3 posPrev = getShapePosition(uPrevTarget, position);
  vec3 posCurr = getShapePosition(uTarget, position);
  vec3 basePos = mix(posPrev, posCurr, uTransition);
  
  // Calculate noise displacement on top of the base shape
  vec3 noisePosPrev = basePos * uNoiseFreq + vec3(0.0, 0.0, uTime * uSpeed + uPrevSeed * 12.5);
  vec3 noisePosCurr = basePos * uNoiseFreq + vec3(0.0, 0.0, uTime * uSpeed + uSeed * 12.5);
  
  float nPrev = snoise(noisePosPrev);
  float nCurr = snoise(noisePosCurr);
  float n = mix(nPrev, nCurr, uTransition);
  vNoise = n;
  
  // Displace vertex along normal
  vec3 displacedPosition = basePos + normal * n * uNoiseAmp;
  vPosition = displacedPosition;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
`;

// ─── Fragment Shader (Solid / Glass Base with Rim Glow) ─────────────
const fragmentShaderSolid = `
uniform vec3 uColor;
uniform float uOpacity;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vNoise;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  
  float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
  fresnel = pow(fresnel, 3.0);
  
  vec3 baseColor = vec3(0.05, 0.05, 0.08);
  vec3 finalColor = mix(baseColor, uColor, fresnel * 0.95);
  
  float alpha = mix(uOpacity, 0.85, fresnel);
  
  gl_FragColor = vec4(finalColor, alpha);
}
`;

// ─── Fragment Shader (Sketchy Wireframe) ───────────────────────────
const fragmentShaderWire = `
uniform vec3 uWireColor;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vNoise;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
  
  float alpha = mix(0.55, 0.25, fresnel);
  
  gl_FragColor = vec4(uWireColor, alpha);
}
`;

// ─── Organic Morphing Blob Component ───────────────────────────────
function OrganicBlob({ activeIndex }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const wireframeRef = useRef();

  const transitionRef = useRef(1.0);
  const stateRef = useRef({ prevSeed: 0, currentSeed: 0, prevTarget: 0, currentTarget: 0 });

  // Trigger smooth transition/morph state when loading panel changes
  useEffect(() => {
    const newSeed = Math.random() * 100;
    stateRef.current = {
      prevSeed: stateRef.current.currentSeed,
      currentSeed: newSeed,
      prevTarget: stateRef.current.currentTarget,
      currentTarget: activeIndex
    };
    transitionRef.current = 0.0;
  }, [activeIndex]);

  // Distinct noise characteristics based on active loading page panel
  const targetParams = useMemo(() => {
    if (activeIndex === 0) {
      // Sphere: Gentle, calm wobble
      return { freq: 1.1, amp: 0.24, speed: 0.5 };
    } else if (activeIndex === 1) {
      // Monitor: Spiky, tighter noise frequency
      return { freq: 2.3, amp: 0.14, speed: 1.2 };
    } else {
      // Phone: Fluid, wave-like organic motion
      return { freq: 1.5, amp: 0.28, speed: 0.8 };
    }
  }, [activeIndex]);

  const currentParams = useRef({ freq: 1.1, amp: 0.24, speed: 0.5 });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPrevSeed: { value: 0 },
    uSeed: { value: 0 },
    uPrevTarget: { value: 0.0 },
    uTarget: { value: 0.0 },
    uTransition: { value: 1.0 },
    uNoiseFreq: { value: 1.1 },
    uNoiseAmp: { value: 0.24 },
    uSpeed: { value: 0.5 },
    uColor: { value: new THREE.Color("#ff4444") },
    uWireColor: { value: new THREE.Color("#000000") },
    uOpacity: { value: 0.15 },
  }), []);

  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime();
    const d = Math.min(delta, 0.05);

    if (transitionRef.current < 1.0) {
      transitionRef.current = Math.min(1.0, transitionRef.current + d * 0.95);
    }

    const c = currentParams.current;
    const t = targetParams;
    const lerpSpeed = 3.5 * d;
    c.freq += (t.freq - c.freq) * lerpSpeed;
    c.amp += (t.amp - c.amp) * lerpSpeed;
    c.speed += (t.speed - c.speed) * lerpSpeed;

    // Query theme colors directly from Zustand store state on each frame
    // to bypass React re-render closure locks inside Three.js thread
    const theme = useThemeStore.getState().currentTheme;
    const isDark = useThemeStore.getState().isDarkMode;
    const brandColorStr = isDark && theme.dark ? theme.dark.brand : theme.brand;
    const textColorStr = isDark && theme.dark ? theme.dark.text : theme.text;

    // Update active uniforms directly on the meshes' materials to bypass Three.js uniform cloning
    const updateMaterialUniforms = (mat) => {
      if (!mat || !mat.uniforms) return;
      const u = mat.uniforms;
      u.uTime.value = elapsed;
      u.uPrevSeed.value = stateRef.current.prevSeed;
      u.uSeed.value = stateRef.current.currentSeed;
      u.uPrevTarget.value = stateRef.current.prevTarget;
      u.uTarget.value = stateRef.current.currentTarget;
      u.uTransition.value = transitionRef.current;
      u.uNoiseFreq.value = c.freq;
      u.uNoiseAmp.value = c.amp;
      u.uSpeed.value = c.speed;
      u.uColor.value.setStyle(brandColorStr);
      u.uWireColor.value.setStyle(textColorStr);
    };

    updateMaterialUniforms(meshRef.current?.material);
    updateMaterialUniforms(wireframeRef.current?.material);


    if (groupRef.current) {
      // Rotation: slower in index 0, faster in index 1 and 2 to showcase 3D depth of monitor/phone
      const rotSpeed = activeIndex === 0 ? 0.08 : 0.22;
      groupRef.current.rotation.y = elapsed * rotSpeed;
      groupRef.current.rotation.x = elapsed * (rotSpeed * 0.5);
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Translucent Base Globe with glowing Fresnel edges */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShaderSolid}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* 2. Synced sketchy wireframe mesh overlay */}
      <mesh ref={wireframeRef}>
        <sphereGeometry args={[1.805, 32, 32]} />
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

// ─── Main Export Component ─────────────────────────────────────────
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
