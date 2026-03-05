import { useEffect, useRef } from "react";

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
  phase: number;
  speed: number;
}

export default function FloatingYarnAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let orbs: Orb[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const initOrbs = () => {
      orbs = Array.from({ length: 12 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 20 + Math.random() * 60,
        opacity: 0.04 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.005,
      }));
    };

    resize();
    initOrbs();

    const draw = (_t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const orb of orbs) {
        orb.phase += orb.speed;
        orb.x += orb.vx + Math.sin(orb.phase) * 0.4;
        orb.y += orb.vy + Math.cos(orb.phase * 0.7) * 0.3;

        if (orb.x < -orb.r) orb.x = canvas.width + orb.r;
        if (orb.x > canvas.width + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = canvas.height + orb.r;
        if (orb.y > canvas.height + orb.r) orb.y = -orb.r;

        const grad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.r,
        );
        grad.addColorStop(0, `rgba(210, 185, 155, ${orb.opacity})`);
        grad.addColorStop(1, "rgba(210, 185, 155, 0)");
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", () => {
      resize();
      initOrbs();
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
