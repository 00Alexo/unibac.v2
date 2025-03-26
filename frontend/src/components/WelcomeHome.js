import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

export default function WelcomeHome() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center h-screen absolute inset-0 z-10 px-6 mr-5">
      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-3 inline-block px-4 py-1 rounded-full bg-blue-500/20 border border-blue-500/30"
          >
            <span className="text-blue-400 font-mono text-sm tracking-wider">AI-POWERED EXAM GRADER</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Welcome to <span className="text-[#0e2cc5]">UniBac</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xl  leading-relaxed mb-8 max-w-xl"
          >
            Începe studiile chiar acum și pregătește-te pentru universitate în cel mai bun mod posibil alături de asistentul nostru virtual, 
            exerciții auto-evaluate și cursuri și materiale organizate de profesori.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap gap-4"
          >
            <motion.button
              onClick={() => navigate("/signUp")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-800 transition-all"
            >
              Kick off now
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="rgba(255,255,255,0.7)" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}