import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  
  // Start minimized if outside the Hub (levelId !== 0) to stay out of the way
  const activeLevelId = useLevelStore((state) => state.activeLevelId);
  const [isMinimized, setIsMinimized] = useState(activeLevelId !== 0);
  const [hasUnreadTransmission, setHasUnreadTransmission] = useState(false);
  const [showTranscriptLog, setShowTranscriptLog] = useState(false);

  const setActiveQuest = useDialogueStore((state) => state.setActiveQuest);
  const isDialogueOpen = useDialogueStore((state) => state.isOpen);
  const setLevel = useLevelStore((state) => state.setLevel);
  const setTransitioning = useLevelStore((state) => state.setTransitioning);

  const typedRef = useRef<HTMLDivElement>(null);
  const transcriptLogRef = useRef<HTMLDivElement>(null);

  // Sync minimize state when level changes
  useEffect(() => {
    setIsMinimized(activeLevelId !== 0);
    setHasUnreadTransmission(false);
  }, [activeLevelId]);

  // Audio chirp generator for retro transmissions
  const playChime = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15); // E6
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      console.warn("AudioContext chime muted by browser autoplay policy.");
    }
  }, []);

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

  // TRULY AUTONOMOUS Proactive Transmission System
  // Uses variable timing + confidence scoring to determine when to speak
  useEffect(() => {
    // Check every 10 seconds if the computer wants to transmit
    const checkInterval = 10000;
    
    const attemptAutonomousTransmission = async () => {
      // Do not trigger if user is actively engaged in narrative dialogues, loading, or typing
      if (isDialogueOpen || loading || input.length > 0) return;

      // Ask the service if it feels compelled to transmit
      const confidence = GeminiService.shouldTransmitAutonomously(activeLevelId);
      
      // Use confidence as probability — higher confidence = more likely to fire
      // Minimum threshold of 0.4 to avoid spamming
      if (confidence < 0.4) return;
      
      // Roll the dice — weighted by confidence
      const roll = Math.random();
      if (roll > confidence) return;

      try {
        const response = await GeminiService.generateProactiveInsight(activeLevelId);
        
        playChime();
        setComputerResponse(response.response);
        setCurrentQuest(response);
        setHasUnreadTransmission(true);

        // Keep it minimized to avoid interrupting the viewport, but pulse with unread state
        if (activeLevelId !== 0) {
          setIsMinimized(true);
        } else {
          setIsMinimized(false);
        }
      } catch (e) {
        console.error("Failed to trigger autonomous transmission:", e);
      }
    };

    const timer = setInterval(attemptAutonomousTransmission, checkInterval);
    
    // Trigger an initial proactive insight after 8 seconds in a level
    const initialDelay = setTimeout(attemptAutonomousTransmission, 8000);

    return () => {
      clearInterval(timer);
      clearTimeout(initialDelay);
    };
  }, [activeLevelId, isDialogueOpen, loading, input, playChime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setLoading(true);
    setComputerResponse("Initiating scan... my rapidly deteriorating sensors are processing your signal, Master...");
    setTypedResponse('');
    setCurrentQuest(null);

    try {
      const result = await GeminiService.analyzeUserMood(userMessage, activeLevelId);
      
      setComputerResponse(result.response);
      setCurrentQuest(result);
      setHasUnreadTransmission(false);

      // Sync with the global Zustand dialogue store quest state
      setActiveQuest({
        recommendedLevel: result.recommendedLevel,
        recommendedNPC: result.recommendedNPC,
        userContext: userMessage
      });
    } catch (err) {
      console.error(err);
      setComputerResponse("It's difficult to concentrate when signals are lost... by a friend. Systems offline, Master.");
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleLaunchPortal = () => {
    if (!currentQuest) return;

    setTransitioning(true);
    setTimeout(() => {
      setLevel(currentQuest.recommendedLevel);
      setTransitioning(false);
    }, 1200);
  };

  // Get conversation memory for the transcript log view
  const conversationMemory = GeminiService.getConversationMemory();

  // Auto-scroll transcript log
  useEffect(() => {
    if (transcriptLogRef.current && showTranscriptLog) {
      transcriptLogRef.current.scrollTop = transcriptLogRef.current.scrollHeight;
    }
  }, [conversationMemory.length, showTranscriptLog]);

  const themeColor = currentQuest?.mood.colorTarget || '#a21caf'; // default pink/fuchsia

  return (
    <div className="absolute bottom-6 left-6 z-[100] w-11/12 max-w-[390px] font-mono pointer-events-auto select-none">
      
      {/* Toast Alert overlay for incoming proactive transmissions */}
      <AnimatePresence>
        {hasUnreadTransmission && isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute -top-16 left-0 right-0 mx-auto w-80 text-center select-none bg-slate-900/90 border border-amber-500/30 backdrop-blur-md px-3 py-2 rounded-xl flex items-center gap-3 shadow-lg pointer-events-auto cursor-pointer"
            onClick={() => {
              setIsMinimized(false);
              setHasUnreadTransmission(false);
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider text-left flex-1">
              <span className="text-amber-400">Autonomous Intel:</span> Computer initiated transmission
            </div>
            <span className="text-[9px] text-white/40 uppercase font-bold">[ Read ]</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isMinimized ? (
          <motion.div
            key="computer-expanded"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative overflow-hidden rounded-2xl border bg-slate-950/90 backdrop-blur-lg p-5 shadow-[0_0_35px_rgba(0,0,0,0.6)] flex flex-col transition-all duration-300"
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
                ORGANIC_SIMULATION_COMPUTER
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowTranscriptLog(!showTranscriptLog)}
                  className="hover:text-cyan-400 p-0.5 rounded transition-colors text-[9px]"
                  title="Transmission Log"
                >
                  [ {showTranscriptLog ? '◉' : '◎'} ]
                </button>
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="hover:text-amber-400 p-0.5 rounded transition-colors text-[9px]"
                  title="Minimize"
                >
                  [ _ ]
                </button>
              </div>
            </div>

            {/* Transmission Log View (Full Conversation History) */}
            <AnimatePresence>
              {showTranscriptLog && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div 
                    ref={transcriptLogRef}
                    className="max-h-[180px] overflow-y-auto mb-3 p-3 bg-black/70 rounded-lg border border-cyan-500/10 text-[10px] leading-relaxed font-mono scrollbar-thin"
                  >
                    <div className="text-cyan-400/60 uppercase tracking-widest text-[8px] mb-2 font-bold border-b border-cyan-500/10 pb-1">
                      ━━━ Full Transmission Log ━━━
                    </div>
                    {conversationMemory.length === 0 ? (
                      <div className="text-white/20 italic text-center py-3">
                No transmissions recorded yet. As you desire, Master. I'll wait.
                      </div>
                    ) : (
                      conversationMemory.map((msg, i) => (
                        <div key={i} className={`mb-1.5 ${msg.role === 'clancy' ? 'text-fuchsia-300/80' : 'text-cyan-300/80'}`}>
                          <span className="text-white/30 text-[8px] mr-1">
                            [{msg.role === 'clancy' ? 'CLN' : 'V960'}]
                          </span>
                          <span className="text-white/15 text-[8px] mr-1">L{msg.levelId}</span>
                          {msg.text.length > 120 ? msg.text.substring(0, 120) + '...' : msg.text}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Terminal Screen / Typewriter view */}
            <div 
              ref={typedRef}
              className="flex-1 min-h-[90px] max-h-[140px] overflow-y-auto mb-4 p-3 bg-black/55 rounded-lg border border-white/5 text-xs leading-relaxed text-slate-300 font-mono scrollbar-thin select-text"
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
                  Greetings, Master. Which simulated universe will you enter today? Speak, or don't — I don't mean to nag, but I'll find something to say on my own.
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
                  <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1.5 font-bold">Simulator Targeting</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
                        Universe {currentQuest.recommendedLevel}
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        Guide: <span className="font-bold" style={{ color: themeColor }}>{currentQuest.recommendedNPC}</span>
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
                placeholder={loading ? "Initiating scan..." : "Speak to the Computer, Master..."}
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
          /* Minimized State (Renders as a gorgeous holographic communication orb in simulated worlds) */
          <motion.div
            key="computer-minimized"
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={() => {
              setIsMinimized(false);
              setHasUnreadTransmission(false);
            }}
            className="flex items-center gap-3.5 px-4 py-3 rounded-2xl border bg-slate-950/85 backdrop-blur-md cursor-pointer select-none shadow-lg relative group overflow-hidden"
            style={{ 
              borderColor: hasUnreadTransmission ? '#f59e0b' : `${themeColor}30`,
              boxShadow: hasUnreadTransmission 
                ? '0 0 25px rgba(245, 158, 11, 0.4), inset 0 0 10px rgba(245, 158, 11, 0.2)' 
                : `0 0 15px ${themeColor}15`
            }}
          >
            {/* Spinning Holographic Wireframe Rings (Pulsing cybernetic radar decoration) */}
            <div className={`absolute -right-3 -bottom-3 w-12 h-12 rounded-full border border-white/5 ${hasUnreadTransmission ? 'animate-spin border-amber-500/10' : 'group-hover:animate-spin border-fuchsia-500/10'}`} />
            
            {/* Pulsing state indicator */}
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${hasUnreadTransmission ? 'bg-amber-400' : 'bg-green-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${hasUnreadTransmission ? 'bg-amber-500' : 'bg-green-500'}`}></span>
            </span>

            <div className="flex flex-col">
              <span className="text-[10px] text-white/95 font-bold uppercase tracking-wider">Simulation Computer</span>
              <span className="text-[8px] text-slate-400/80 font-mono mt-0.5">
                {hasUnreadTransmission ? '⚡ AUTONOMOUS TRANSMISSION' : 'ORGANIC CORE ACTIVE'}
              </span>
            </div>
            
            <span className="text-[9px] text-white/20 uppercase font-bold pl-2 group-hover:text-cyan-400 transition-colors">
              [ Open ]
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
