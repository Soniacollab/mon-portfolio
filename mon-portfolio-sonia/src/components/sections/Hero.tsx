import { useRef, useEffect } from "react";
import { config } from "../../constants/config";
import RobotPlayground from "../canvas/RobotPlayground";

const Hero = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const frameRequested = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Pointer tilt
  const handlePointerMove = (e: React.PointerEvent) => {
    if (frameRequested.current) return;
    frameRequested.current = true;

    requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      frameRequested.current = false;
    });
  };

  const resetPointer = () => {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
  };

  // Stars + nebula canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stars: {
      x: number;
      y: number;
      r: number;
      alpha: number;
      dx: number;
      dy: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        dx: (Math.random() - 0.5) * 0.12,
        dy: (Math.random() - 0.5) * 0.12,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#0e0e1f");
      grad.addColorStop(1, "#1b1b2f");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.fill();

        s.x += s.dx;
        s.y += s.dy;

        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;
      });

      requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <section
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full z-0 pointer-events-none"
      />

      {/* 3D Robot */}
      <RobotPlayground />

      {/* Text */}
      <div className="absolute inset-0 top-20 sm:top-28 mx-auto max-w-7xl px-5 sm:px-12 flex flex-col sm:flex-row items-start gap-5 z-20 pointer-events-none">
        {/* Accent */}
        <div className="mt-4 flex flex-row sm:flex-col items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#915EFF]" />
          <div className="violet-gradient h-16 w-1 sm:h-72" />
        </div>

        {/* Text block */}
        <div className="flex-1">
          <h1
            className="
              font-bold
              leading-[1.05]
              bg-gradient-to-r from-[#EAF5FF] via-[#915EFF] to-[#00c8ff]
              bg-clip-text text-transparent
              max-w-[22ch]
            "
            style={{
              fontSize: "clamp(2.25rem, 6vw, 5.5rem)",
            }}
          >
            Hi, I'm{" "}
            <span className="text-[#915EFF]">{config.hero.name}</span>
          </h1>

          <p
            className="mt-4 max-w-prose text-[#9fd1ff] leading-relaxed"
            style={{
              fontSize: "clamp(0.95rem, 2.2vw, 1.125rem)",
            }}
          >
            {config.hero.p[0]} <br className="hidden sm:block" />
            {config.hero.p[1]}
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
        <a href="#about" aria-label="Scroll to about section" className="hero-scroll">
          <span className="sr-only">Scroll to About</span>
          <div className="hero-scroll-dot" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
