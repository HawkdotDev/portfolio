import { useState, useEffect, useRef } from "react";
import SketchyBorder from "../SketchyBorder";

export default function EyeFollowRobot() {
  const catRef = useRef(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [transparentSrc, setTransparentSrc] = useState("");
  const [eyeColor, setEyeColor] = useState("#52b788"); // Fallback green

  useEffect(() => {
    const img = new Image();
    img.src = "/cat.png";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Sample the green color from the left eye center
      const sampleX = Math.round(width * 0.3762);
      const sampleY = Math.round(height * 0.3154);
      const sampleIdx = (sampleY * width + sampleX) * 4;
      if (sampleIdx < data.length) {
        setEyeColor(`rgb(${data[sampleIdx]}, ${data[sampleIdx + 1]}, ${data[sampleIdx + 2]})`);
      }

      // 2. Flood-fill BFS to key out white background only
      const visited = new Uint8Array(width * height);
      const queue = [];

      // Seed BFS from all 4 borders
      for (let x = 0; x < width; x++) {
        queue.push(x, 0);
        visited[x] = 1;
        queue.push(x, height - 1);
        visited[(height - 1) * width + x] = 1;
      }
      for (let y = 0; y < height; y++) {
        queue.push(0, y);
        visited[y * width] = 1;
        queue.push(width - 1, y);
        visited[y * width + (width - 1)] = 1;
      }

      let qHead = 0;
      while (qHead < queue.length) {
        const cx = queue[qHead++];
        const cy = queue[qHead++];
        const idx = (cy * width + cx) * 4;

        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Treat white/near-white pixels as background
        if (r > 240 && g > 240 && b > 240) {
          data[idx + 3] = 0; // set transparent

          // Check 4-way neighbors
          const dirs = [
            [cx + 1, cy],
            [cx - 1, cy],
            [cx, cy + 1],
            [cx, cy - 1],
          ];

          for (const [nx, ny] of dirs) {
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nIdx = ny * width + nx;
              if (visited[nIdx] === 0) {
                visited[nIdx] = 1;
                queue.push(nx, ny);
              }
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setTransparentSrc(canvas.toDataURL("image/png"));
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!catRef.current) return;

      const rect = catRef.current.getBoundingClientRect();
      // Estimate face center relative to the cat's box
      const faceX = rect.left + rect.width * 0.50;
      const faceY = rect.top + rect.height * 0.33;

      const deltaX = e.clientX - faceX;
      const deltaY = e.clientY - faceY;
      const angle = Math.atan2(deltaY, deltaX);

      // Clamped max pupil movement relative to the eye sizes
      const maxRadius = Math.min(rect.width * 0.035, 10); 
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      const drag = Math.min(distance / 300, 1.0);
      const moveX = Math.cos(angle) * maxRadius * drag;
      const moveY = Math.sin(angle) * maxRadius * drag;

      setPupilOffset({ x: moveX, y: moveY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="absolute top-0 bottom-0 right-0 w-[144px] xs:w-[176px] sm:w-[216px] md:w-[248px] lg:w-[288px] pointer-events-none select-none z-30 animate-fade-in"
      style={{
        containerType: "inline-size",
      }}
    >
      {/* ── Monkey-Style Zine Background Poster Card (Full Height) ── */}
      <div
        className="absolute flex flex-col items-center justify-start z-10"
        style={{
          left: "9%",
          width: "calc(88% - 12px)",
          top: "calc(15vh + 4rem)",
          bottom: "2.5px",
          backgroundColor: "#f01450",
        }}
      >
        <SketchyBorder />
        {/* White bold text: "OUT OF THE BOX" */}
        <div
          className="flex flex-col items-center justify-center leading-[0.78] w-full h-full text-white font-black"
          style={{
            fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
            letterSpacing: "-0.04em",
          }}
        >
          <span style={{ fontSize: "21cqw" }}>OUT OF</span>
          <span style={{ fontSize: "37cqw" }}>THE BOX</span>
        </div>
      </div>

      {/* ── Bottom-aligned Cat Container ── */}
      <div
        ref={catRef}
        className="absolute bottom-0 left-0 w-full aspect-501/457 z-20"
        style={{
          transform: "translateY(-20px)",
        }}
      >
        {/* Base Cat Character Image (Transparent PNG generated on the fly) */}
        {transparentSrc && (
          <img
            src={transparentSrc}
            alt="Cat in Box"
            className="w-full h-full object-contain relative z-20"
          />
        )}

        {/* ── Left Eye Cover ── */}
        <div
          className="absolute rounded-full z-25"
          style={{
            left: "29.94%",
            top: "22.76%",
            width: "15.17%",
            height: "17.72%",
            backgroundColor: eyeColor,
            transform: "rotate(-4deg)",
          }}
        >
          {/* Left Pupil (Vertical Pill) */}
          <div
            className="absolute bg-black rounded-full transition-transform duration-75 ease-out"
            style={{
              left: "calc(50% - 10%)",
              top: "calc(50% - 30%)",
              width: "20%",
              height: "60%",
              transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
            }}
          />
        </div>

        {/* ── Right Eye Cover ── */}
        <div
          className="absolute rounded-full z-25"
          style={{
            left: "51.70%",
            top: "23.63%",
            width: "18.76%",
            height: "20.57%",
            backgroundColor: eyeColor,
            transform: "rotate(4deg)",
          }}
        >
          {/* Right Pupil (Vertical Pill) */}
          <div
            className="absolute bg-black rounded-full transition-transform duration-75 ease-out"
            style={{
              left: "calc(50% - 10%)",
              top: "calc(50% - 30%)",
              width: "20%",
              height: "60%",
              transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
