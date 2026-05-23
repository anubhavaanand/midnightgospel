import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDialogueStore } from '../../store/useDialogueStore';
import { useLevelStore } from '../../store/useLevelStore';
import { GeminiService, type GeminiQuestResponse } from '../../services/gemini';

export const HubDialogueComputer: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [computerResponse, setComputerResponse] = useState<string | null>(null);
  const [typedResponse, setTypedResponse] = useState('');
  const [currentQuest, setCurrentQuest] = useState<GeminiQuestResponse | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const setActiveQuest = useDialogueStore((state) => state.setActiveQuest);
  const activeLevelId = useLevelStore((state) => state.activeLevelId);
  const setLevel = useLevelStore((state) => state.setLevel);
  const setTransitioning = useLevelStore((state) => state.setTransitioning);

  const typedRef = useRef<HTMLDivElement>(null);

  // Typewriter effect for computer's response
  useEffect(() => {
    if (!computerResponse) {
      setTypedResponse('');
      return;
    }

    let i = 0;
    setTypedResponse('');
    const interval = setInterval(() => {
      setTypedResponse((prev) => prev + computerResponse.charAt(i));
      i++;
      if (i >= computerResponse.length) {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [computerResponse]);

  // Auto scroll typewriter text
  useEffect(() => {
    if (typedRef.current) {
      typedRef.current.scrollTop = typedRef.current.scrollHeight;
    }
  }, [typedResponse]);

  // Only render if player is currently in the Hub (levelId = 0)
  if (activeLevelId !== 0) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setComputerResponse("Accessing multi-dimensional neural strands... Scanning temporal nodes...");
    setTypedResponse('');
    setCurrentQuest(null);

    try {
      const result = await GeminiService.analyzeUserMood(input);
      
      setComputerResponse(result.response);
      setCurrentQuest(result);

      // Sync with the global Zustand dialogue store quest state
      setActiveQuest({
        recommendedLevel: result.recommendedLevel,
        recommendedNPC: result.recommendedNPC,
        userContext: input
      });
    } catch (err) {
      console.error(err);
      setComputerResponse("Error: Cosmic interference detected. Organic core offline. Defaulting to local trajectory.");
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleLaunchPortal = () => {
    if (!currentQuest) return;

    setTransitioning(true);
    // Simulate portal warp wipe
    setTimeout(() => {
      setLevel(currentQuest.recommendedLevel);
      setTransitioning(false);
    }, 1200);
  };

  // Get color glow based on mood feedback
  const themeColor = currentQuest?.mood.colorTarget || '#a21caf'; // default pink/fuchsia

  return (
    <div className="absolute bottom-6 left-6 z-[100] w-11/12 max-w-[390px] font-mono pointer-events-auto">
      <AnimatePresence mode="wait">
        {!isMinimized ? (
          <motion.div
            key="computer-expanded"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative overflow-hidden rounded-2xl border bg-slate-950/85 backdrop-blur-lg p-5 shadow-[0_0_35px_rgba(0,0,0,0.6)] flex flex-col transition-all duration-300"
            style={{ 
              borderColor: `${themeColor}40`,
              boxShadow: `0 0 25px ${themeColor}20, inset 0 0 10px ${themeColor}10`
            }}
          >
            {/* Corner details */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: themeColor }} />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }} />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: themeColor }} />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: themeColor }} />

            {/* Holographic scanlines & noise grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.015)_50%,transparent_50%)] bg-[size:100%_4px] pointer-events-none opacity-60" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />

            {/* Terminal Header */}
            <div className="flex justify-between items-center text-[10px] text-white/50 border-b border-white/10 pb-2 mb-3 select-none">
              <span className="flex items-center gap-1.5 font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                CLANCY_SYS_V2.0
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="hover:text-amber-400 p-0.5 rounded transition-colors"
                  title="Minimize"
                >
                  [ _ ]
                </button>
              </div>
            </div>

            {/* Terminal Screen / Typewriter view */}
            <div 
              ref={typedRef}
              className="flex-1 min-h-[90px] max-h-[140px] overflow-y-auto mb-4 p-3 bg-black/45 rounded-lg border border-white/5 text-xs leading-relaxed text-slate-300 font-mono scrollbar-thin select-text"
            >
              {typedResponse ? (
                <div>
                  <span className="text-cyan-400 font-bold mr-1.5">&gt;</span>
                  {typedResponse}
                  {typedResponse.length < (computerResponse?.length || 0) && (
                    <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-0.5 animate-pulse" />
                  )}
                </div>
              ) : (
                <div className="text-white/30 text-center py-6 italic select-none">
                  Organic neural core waiting... Tell Clancy's computer what you are feeling to align portal coordinates.
                </div>
              )}
            </div>

            {/* Recommended Quest Panel */}
            <AnimatePresence>
              {currentQuest && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mb-4 p-3 rounded-lg border border-cyan-500/20 bg-cyan-950/10 backdrop-blur-sm select-none"
                  style={{ borderColor: `${themeColor}30`, backgroundColor: `${themeColor}08` }}
                >
                  <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1.5 font-bold">Recommended Destination</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
                        Episode {currentQuest.recommendedLevel}
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        Guide NPC: <span className="font-bold" style={{ color: themeColor }}>{currentQuest.recommendedNPC}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleLaunchPortal}
                      className="px-3 py-1.5 text-[10px] font-bold uppercase rounded border transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
                      style={{ 
                        color: themeColor,
                        borderColor: `${themeColor}50`,
                        backgroundColor: `${themeColor}12`,
                        boxShadow: `0 0 10px ${themeColor}20`
                      }}
                    >
                      [ WARP PORTAL ]
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="relative mt-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={loading ? "Tuning dimensional frequencies..." : "What's on your mind today, Clancy?"}
                disabled={loading}
                className="w-full bg-slate-900/60 border border-white/10 focus:border-cyan-500/50 rounded-xl px-4 py-2.5 pr-10 text-white text-xs placeholder-white/20 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                style={{ 
                  borderColor: loading ? `${themeColor}30` : 'rgba(255,255,255,0.1)'
                }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-white/40 hover:text-cyan-400 disabled:text-white/10 transition-colors"
              >
                {loading ? "■" : "▲"}
              </button>
            </form>
          </motion.div>
        ) : (
          /* Minimized State */
          <motion.div
            key="computer-minimized"
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-slate-950/90 backdrop-blur-md cursor-pointer select-none shadow-lg hover:scale-105 transition-transform duration-200"
            style={{ 
              borderColor: `${themeColor}30`,
              boxShadow: `0 0 15px ${themeColor}15`
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Dialogue Computer</span>
            <span className="text-[9px] text-white/30 ml-2">[ Expand ]</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
