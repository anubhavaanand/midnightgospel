import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDialogueStore } from '../../store/useDialogueStore';
import { useLevelStore } from '../../store/useLevelStore';

export const DialogueOverlay: React.FC = () => {
  const { isOpen, activeText, advanceNode } = useDialogueStore();
  const activeLevelId = useLevelStore((state) => state.activeLevelId);

  const handleAdvance = () => {
    if (isOpen) {
      advanceNode(activeLevelId);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleAdvance();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeLevelId, advanceNode]);

  return (
    <AnimatePresence>
      {isOpen && activeText && (
        <motion.div
          key="dialogue-container"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 w-11/12 max-w-3xl z-40 pointer-events-auto"
          role="dialog"
          aria-live="polite"
          aria-modal="true"
        >
          <div 
            className="bg-black/80 backdrop-blur-md border-2 border-fuchsia-500/50 p-6 rounded-2xl shadow-[0_0_30px_rgba(255,0,255,0.2)] cursor-pointer"
            onClick={handleAdvance}
          >
            <p className="text-white text-xl md:text-2xl font-mono leading-relaxed font-semibold">
              {activeText}
            </p>
            <p className="text-gray-400 text-xs mt-4 uppercase tracking-widest flex items-center justify-between">
              <span>Press Space or Click to continue</span>
              <span className="animate-pulse">▼</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
