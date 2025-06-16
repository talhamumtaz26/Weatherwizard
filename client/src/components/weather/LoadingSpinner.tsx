import { motion } from "framer-motion";

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
      <div className="text-center text-white">
        <motion.div
          className="inline-block"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <i className="fas fa-sun text-6xl text-yellow-300 mb-4"></i>
        </motion.div>
        <motion.h2 
          className="text-2xl font-light mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Getting weather data...
        </motion.h2>
        <motion.p 
          className="text-sm opacity-75"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Please wait while we fetch the latest weather information
        </motion.p>
      </div>
    </div>
  );
}
