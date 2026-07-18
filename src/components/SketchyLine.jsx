import React, { useState, useEffect, useRef, useMemo } from 'react';

export default function SketchyLine({ 
  direction = "horizontal", // "horizontal" or "vertical"
  className = "", 
  double = true, 
  wobbleScale = 1.1,
  color = "currentColor"
}) {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!svgRef.current) return;

    const svgElement = svgRef.current;
    const parent = svgElement.parentElement;
    if (parent) {
      const width = parent.offsetWidth || parent.getBoundingClientRect().width;
      const height = parent.offsetHeight || parent.getBoundingClientRect().height;
      setDimensions({ width, height });
    }

    const observer = new ResizeObserver(() => {
      if (parent) {
        const width = parent.offsetWidth || parent.getBoundingClientRect().width;
        const height = parent.offsetHeight || parent.getBoundingClientRect().height;
        setDimensions({ width, height });
      }
    });

    if (parent) {
      observer.observe(parent);
    }

    return () => observer.disconnect();
  }, []);

  const paths = useMemo(() => {
    const W = dimensions.width || 100;
    const H = dimensions.height || 100;

    const rnd = (min, max) => Math.random() * (max - min) + min;

    const createLinePath = (x1, y1, x2, y2, scale) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;

      const segments = 6;
      let path = `M ${x1.toFixed(1)},${y1.toFixed(1)}`;
      
      for (let i = 1; i <= segments; i++) {
        const tPrev = (i - 1) / segments;
        const tCurr = i / segments;
        
        const pxPrev = x1 + dx * tPrev;
        const pyPrev = y1 + dy * tPrev;
        const pxCurr = x1 + dx * tCurr;
        const pyCurr = y1 + dy * tCurr;
        
        const mx = (pxPrev + pxCurr) / 2;
        const my = (pyPrev + pyCurr) / 2;
        
        const dir = i % 2 === 0 ? 1 : -1;
        const wobble = rnd(scale * 0.4, scale * 1.5) * dir;
        const cx = mx + nx * wobble;
        const cy = my + ny * wobble;
        
        path += ` Q ${cx.toFixed(1)},${cy.toFixed(1)} ${pxCurr.toFixed(1)},${pyCurr.toFixed(1)}`;
      }
      
      return path;
    };

    const getPathsForScale = (scale) => {
      if (direction === "vertical") {
        // Draw down the left side (x ≈ 1.5px to avoid clip)
        const offset = 1.5;
        return createLinePath(offset, -4, offset, H + 4, scale);
      } else {
        // Draw across the top side (y ≈ 1.5px to avoid clip)
        const offset = 1.5;
        return createLinePath(-4, offset, W + 4, offset, scale);
      }
    };

    return {
      inkThick: getPathsForScale(wobbleScale),
      inkMedium: getPathsForScale(wobbleScale * 1.5),
      pencil: getPathsForScale(wobbleScale * 2.5),
    };
  }, [dimensions, direction, wobbleScale]);

  return (
    <svg
      ref={svgRef}
      className={`absolute inset-0 pointer-events-none z-30 ${className}`}
      style={{ 
        width: '100%', 
        height: '100%', 
        overflow: 'visible',
        color: color
      }}
    >
      {/* Pencil guide path */}
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

      {/* Medium outline path */}
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

      {/* Thick ink outline path */}
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
