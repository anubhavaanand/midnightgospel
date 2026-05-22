import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLevelStore } from '../../store/useLevelStore';

export const TransitionWipe: React.FC = () => {
  const isTransitioning = useLevelStore((state) => state.isTransitioning);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="transition-wipe"
          initial={{ clipPath: 'circle(0% at 50% 50%)' }}
          animate={{ clipPath: 'circle(150% at 50% 50%)' }}
          exit={{ clipPath: 'circle(0% at 50% 50%)', opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-black pointer-events-none flex items-center justify-center"
        >
          {/* Internal visual effects for the wipe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="w-full h-full flex items-center justify-center pointer-events-none"
          >
             <div className="w-[120vw] h-[120vh] absolute bg-gradient-to-tr from-fuchsia-900 via-black to-cyan-900 opacity-60 mix-blend-color-dodge animate-spin-slow" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
