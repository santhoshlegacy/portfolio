import React, { useState, useEffect, useRef } from 'react';
import GlowyWavesHero from "./components/GlowyWavesHero";
import { motion, useMotionValue, useSpring, useTransform, useScroll, useInView } from 'framer-motion';
import { Code2, Mail, Github, Linkedin, ShieldCheck, Youtube, Instagram, User, Lock, Home, Zap, Terminal, AlertTriangle, Layers } from 'lucide-react';

// --- 1. THE 3D TILT CARD ---
const TiltCard = ({ children, className = "" }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className={`relative perspective-1000 ${className}`}
    >
      <div 
        className="absolute inset-0 bg-gradient-to-br from-neonBlue/10 to-neonPurple/10 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ transform: "translateZ(30px)" }}
      />
      {children}
    </motion.div>
  );
};

// --- 2. GLASS BOX ---
const GlassCard = ({ children, className = "" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`group bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl p-8 hover:-translate-y-2 hover:border-neonPurple/50 hover:shadow-[0_15px_40px_rgba(188,19,254,0.15)] hover:bg-gradient-to-br hover:from-white/[0.04] hover:to-neonPurple/[0.08] transition-all duration-500 ease-out relative overflow-hidden ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-tr from-neonBlue/5 via-transparent to-neonPurple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neonBlue to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    {children}
  </motion.div>
);

// --- 3. MAGNETIC UI ---
const MagneticElement = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });
  const { x, y } = position;

  return (
    <motion.div
      className={className}
      style={{ position: "relative", zIndex: 50 }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

// --- 4. SCROLL LINE ---
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="fixed top-0 right-0 bottom-0 w-1 bg-white/5 z-50 origin-top pointer-events-none">
      <motion.div 
        className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-neonBlue to-neonPurple shadow-[0_0_15px_rgba(0,242,255,0.8)]"
        style={{ scaleY, transformOrigin: "top" }}
      />
    </div>
  );
};

// --- 5. FLOATING HUD (Transparent Background) ---
const FloatingHUD = () => {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.8, type: "spring" }}
      className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none"
    >
      {/* Changed to bg-transparent, removed borders and blur */}
      <div className="flex items-center justify-center gap-4 md:gap-8 px-6 md:px-8 py-3 md:py-4 rounded-full bg-transparent pointer-events-auto w-max max-w-[95vw]">
        {[
          { icon: <Home size={20} />, label: "Core", link: "#" },
          { icon: <User size={20} />, label: "Identity", link: "#identity" },
          { icon: <Code2 size={20} />, label: "Database", link: "#projects" },
          { icon: <ShieldCheck size={20} />, label: "Comm", link: "#contact" },
        ].map((item, idx) => (
          <MagneticElement key={idx} className="flex justify-center items-center">
            <a href={item.link} className="group relative flex flex-col items-center gap-1 text-slate hover:text-neonBlue transition-colors duration-300">
              <div className="p-2 rounded-full group-hover:bg-neonBlue/10 transition-colors">{item.icon}</div>
              <span className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono uppercase tracking-widest text-neonBlue bg-black/80 px-2 py-1 rounded border border-neonBlue/30 pointer-events-none">
                {item.label}
              </span>
            </a>
          </MagneticElement>
        ))}
      </div>
    </motion.div>
  );
};

// --- 6. THEME SWITCHER WIDGET ---
const ThemeSwitcher = ({ themeHue, setThemeHue }) => {
  const themes = [
    { name: "Neon Matrix", hue: 0, icon: <Zap size={14} /> },
    { name: "Hacker Protocol", hue: 110, icon: <Terminal size={14} /> },
    { name: "System Alert", hue: -160, icon: <AlertTriangle size={14} /> }
  ];

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="flex flex-col gap-2 bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-[0_0_20px_rgba(188,19,254,0.1)]">
        {themes.map((t) => (
          <button
            key={t.name}
            onClick={() => setThemeHue(t.hue)}
            title={t.name}
            className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center ${
              themeHue === t.hue ? 'bg-neonBlue/20 text-neonBlue shadow-[0_0_10px_rgba(0,242,255,0.4)]' : 'text-slate hover:bg-white/10'
            }`}
          >
            {t.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- 7. CIPHER TEXT REVEAL ---
const CipherText = ({ text, className = "" }) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
  const [displayText, setDisplayText] = useState(() => 
    text.split("").map(() => letters[Math.floor(Math.random() * letters.length)]).join("")
  );
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" }); 

  useEffect(() => {
    if (!isInView) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) =>
        text.split("").map((letter, index) => {
          if (index < iteration) return text[index];
          return letters[Math.floor(Math.random() * letters.length)];
        }).join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [isInView, text]);

  return (
    <span ref={ref} className={`transition-colors duration-500 ${isInView ? 'text-neonBlue drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]' : 'text-slate'} ${className}`}>
      {displayText}
    </span>
  );
};

// --- 8. QUANTUM PARTICLE PHYSICS ---
const QuantumCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    let particles = [];
    const mouse = { x: width / 2, y: height / 2 };

    const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', handleMouseMove);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.radius = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 242, 255, 0.5)';
        ctx.fill();
      }
    }

    for (let i = 0; i < 70; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        const dx = mouse.x - particles[i].x;
        const dy = mouse.y - particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(188, 19, 254, ${1 - dist / 150})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
        for (let j = i; j < particles.length; j++) {
          const dx2 = particles[i].x - particles[j].x;
          const dy2 = particles[i].y - particles[j].y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (dist2 < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 242, 255, ${0.2 - dist2 / 500})`;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => { width = window.innerWidth; height = window.innerHeight; canvas.width = width; canvas.height = height; };
    window.addEventListener('resize', handleResize);

    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('resize', handleResize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />;
};

// --- 9. DECLASSIFIED CLIENT DATABANKS ---
const DeclassifiedVault = ({ themeHue }) => {
  const [activeFile, setActiveFile] = useState(0);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const projects = [
    {
      id: "DOC-01",
      client: "CityPulse",
      type: "Full-Stack Application",
      status: "DEPLOYED",
      description: "Engineered a high-performance full-stack application featuring optimized routing and a seamless UI/UX designed for comprehensive data management.",
      tech: ["React", "Tailwind CSS", "Firebase"],
      image: "citypulse.jpg" 
    },
    {
      id: "DOC-02",
      client: "Nexus AI",
      type: "Neural Interface SaaS",
      status: "ACTIVE",
      description: "Developed a futuristic analytics dashboard for neural networking data. Includes real-time node mapping, high-frequency data streaming, and advanced security visualization.",
      tech: ["Next.js", "Framer Motion", "TypeScript"],
      image: "nexus.jpg"
    },
    {
      id: "DOC-03",
      client: "AeroGear",
      type: "Cyberpunk E-Commerce",
      status: "ARCHIVED",
      description: "High-conversion digital marketplace featuring immersive 3D product rendering, neon-brutalist typography, and highly secure payment gateway integrations.",
      tech: ["JavaScript", "Three.js", "Stripe API"],
      image: "aerogear.jpg"
    }
  ];

  const handleFileSelect = (index) => {
    if (activeFile === index) return;
    setIsDecrypting(true);
    setActiveFile(index);
    setTimeout(() => setIsDecrypting(false), 600); 
  };

  const active = projects[activeFile];

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full relative z-10">
      <div className="w-full lg:w-1/3 flex flex-col gap-3">
        <h3 className="text-neonBlue font-mono text-xs uppercase tracking-[0.3em] mb-2 px-2 flex items-center gap-2">
          <ShieldCheck size={14} /> Encrypted Files
        </h3>
        {projects.map((proj, idx) => (
          <button
            key={proj.id}
            onClick={() => handleFileSelect(idx)}
            className={`text-left px-6 py-4 rounded-xl border font-mono transition-all duration-300 relative overflow-hidden group ${
              activeFile === idx ? 'bg-neonBlue/10 border-neonBlue text-white shadow-[0_0_15px_rgba(0,242,255,0.2)]' : 'bg-black/40 border-white/5 text-slate hover:bg-white/5 hover:border-white/20'
            }`}
          >
            {activeFile === idx && <motion.div layoutId="active-file" className="absolute left-0 top-0 bottom-0 w-1 bg-neonBlue shadow-[0_0_10px_rgba(0,242,255,1)]" />}
            <div className="text-[10px] text-neonPurple mb-1">{proj.id} // {proj.status}</div>
            <div className="font-bold tracking-wider">{proj.client}</div>
          </button>
        ))}
      </div>

      <GlassCard className="w-full lg:w-2/3 min-h-[400px] flex flex-col p-0 overflow-hidden relative group">
        {isDecrypting && (
          <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center font-mono text-neonBlue">
            <Lock size={32} className="mb-4 animate-pulse" />
            <span className="tracking-widest animate-pulse">DECRYPTING PAYLOAD...</span>
            <div className="w-48 h-1 bg-white/10 mt-4 overflow-hidden rounded">
              <div className="h-full bg-neonBlue animate-[slideRight_0.6s_ease-in-out_forwards]" />
            </div>
          </div>
        )}

        <div className={`transition-opacity duration-300 p-8 flex flex-col h-full ${isDecrypting ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">{active.client}</h2>
              <p className="text-neonPurple font-mono text-sm uppercase tracking-widest mt-1">{active.type}</p>
            </div>
            <span className="px-3 py-1 border border-neonBlue/30 bg-neonBlue/10 text-neonBlue text-[10px] font-mono rounded uppercase">{active.status}</span>
          </div>

          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/10 mb-6 group-hover:border-neonBlue/50 transition-colors duration-500">
            <img 
              src={`${import.meta.env.BASE_URL}${active.image}`} 
              alt={active.client} 
              style={{ filter: `hue-rotate(${-themeHue}deg)` }}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
          </div>

          <p className="text-slate leading-relaxed mb-6 flex-grow">{active.description}</p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {active.tech.map((tech) => (
              <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono text-neonBlue">{tech}</span>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};


// --- MAIN APP ---
export default function App() {
  const [securityAnswer, setSecurityAnswer] = useState("");
  const isHumanVerified = securityAnswer === "5";
  const [themeHue, setThemeHue] = useState(0); 

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = 'auto'; };
  }, []);

  return (
    <div style={{ filter: `hue-rotate(${themeHue}deg)`, transition: 'filter 1s ease-in-out' }} className="bg-dark min-h-screen text-slate font-sans selection:bg-neonPurple selection:text-white relative overflow-x-hidden">
      
      <ScrollProgress />
      <FloatingHUD />
      <ThemeSwitcher themeHue={themeHue} setThemeHue={setThemeHue} />
      <QuantumCanvas />

      <div className="fixed inset-0 bg-tech-grid bg-[size:40px_40px] pointer-events-none z-0 opacity-20" />
      
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neonBlue/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neonPurple/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <main className="relative z-10">
        <GlowyWavesHero />

        {/* --- IDENTITY SECTION --- */}
        <section id="identity" className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center gap-3 mb-10">
            <User className="text-neonPurple" size={28} />
            <h2 className="text-3xl font-bold text-white uppercase tracking-widest"><CipherText text="Identity Record" /></h2>
          </div>

          <TiltCard className="w-full">
            <div className="group bg-black/40 backdrop-blur-xl border border-white/10 hover:-translate-y-2 hover:border-neonBlue/50 hover:shadow-[0_15px_40px_rgba(0,242,255,0.15)] rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-10 items-center overflow-hidden transition-all duration-500 ease-out relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-neonBlue/10 via-transparent to-neonPurple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="w-48 h-48 rounded-full border-2 border-neonPurple/50 p-2 shrink-0 relative z-10" style={{ transform: "translateZ(50px)" }}>
                <div className="absolute inset-0 rounded-full border border-neonBlue animate-[spin_10s_linear_infinite]" />
                <img 
                  src={`${import.meta.env.BASE_URL}avatar.jpg`} 
                  alt="Profile" 
                  style={{ filter: `hue-rotate(${-themeHue}deg)` }} 
                  className="w-full h-full rounded-full object-cover bg-white/5" 
                />
              </div>

              <div style={{ transform: "translateZ(40px)" }} className="flex-1 text-center md:text-left z-10 relative">
                <h3 className="text-4xl font-black text-white mb-2 tracking-tight">Website Developer <span className="text-neonBlue">&</span> Designer</h3>
                <p className="text-neonPurple font-mono text-sm uppercase tracking-widest mb-6">Independent Freelancer</p>
                <p className="text-slate leading-relaxed mb-8">I engineer immersive, high-performance digital experiences. Specializing in highly scalable architectures and ultra-modern UI/UX designs, I transform complex technical requirements into seamless, visually stunning interfaces. Whether it's a sleek landing page or a full-scale web application, I build for the future.</p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  {[
                    { icon: <Mail size={20} />, link: "mailto:santhoshthamodharan2008@gmail.com", label: "Comm Link" },
                    { icon: <Github size={20} />, link: "https://github.com/your-username", label: "GitHub" },
                    { icon: <Linkedin size={20} />, link: "https://linkedin.com/in/your-username", label: "LinkedIn" },
                    { icon: <Youtube size={20} />, link: "https://youtube.com/@ryzor.amv", label: "YouTube" },
                    { icon: <Instagram size={20} />, link: "https://instagram.com/snths.legacy", label: "Instagram" }
                  ].map((social, idx) => (
                    <MagneticElement key={idx}>
                      <a href={social.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/5 hover:bg-neonBlue/10 hover:-translate-y-1 border border-white/5 hover:border-neonBlue/50 text-slate hover:text-neonBlue px-4 py-2 rounded-lg transition-all duration-300 ease-out font-mono text-xs uppercase relative z-20">
                        {social.icon} {social.label}
                      </a>
                    </MagneticElement>
                  ))}
                </div>
              </div>
            </div>
          </TiltCard>
        </section>

        {/* --- PROJECTS SECTION --- */}
        <section id="projects" className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center gap-3 mb-10">
            <Layers className="text-neonPurple" size={28} />
            <h2 className="text-3xl font-bold text-white uppercase tracking-widest"><CipherText text="Systems & Arsenal" /></h2>
          </div>
          
          {/* Skill Orbit has been removed as requested */}

          <DeclassifiedVault themeHue={themeHue} />
        </section>

        {/* --- CONTACT FORM --- */}
        <section id="contact" className="max-w-3xl mx-auto px-6 py-20">
          <div className="flex items-center justify-center gap-2 mb-8">
            <ShieldCheck className="text-neonBlue" size={24} />
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest"><CipherText text="Initiate Project" /></h2>
          </div>
          
          <GlassCard className="p-8 md:p-10 relative">
            <form action="https://api.web3forms.com/submit" method="POST" className="flex flex-col gap-6 relative z-10">
              <input type="hidden" name="access_key" value="a0e93df5-1a65-48e3-82c2-a7da166f70f1" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-neonBlue text-xs font-mono uppercase tracking-widest">Client Name</label>
                  <input type="text" name="name" required maxLength="50" pattern="^[a-zA-Z\s]+$" title="Please enter a valid name (letters and spaces only)." className="bg-black/50 border border-white/10 rounded-lg p-4 text-white hover:border-neonBlue/40 hover:bg-black/70 focus:outline-none focus:border-neonPurple focus:ring-1 focus:ring-neonPurple transition-all duration-300 ease-out font-mono text-sm" placeholder="Enter designator..." />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-neonBlue text-xs font-mono uppercase tracking-widest">Comm Link (Email)</label>
                  <input type="email" name="email" required maxLength="100" className="bg-black/50 border border-white/10 rounded-lg p-4 text-white hover:border-neonBlue/40 hover:bg-black/70 focus:outline-none focus:border-neonPurple focus:ring-1 focus:ring-neonPurple transition-all duration-300 ease-out font-mono text-sm" placeholder="Enter address..." />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-neonBlue text-xs font-mono uppercase tracking-widest">Transmission Data</label>
                <textarea name="message" required maxLength="1000" rows="4" className="bg-black/50 border border-white/10 rounded-lg p-4 text-white hover:border-neonBlue/40 hover:bg-black/70 focus:outline-none focus:border-neonPurple focus:ring-1 focus:ring-neonPurple transition-all duration-300 ease-out resize-none font-mono text-sm" placeholder="Describe your freelance project..."></textarea>
              </div>

              <div className="flex flex-col gap-2 border-t border-white/10 pt-6 mt-2">
                <label className="text-neonPurple flex items-center gap-2 text-xs font-mono uppercase tracking-widest">
                  <Lock size={14} /> Security Override: 2 + 3 = ?
                </label>
                <input type="text" value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} className="bg-black/50 border border-white/10 rounded-lg p-4 text-white hover:border-neonPurple/40 hover:bg-black/70 focus:outline-none focus:border-neonPurple focus:ring-1 focus:ring-neonPurple transition-all duration-300 ease-out font-mono text-sm w-full md:w-1/2" placeholder="Enter verification code..." />
              </div>

              <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

              <MagneticElement className="w-full md:w-auto self-end mt-4">
                <button type="submit" disabled={!isHumanVerified} className={`px-8 py-4 font-bold rounded-lg transition-all duration-300 ease-out uppercase tracking-widest text-sm w-full flex justify-center items-center gap-2 ${isHumanVerified ? 'bg-neonPurple text-white hover:shadow-[0_0_20px_rgba(188,19,254,0.4)] hover:-translate-y-1' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
                  {isHumanVerified ? "Transmit Payload" : "System Locked"}
                </button>
              </MagneticElement>
            </form>
          </GlassCard>
        </section>

      </main>
    </div>
  );
}