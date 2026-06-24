import React, { useEffect } from 'react';
import { useLevelStore } from '../../store/useLevelStore';
import { LEVELS } from '../../data/levels';
import { useDialogueStore } from '../../store/useDialogueStore';
import * as THREE from 'three';

const SpeakerIcon = ({ muted }: { muted: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {muted ? (
      <>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </>
    ) : (
      <>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </>
    )}
  </svg>
);

export const LayoutOverlay: React.FC = () => {
  const { activeLevelId, scrollProgress, isMenuOpen, setMenuOpen } = useLevelStore();
  const isMuted = useDialogueStore((state) => state.isMuted);
  const setIsMuted = useDialogueStore((state) => state.setIsMuted);
  const audioState = useDialogueStore((state) => state.audioState);
  const setAudioState = useDialogueStore((state) => state.setAudioState);

  // Setup click & touch listeners to auto-resume AudioContext on first user interaction
  useEffect(() => {
    const resumeAudio = async () => {
      try {
        const ctx = THREE.AudioContext.getContext();
        if (ctx.state === 'suspended') {
          await ctx.resume();
          setAudioState(ctx.state as any);
        }
      } catch (e) {
        // Safe to ignore in test or background envs
      }
    };

    window.addEventListener('click', resumeAudio, { once: true });
    window.addEventListener('touchstart', resumeAudio, { once: true });

    return () => {
      window.removeEventListener('click', resumeAudio);
      window.removeEventListener('touchstart', resumeAudio);
    };
  }, [setAudioState]);

  const handleInitiateAudio = async () => {
    try {
      const ctx = THREE.AudioContext.getContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      setAudioState(ctx.state as any);
    } catch (e) {
      console.warn("Failed to resume AudioContext manually:", e);
    }
  };

  const levelTelemetryData: Record<number, { avatar: string; guest: string; theme: string; status: string }> = {
    0: { avatar: "Default Clancy Form", guest: "Hub Computer AI (Velma 960)", theme: "Digital Escapism & Solitude", status: "Simulation Farmer Online" },
    1: { avatar: "Beach Body Form (Buff)", guest: "Glasses Man (Dr. Drew Pinsky)", theme: "Psychedelics & Drug Philosophy", status: "98.7% Zombie Overrun" },
    2: { avatar: "Pastel Balloon Canine", guest: "Baby Clown King (Anne Lamott)", theme: "Death, Grief & New Life", status: "Eternal Pastures Active" },
    3: { avatar: "Octopus Alien Form", guest: "Fish Mage (Damien Echols)", theme: "Magic, Forgiveness & Suffering", status: "Cream Ocean Calm" },
    4: { avatar: "Warrior Form", guest: "Knight (Caitlin Doughty)", theme: "Death Positivity & Mortality", status: "Volcanic Forge Lit" },
    5: { avatar: "Prismatic Glass Form", guest: "Inmate Bob (Jason Louv)", theme: "Buddhism & Letting Go", status: "Soul Prison Secure" },
    6: { avatar: "Zen Meditation Form", guest: "Teacher David (Trudy Goodman)", theme: "Heartbreak & Relationships", status: "Cave Resonance Calm" },
    7: { avatar: "Golden Sphere Form", guest: "Death (David Nichtern)", theme: "Enlightenment & Cosmic Awareness", status: "Void Observation Active" },
    8: { avatar: "Golden Heart Form", guest: "Mom (Duncan's Mother)", theme: "Mother-Son Love & Rebirth", status: "Life Cycle in Transit" },
    9: { avatar: "Transcendent Unity Form", guest: "The Simulator Core", theme: "Integration & Cosmic Chaos", status: "Sandbox Mode Engaged" },
  };

  const getLevelTelemetry = () => {
    const level = LEVELS.find(l => l.id === activeLevelId);
    const levelName = level?.name ?? `Simulated Planet #${activeLevelId}`;
    const data = levelTelemetryData[activeLevelId] ?? levelTelemetryData[0];

    return { world: levelName, ...data };
  };

  const telemetry = getLevelTelemetry();

  return (
    <div className="absolute inset-0 pointer-events-none z-40 crt-scanlines">
      {/* 1. Header Frame (Top Edge) */}
      <header className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-50 pointer-events-auto">
        {/* Top Left Logo */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 animate-pulse" />
          <span className="font-sans-elegant text-xl font-bold tracking-[0.25em] text-white select-none">
            SPACECAST
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Initiate Audio / Suspended Warning */}
          {audioState === 'suspended' && (
            <button
              onClick={handleInitiateAudio}
              className="px-4 h-10 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-mono-diagnostic text-xs font-bold animate-pulse pointer-events-auto border border-fuchsia-400 flex items-center gap-2 shadow-[0_0_15px_rgba(217,70,239,0.5)]"
              title="Click to Enable Spatial Audio"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              INITIATE AUDIO
            </button>
          )}

          {/* Mute Toggle */}
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 rounded-full glass-button flex items-center justify-center text-xs text-gray-400 font-mono-diagnostic hover:text-white"
            title="Toggle Ambient Audio"
          >
            <SpeakerIcon muted={isMuted} />
          </button>

          {/* Hamburger Menu Trigger */}
          <button
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="h-10 px-4 rounded-full glass-button flex items-center gap-2 font-mono-diagnostic text-xs text-white"
          >
            <div className="flex flex-col gap-1 w-4">
              <span className={`h-0.5 w-full bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
              <span className={`h-0.5 w-full bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-full bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
            </div>
            <span className="tracking-wider">{isMenuOpen ? 'CLOSE' : 'LEVELS'}</span>
          </button>
        </div>
      </header>

      {/* 2. Left Footer (Simulation Telemetry Diagnostic Overlay) */}
      <footer className="absolute bottom-6 left-6 p-5 w-80 rounded-2xl glass-panel font-mono-diagnostic text-xs leading-relaxed pointer-events-auto select-none border border-white/5 shadow-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/10">
          <span className="text-[10px] tracking-wider text-fuchsia-500 font-bold">SIMULATOR DIAGNOSTICS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
        </div>
        <div className="space-y-1.5">
          <div>
            <span className="text-gray-500 font-semibold uppercase">Planet: </span>
            <span className="text-white">{telemetry.world}</span>
          </div>
          <div>
            <span className="text-gray-500 font-semibold uppercase">Avatar: </span>
            <span className="text-fuchsia-400">{telemetry.avatar}</span>
          </div>
          <div>
            <span className="text-gray-500 font-semibold uppercase">Guest: </span>
            <span className="text-cyan-400">{telemetry.guest}</span>
          </div>
          <div>
            <span className="text-gray-500 font-semibold uppercase">Thematic Node: </span>
            <span className="text-yellow-400">{telemetry.theme}</span>
          </div>
          <div className="pt-1.5 mt-1.5 border-t border-white/5 flex justify-between items-center text-[10px]">
            <span className="text-gray-400 font-semibold uppercase">Core State: </span>
            <span className="text-green-400 font-bold uppercase">{telemetry.status}</span>
          </div>
        </div>
      </footer>

      {/* 3. Right Footer (Z-Axis Depth Scroll Gauge) */}
      <footer className="absolute bottom-6 right-6 p-5 w-80 rounded-2xl glass-panel font-mono-diagnostic text-xs pointer-events-auto select-none border border-white/5 shadow-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] tracking-wider text-cyan-400 font-bold">PORTAL DEPTH GAUGE</span>
          <span className="text-white text-[10px] font-bold">
            Z-DEPTH: {Math.round(scrollProgress * 100)}%
          </span>
        </div>
        
        {/* Visual Progress Gauge Line */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 transition-all duration-100 ease-out"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2.5 text-[9px] text-gray-500">
          <span>{activeLevelId === 0 ? 'PULL TO SIMULATOR' : 'RETREAT BACK'}</span>
          <span>{activeLevelId === 0 ? 'WOBBLE WARP' : 'DEEPEST DEPTH'}</span>
        </div>
      </footer>
    </div>
  );
};
