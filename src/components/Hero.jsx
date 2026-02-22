import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="text-center">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
      >
        🌸 Hostel Prep Checklist
      </motion.h1>

      <p className="mt-4 text-sm sm:text-lg opacity-70 max-w-xl mx-auto">
        New journey. New beginnings. Let’s get everything ready ✨
      </p>
    </div>
  );
}