import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const statsVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.08 },
  },
};

export default function GlowyWavesHero({
  badgeText = "AVAILABLE FOR NEW OPPORTUNITIES",
  titleBase = "Hi, I'm a",
  titleHighlight = "Website Developer & Designer",
  description = "I build futuristic, high-tech, and responsive web applications. Currently focused on crafting ultra-modern UI/UX designs and bringing ideas to life.",
  primaryButtonText = "View Projects",
  secondaryButtonText = "Contact Me",
  pills = ["React", "Tailwind CSS", "UI/UX Design", "Modern Web"],
  stats = [
    { label: "Hackathons", value: "10hr" },
    { label: "Featured Project", value: "CityPulse" },
    { label: "Design Style", value: "Hyper-Tech" },
  ],
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let time = 0;

    const themeColors = {
      backgroundTop: "#080808", 
      backgroundBottom: "#000000", 
      wavePalette: [
        {
          offset: 0,
          amplitude: 70,
          frequency: 0.003,
          color: "rgba(0, 242, 255, 0.7)", // Brightened neonBlue
          opacity: 0.7, // Increased opacity for glow
        },
        {
          offset: Math.PI / 2,
          amplitude: 90,
          frequency: 0.0026,
          color: "rgba(188, 19, 254, 0.6)", // Brightened neonPurple
          opacity: 0.6,
        },
        {
          offset: Math.PI,
          amplitude: 60,
          frequency: 0.0034,
          color: "rgba(0, 242, 255, 0.5)", 
          opacity: 0.5,
        },
        {
          offset: Math.PI * 1.5,
          amplitude: 80,
          frequency: 0.0022,
          color: "rgba(188, 19, 254, 0.45)", 
          opacity: 0.45,
        },
        {
          offset: Math.PI * 2,
          amplitude: 55,
          frequency: 0.004,
          color: "rgba(255, 255, 255, 0.3)", 
          opacity: 0.3,
        },
      ],
    };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouseInfluence = prefersReducedMotion ? 10 : 70;
    const influenceRadius = prefersReducedMotion ? 160 : 320;
    const smoothing = prefersReducedMotion ? 0.04 : 0.1;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const recenterMouse = () => {
      const centerPoint = { x: canvas.width / 2, y: canvas.height / 2 };
      mouseRef.current = centerPoint;
      targetMouseRef.current = centerPoint;
    };

    const handleResize = () => {
      resizeCanvas();
      recenterMouse();
    };

    const handleMouseMove = (event) => {
      targetMouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseLeave = () => {
      recenterMouse();
    };

    resizeCanvas();
    recenterMouse();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const drawWave = (wave) => {
      ctx.save();
      ctx.beginPath();

      for (let x = 0; x <= canvas.width; x += 4) {
        const dx = x - mouseRef.current.x;
        const dy = canvas.height / 2 - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / influenceRadius);
        const mouseEffect =
          influence *
          mouseInfluence *
          Math.sin(time * 0.001 + x * 0.01 + wave.offset);

        const y =
          canvas.height / 2 +
          Math.sin(x * wave.frequency + time * 0.002 + wave.offset) * wave.amplitude +
          Math.sin(x * wave.frequency * 0.4 + time * 0.003) * (wave.amplitude * 0.45) +
          mouseEffect;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineWidth = 3.5; // Thicker lines
      ctx.strokeStyle = wave.color;
      ctx.globalAlpha = wave.opacity;
      ctx.shadowBlur = 60; // Maximized glow effect
      ctx.shadowColor = wave.color;
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      time += 1;

      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * smoothing;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * smoothing;

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, themeColors.backgroundTop);
      gradient.addColorStop(1, themeColors.backgroundBottom);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      themeColors.wavePalette.forEach(drawWave);

      animationId = window.requestAnimationFrame(animate);
    };

    animationId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section
      className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-black text-white"
      role="region"
      aria-label="Glowing waves hero section"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-neonPurple/[0.05] blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-neonBlue/[0.05] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-24 text-center md:px-8 lg:px-12">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
          
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-neonBlue/30 bg-neonBlue/5 px-4 py-2 text-xs font-mono font-semibold uppercase tracking-[0.25em] text-neonBlue backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 text-neonBlue" aria-hidden="true" />
            {badgeText}
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mb-6 text-4xl font-black tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            {titleBase}{" "}
            <span className="bg-gradient-to-r from-neonBlue to-neonPurple bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,242,255,0.3)]">
              {titleHighlight}
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mb-10 max-w-3xl text-lg text-slate-400 md:text-2xl font-light"
          >
            {description}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a href="#projects" className="group flex h-12 items-center justify-center gap-2 rounded-full border border-neonBlue bg-transparent px-8 text-sm font-bold uppercase tracking-[0.2em] text-neonBlue transition-all hover:bg-neonBlue hover:text-black hover:shadow-[0_0_30px_rgba(0,242,255,0.4)]">
              {primaryButtonText}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a href="#contact" className="flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-sm font-bold uppercase tracking-[0.2em] text-white backdrop-blur transition-all hover:border-neonPurple/50 hover:bg-neonPurple/10 hover:text-neonPurple hover:shadow-[0_0_30px_rgba(188,19,254,0.2)]">
              {secondaryButtonText}
            </a>
          </motion.div>

          <motion.ul
            variants={itemVariants}
            className="mb-12 flex flex-wrap items-center justify-center gap-3 text-xs uppercase font-mono tracking-[0.2em] text-neonBlue"
          >
            {pills.map((pill) => (
              <li
                key={pill}
                className="rounded-full border border-neonBlue/20 bg-neonBlue/5 px-4 py-2 backdrop-blur"
              >
                {pill}
              </li>
            ))}
          </motion.ul>

          <motion.div
            variants={statsVariants}
            className="grid gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md sm:grid-cols-3 hover:border-neonPurple/30 transition-colors"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={itemVariants} className="space-y-1">
                <div className="text-xs uppercase font-mono tracking-[0.3em] text-neonPurple">
                  {stat.label}
                </div>
                <div className="text-3xl font-black text-white">{stat.value}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}