import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback, useEffect, useRef } from "react";
import { Typewriter } from "react-simple-typewriter";

export const Hero = () => {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleExploreClick = () => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/signin");
    else navigate("/blogs");
  };

  const handleGetStartedClick = () => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/signup");
    else navigate("/blogs");
  };

  // try autoplay after first render (browsers block without interaction sometimes)
  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.2; // subtle background
        audioRef.current.play().catch(() => {
          // ignore autoplay block, will play after first click
        });
      }
    };
    playAudio();
  }, []);

  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-950 text-white relative overflow-hidden">
      {/* Ambient soundtrack */}
      <audio ref={audioRef} loop>
        <source src="/sounds/forgotten-archive-ambient.mp3" type="audio/mpeg" />
      </audio>

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1531266752462-82d70e64c3c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')`,
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>

      {/* Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          interactivity: { events: { onHover: { enable: true, mode: "repulse" } } },
          particles: {
            color: { value: "#aaa" },
            links: { enable: true, color: "#666", opacity: 0.2 },
            move: { enable: true, speed: 0.6 },
            size: { value: { min: 1, max: 2 } },
            opacity: { value: 0.3 },
          },
        }}
        className="absolute inset-0"
      />

      {/* Fog drift */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20 mix-blend-overlay"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Title */}
      <motion.h1
        className="text-5xl md:text-7xl font-extrabold mb-6 text-center z-10 tracking-widest"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <span className="text-slate-200">
          <Typewriter
            words={["Forgotten Archive"]}
            loop={1}
            cursor
            cursorStyle="_"
            typeSpeed={80}
            deleteSpeed={40}
            delaySpeed={1000}
          />
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-lg md:text-xl text-gray-300 max-w-2xl text-center mb-10 z-10 italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        Unearth hidden stories, whispering across the ages.
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="flex space-x-6 z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 3 }}
      >
        <motion.button
          onClick={handleGetStartedClick}
          whileHover={{ scale: 1.1, boxShadow: "0px 0px 25px rgba(255,255,255,0.4)" }}
          className="px-6 py-3 bg-slate-700 rounded-lg text-lg font-semibold hover:bg-slate-600 transition"
        >
          Begin Journey
        </motion.button>
        <motion.button
          onClick={handleExploreClick}
          whileHover={{ scale: 1.1, boxShadow: "0px 0px 25px rgba(255,255,255,0.4)" }}
          className="px-6 py-3 border border-slate-400 rounded-lg text-lg font-semibold hover:bg-white hover:text-black transition"
        >
          Explore Archives
        </motion.button>
      </motion.div>
    </div>
  );
};
