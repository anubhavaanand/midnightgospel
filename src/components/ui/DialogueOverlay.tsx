import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDialogueStore } from '../../store/useDialogueStore';
import { useLevelStore } from '../../store/useLevelStore';

// Framer Motion variants for typing/stagger animation (no CSS scale — keeps text sharp)
const containerVariants: any = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    opacity: 0,
    y: 40,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

const textContainerVariants: any = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.012,
    }
  }
};

const letterVariants: any = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 20, stiffness: 200 }
  }
};

export const DialogueOverlay: React.FC = () => {
  const { isOpen, activeText, activeSpeaker, currentMood, narrativePhase, advanceNode, closeDialogue } = useDialogueStore();
  const activeLevelId = useLevelStore((state) => state.activeLevelId);
  const [keyTrigger, setKeyTrigger] = useState(0);

  const handleAdvance = () => {
    if (isOpen) {
      advanceNode(activeLevelId);
    }
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeDialogue();
  };

  // Listen to space/enter key presses to advance dialogue
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

  // Restart text typing animation whenever text changes
  useEffect(() => {
    if (activeText) {
      setKeyTrigger(prev => prev + 1);
    }
  }, [activeText]);

  // Color mappings based on speaker or mood
  const glowColor = currentMood.colorTarget || '#FF00FF';

  // Clancy Minimalist Avatar Component (floppy yellow hat, pink head)
  const ClancyAvatar = () => (
    <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="clancy-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF007F" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF007F" stopOpacity="0" />
        </radialGradient>
        <filter id="neon-glow-pink">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Background glow */}
      <circle cx="50" cy="50" r="45" fill="url(#clancy-glow)" />
      {/* Outer tech circles */}
      <circle cx="50" cy="50" r="40" stroke="#FF007F" strokeWidth="1" strokeDasharray="4 6 animate-spin" className="origin-center animate-[spin_20s_linear_infinite]" opacity="0.6" />
      <circle cx="50" cy="50" r="36" stroke="#00FFFF" strokeWidth="0.5" strokeDasharray="20 4" className="origin-center animate-[spin_10s_linear_infinite_reverse]" opacity="0.4" />
      
      {/* Clancy's head */}
      <circle cx="50" cy="58" r="16" fill="#FF007F" filter="url(#neon-glow-pink)" />
      
      {/* Clancy's wizard bucket hat */}
      <path d="M26 44 C26 44, 30 36, 40 34 C44 26, 56 26, 60 34 C70 36, 74 44, 74 44 C74 44, 72 48, 64 48 C54 48, 46 48, 36 48 C28 48, 26 44, 26 44 Z" fill="#FFE94A" />
      {/* Hat band */}
      <path d="M34 44 C42 45, 58 45, 66 44 C66 44, 65 46, 62 46 C52 47, 48 47, 38 46 Z" fill="#8E24AA" />
      
      {/* Big glowing eyes */}
      <circle cx="44" cy="58" r="3.5" fill="#FFFFFF" />
      <circle cx="44" cy="58" r="1.5" fill="#000000" />
      <circle cx="56" cy="58" r="3.5" fill="#FFFFFF" />
      <circle cx="56" cy="58" r="1.5" fill="#000000" />
      
      {/* Blush cheeks */}
      <circle cx="39" cy="62" r="2" fill="#FF80BF" opacity="0.8" />
      <circle cx="61" cy="62" r="2" fill="#FF80BF" opacity="0.8" />
      
      {/* Audio Wave overlay */}
      <path d="M38 78 H62" stroke="#00FFFF" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <path d="M42 78 V74 M46 78 V70 M50 78 V72 M54 78 V68 M58 78 V75" stroke="#00FFFF" strokeWidth="1.5" strokeLinecap="round" className="animate-pulse" />
    </svg>
  );

  // Glasses Man Minimalist Avatar Component
  const GlassesManAvatar = () => (
    <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glasses-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#00FFFF" stopOpacity="0" />
        </radialGradient>
        <filter id="neon-glow-cyan">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Background glow */}
      <circle cx="50" cy="50" r="45" fill="url(#glasses-glow)" />
      {/* Outer tech circles */}
      <circle cx="50" cy="50" r="40" stroke="#00FFFF" strokeWidth="1" strokeDasharray="10 5" className="origin-center animate-[spin_15s_linear_infinite]" opacity="0.6" />
      <rect x="18" y="18" width="64" height="64" rx="8" stroke="#10B981" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.3" />
      
      {/* Minimalist head */}
      <path d="M35 65 C35 55, 38 45, 50 45 C62 45, 65 55, 65 65 H35 Z" fill="#334155" />
      <circle cx="50" cy="40" r="12" fill="#1E293B" stroke="#00FFFF" strokeWidth="1" />
      
      {/* Glasses */}
      <circle cx="44" cy="40" r="4.5" fill="#FFE94A" stroke="#00FFFF" strokeWidth="1" filter="url(#neon-glow-cyan)" />
      <circle cx="56" cy="40" r="4.5" fill="#FFE94A" stroke="#00FFFF" strokeWidth="1" filter="url(#neon-glow-cyan)" />
      <line x1="48.5" y1="40" x2="51.5" y2="40" stroke="#00FFFF" strokeWidth="1.5" />
      
      {/* Futuristic scanning line */}
      <line x1="20" y1="50" x2="80" y2="50" stroke="#FFE94A" strokeWidth="1" opacity="0.7" className="animate-[bounce_2s_infinite]" />
    </svg>
  );

  // Baby Clown King Avatar Component
  const BabyClownAvatar = () => (
    <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="clown-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#clown-glow)" />
      
      {/* Baby Clown Face */}
      <circle cx="50" cy="50" r="20" fill="#FFFACD" />
      <circle cx="50" cy="50" r="4" fill="#FF0000" /> {/* Red nose */}
      
      {/* Eyes */}
      <path d="M42 45 Q 45 42 48 45" stroke="#000" strokeWidth="2" fill="none" />
      <path d="M52 45 Q 55 42 58 45" stroke="#000" strokeWidth="2" fill="none" />
      
      {/* Star paint */}
      <path d="M45 55 L42 60 L48 60 Z" fill="#FF69B4" />
      <path d="M55 55 L52 60 L58 60 Z" fill="#87CEEB" />
    </svg>
  );

  // Default Universe Simulator Orb Avatar Component
  const DefaultAvatar = () => (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Dynamic pulsing orb */}
      <div 
        className="w-12 h-12 rounded-full animate-ping absolute opacity-20"
        style={{ backgroundColor: glowColor }}
      />
      <div 
        className="w-10 h-10 rounded-full border-2 shadow-[0_0_15px_rgba(255,255,255,0.4)] animate-pulse flex items-center justify-center"
        style={{ 
          borderColor: glowColor,
          backgroundColor: `${glowColor}22`,
          boxShadow: `0 0 20px ${glowColor}44`
        }}
      >
        <span className="text-white text-xs font-mono animate-pulse">SYS</span>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && activeText && (
        <motion.div
          key="dialogue-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-4xl z-50 pointer-events-auto"
          role="dialog"
          aria-live="polite"
          aria-modal="true"
        >
          {/* Episode Title Card */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.2 }}
            className="absolute -top-12 left-0 font-space text-white/80 text-sm tracking-widest uppercase flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            EPISODE {activeLevelId} // SIMULATION ACTIVE
          </motion.div>

          {/* Main Neon Glassmorphic Dialogue Panel */}
          <div 
            className="relative overflow-hidden rounded-2xl border bg-[#0d071b]/80 backdrop-blur-md p-5 md:p-6 transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col md:flex-row gap-5 items-stretch cursor-pointer select-none"
            onClick={handleAdvance}
            style={{ 
              borderColor: `${glowColor}50`,
              boxShadow: `0 0 35px ${glowColor}25, inset 0 0 15px ${glowColor}10`
            }}
          >
            {/* Tech Corner Brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: glowColor }} />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: glowColor }} />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: glowColor }} />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: glowColor }} />

            {/* Futuristic Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            {/* Sub-HUD Metrics header */}
            <div className="absolute top-2 left-6 right-6 flex justify-between items-center text-[9px] font-mono tracking-widest text-white/40 pointer-events-none">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SIM_LINK_ESTABLISHED // PORTAL_ID: {activeLevelId}
              </span>
              <span>PHASE: {narrativePhase}</span>
              <span>DECODER: GLYPH_SYNC_OK</span>
            </div>

            {/* Left side: Avatar and Speaker Badge */}
            <div className="flex flex-row md:flex-col items-center md:justify-center gap-4 md:w-32 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4 shrink-0 mt-2">
              <div 
                className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-black/40 border flex items-center justify-center overflow-hidden transition-all duration-300 relative"
                style={{ borderColor: `${glowColor}30` }}
              >
                {activeSpeaker?.toLowerCase() === 'clancy' ? (
                  <ClancyAvatar />
                ) : activeSpeaker?.toLowerCase() === 'glasses man' ? (
                  <GlassesManAvatar />
                ) : activeSpeaker?.toLowerCase() === 'baby clown king' ? (
                  <BabyClownAvatar />
                ) : (
                  <DefaultAvatar />
                )}
                {/* Micro corner details */}
                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-cyan-400" />
              </div>

              {/* Speaker Name Tag */}
              <div className="flex flex-col md:items-center">
                <span 
                  className="font-syne text-xs uppercase tracking-widest px-2.5 py-0.5 rounded-md border text-center font-bold"
                  style={{ 
                    color: glowColor, 
                    borderColor: `${glowColor}40`,
                    backgroundColor: `${glowColor}0b`
                  }}
                >
                  {activeSpeaker || 'System'}
                </span>
                <span className="text-[8px] font-mono text-white/30 tracking-widest mt-1 uppercase text-center hidden md:block">
                  {activeSpeaker?.toLowerCase() === 'clancy' ? 'Space Caster' : 'Simulated entity'}
                </span>
              </div>
            </div>

            {/* Right side: Dialogue text area and actions */}
            <div className="flex-1 flex flex-col justify-between pt-2">
              {/* Dialogue Text with typing effect */}
              <div className="flex-1 min-h-[70px] flex items-center">
                <motion.p 
                  key={keyTrigger}
                  variants={textContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-white text-base md:text-xl font-space leading-relaxed font-medium"
                >
                  {activeText.split('').map((char, index) => (
                    <motion.span 
                      key={index} 
                      variants={letterVariants}
                      className="inline-block"
                      style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.p>
              </div>

              {/* Controls Footer */}
              <div className="mt-4 pt-3 border-t border-white/5 flex flex-row items-center justify-between">
                {/* Keyboard Tips */}
                <div className="text-[10px] font-mono text-white/40 tracking-wider flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-semibold text-[9px]">SPACE</span> 
                  <span>or</span> 
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-semibold text-[9px]">CLICK</span>
                  <span className="hidden sm:inline">to advance portal conversation</span>
                </div>

                {/* Buttons Group */}
                <div className="flex items-center gap-3">
                  {/* Skip Conversation */}
                  <button 
                    onClick={handleSkip}
                    className="px-3 py-1 text-[10px] font-mono tracking-widest uppercase text-white/40 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded transition-all duration-200"
                  >
                    Skip
                  </button>

                  {/* Next Button */}
                  <button 
                    onClick={handleAdvance}
                    className="relative group px-4 py-1.5 text-xs font-mono tracking-widest uppercase overflow-hidden rounded border transition-all duration-300 font-bold"
                    style={{ 
                      color: glowColor,
                      borderColor: `${glowColor}50`,
                      backgroundColor: `${glowColor}0d`
                    }}
                  >
                    <span className="absolute inset-0 w-full h-full bg-white/5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    [ NEXT ]
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

