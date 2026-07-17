import React, { useState, useEffect, useRef, useMemo } from 'react';

export default function SketchyBorder({ className = "", double = true, isImage = false }) {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!svgRef.current) return;

    const svgElement = svgRef.current;
    
    // Initial measurement of the parent container size
    const parent = svgElement.parentElement;
    if (parent) {
      const rect = parent.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    }

    // Monitor resize events to adjust sketchy path dynamically
    const observer = new ResizeObserver(() => {
      if (parent) {
        const rect = parent.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    });

    if (parent) {
      observer.observe(parent);
    }

    return () => observer.disconnect();
  }, []);

  // Generate unique, wobbly sketchy paths based on container dimensions
  const paths = useMemo(() => {
    const W = dimensions.width || 100;
    const H = dimensions.height || 100;

    // Helper to generate a random offset in pixels
    const rnd = (min, max) => Math.random() * (max - min) + min;

    // Generates a single wobbly Bezier line path for an edge
    const createLinePath = (x1, y1, x2, y2, wobbleScale) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      
      // Normal vector (perpendicular)
      const nx = -dy / len;
      const ny = dx / len;

      // Tangent vector (parallel)
      const tx = dx / len;
      const ty = dy / len;

      // Two midpoints along the line (at 1/3 and 2/3 coordinates)
      const xA = x1 + dx * 0.33;
      const yA = y1 + dy * 0.33;
      const xB = x1 + dx * 0.67;
      const yB = y1 + dy * 0.67;

      // Displace control points perpendicular and slightly parallel to line direction
      const wA_perp = rnd(-wobbleScale, wobbleScale);
      const wA_para = rnd(-wobbleScale * 0.25, wobbleScale * 0.25);
      const wB_perp = rnd(-wobbleScale, wobbleScale);
      const wB_para = rnd(-wobbleScale * 0.25, wobbleScale * 0.25);

      const cp1x = xA + nx * wA_perp + tx * wA_para;
      const cp1y = yA + ny * wA_perp + ty * wA_para;
      const cp2x = xB + nx * wB_perp + tx * wB_para;
      const cp2y = yB + ny * wB_perp + ty * wB_para;

      // Draw cubic Bezier curve for organic wobble
      return `M ${x1.toFixed(1)},${y1.toFixed(1)} C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
    };

    // Generates a complete set of wobbly paths for all 4 edges
    const createEdgePaths = (wobble, overlap) => {
      if (isImage) {
        // Tight, perfect alignment to the container edges with zero overshoot
        const o = 1.3; // tiny offset inside container to prevent vector clipping
        const w = wobble * 0.45; // tighter, subtler wiggles for clean image borders
        const t = createLinePath(0, o, W, o, w);
        const r = createLinePath(W - o, 0, W - o, H, w);
        const b = createLinePath(W, H - o, 0, H - o, w);
        const l = createLinePath(o, H, o, 0, w);
        return `${t} ${r} ${b} ${l}`;
      } else {
        // Top line: left-to-right
        const t = createLinePath(
          -overlap, rnd(1.5, 4.5), 
          W + overlap, rnd(1.5, 4.5), 
          wobble
        );
        // Right line: top-to-bottom
        const r = createLinePath(
          W - rnd(1.5, 4.5), -overlap, 
          W - rnd(1.5, 4.5), H + overlap, 
          wobble
        );
        // Bottom line: right-to-left
        const b = createLinePath(
          W + overlap, H - rnd(1.5, 4.5), 
          -overlap, H - rnd(1.5, 4.5), 
          wobble
        );
        // Left line: bottom-to-top
        const l = createLinePath(
          rnd(1.5, 4.5), H + overlap, 
          rnd(1.5, 4.5), -overlap, 
          wobble
        );
        return `${t} ${r} ${b} ${l}`;
      }
    };

    // Calculate three passes with different characteristics to mimic actual sketching
    return {
      // Main thick ink outline (drawn with a steady but organic hand)
      inkThick: createEdgePaths(1.1, 4),
      // Medium ink pass (drawn with a bit more jitter and slightly wider offsets)
      inkMedium: createEdgePaths(1.8, 6),
      // Fine loose pencil guidelines (overshoots corners and has loose wiggles)
      pencil: createEdgePaths(3.2, 9)
    };
  }, [dimensions, isImage]);

  return (
    <svg
      ref={svgRef}
      className={`absolute w-full h-full inset-0 pointer-events-none z-30 text-[var(--color-border-main)] ${className}`}
      style={{ overflow: 'visible' }}
    >
      {/* 1. Fine loose pencil guidelines (underlay) */}
      {double && (
        <path
          d={paths.pencil}
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.45"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      )}

      {/* 2. Medium ink pass (creates double-drawn sketchy edges) */}
      {double && (
        <path
          d={paths.inkMedium}
          stroke="currentColor"
          strokeWidth="1.3"
          opacity="0.75"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      )}

      {/* 3. Main thick ink outline (top layer) */}
      <path
        d={paths.inkThick}
        stroke="currentColor"
        strokeWidth="2.3"
        opacity="0.95"
        fill="none"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
