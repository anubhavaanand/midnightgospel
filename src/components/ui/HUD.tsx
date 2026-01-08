import { useNavigate } from 'react-router-dom';
import { useSceneStore } from '@store/sceneStore';
import { LEVEL_RANGES } from '@utils/constants';
import NavigationPanel from './NavigationPanel';
import DebugPanel from './DebugPanel';
import { QuickHelpButton } from './TouchTutorial';
import AudioControls from './AudioControls';
import ScreenshotButton from './ScreenshotButton';
import KeyboardShortcuts, { KeyboardShortcutsButton } from './KeyboardShortcuts';
import MiniMap from './MiniMap';
import QuoteJournal, { QuoteJournalButton } from './QuoteJournal';

/**
 * HUD overlay with level info and interactive elements.
 * Enhanced with episode data from Midnight Gospel research and theme-specific styling.
 */

// Episode metadata with thematic colors from Midnight Gospel visual language
const EPISODE_DATA = [
  {
    episode: 'INTRO',
    theme: 'The Chromatic Ribbon',
    guest: 'Universe Simulator',
    topic: 'Multiverse Navigation',
    color: '#00ffff',
    glowColor: 'cyan',
  },
  {
    episode: 'EP. 1',
    theme: 'Taste of the King',
    guest: 'Dr. Drew Pinsky',
    topic: 'Drugs & Spirituality',
    color: '#ff3333',
    glowColor: 'red',
  },
  {
    episode: 'EP. 2',
    theme: 'Officers and Wolves',
    guest: 'Anne Lamott',
    topic: 'Death & Acceptance',
    color: '#ffcc00',
    glowColor: 'yellow',
  },
  {
    episode: 'EP. 3',
    theme: 'Hunters Without a Home',
    guest: 'Damien Echols',
    topic: 'Magic & Enlightenment',
    color: '#00ffff',
    glowColor: 'cyan',
  },
  {
    episode: 'EP. 4',
    theme: 'Blinded by My End',
    guest: 'Trudy Goodman',
    topic: 'Forgiveness & Listening',
    color: '#ff9900',
    glowColor: 'orange',
  },
  {
    episode: 'EP. 5',
    theme: 'Annihilation of Joy',
    guest: 'Jason Louv',
    topic: 'Ego Death & Rebirth',
    color: '#9900ff',
    glowColor: 'purple',
  },
  {
    episode: 'FINALE',
    theme: 'Transcendence',
    guest: 'Cosmic Consciousness',
    topic: 'Return to Infinite',
    color: '#ffffff',
    glowColor: 'white',
  },
];

export default function HUD() {
  const navigate = useNavigate();
  const activeLevel = useSceneStore((state) => state.activeLevel);
  const scrollProgress = useSceneStore((state) => state.scrollProgress);

  const currentLevel = LEVEL_RANGES[activeLevel];
  const episodeData = EPISODE_DATA[activeLevel];

  const handleBackToLanding = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Back to Landing Button */}
      <button
        onClick={handleBackToLanding}
        className="absolute top-8 left-8 glass-panel px-3 py-2 pointer-events-auto hover:bg-white/10 transition-colors group mb-2"
        style={{ transform: 'translateY(-50px)' }}
      >
        <span className="text-white/60 text-xs group-hover:text-white transition-colors flex items-center gap-2">
          <span className="text-midnight-cyan">←</span> EXIT_SIMULATOR
        </span>
      </button>

      {/* Top-left: Level Info with Episode Data - Enhanced Glassmorphism */}
      <div
        className="absolute top-20 left-8 glass-panel p-4 pointer-events-auto max-w-xs backdrop-blur-xl border border-white/20 shadow-2xl"
        style={{
          background: `rgba(0, 0, 0, 0.4)`,
          boxShadow: `0 0 30px ${episodeData.color}33`
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse shadow-lg"
            style={{
              backgroundColor: episodeData.color,
              boxShadow: `0 0 10px ${episodeData.color}`
            }}
          />
          <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase">
            {episodeData.episode}
          </span>
        </div>

        <h2
          className="text-lg font-bold mb-1"
          style={{ color: episodeData.color }}
        >
          {currentLevel?.name}
        </h2>

        <div className="text-white/40 text-xs mb-3 italic">
          "{episodeData.theme}"
        </div>

        <div className="space-y-1 text-[10px] font-mono">
          <div className="flex justify-between">
            <span className="text-white/30">GUEST:</span>
            <span className="text-white/60">{episodeData.guest}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/30">TOPIC:</span>
            <span style={{ color: episodeData.color }}>{episodeData.topic}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full">
          <div className="flex justify-between text-[9px] text-white/30 mb-1">
            <span>SCROLL</span>
            <span>{(scrollProgress * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${scrollProgress * 100}%`,
                background: `linear-gradient(90deg, ${episodeData.color}, #ff007f)`
              }}
            />
          </div>
        </div>
      </div>

      {/* Top-right: Cosmic Coordinates - Enhanced Glassmorphism */}
      <div
        className="absolute top-8 right-8 glass-panel p-3 pointer-events-auto text-right backdrop-blur-xl border border-white/20 shadow-2xl"
        style={{
          background: `rgba(0, 0, 0, 0.4)`,
          boxShadow: `0 0 30px ${episodeData.color}33`
        }}
      >
        <div className="text-[8px] text-white/30 tracking-[0.5em] mb-1">DIMENSION</div>
        <div className="text-midnight-cyan text-sm font-mono">
          {activeLevel === 0 ? 'CHROMATIC RIBBON' :
            activeLevel === 1 ? 'EARTH 4-169' :
              activeLevel === 2 ? 'CLOWN WORLD' :
                activeLevel === 3 ? 'ASS CREAM' :
                  activeLevel === 4 ? 'MOON R3T8' : 'THE VOID'}
        </div>
        <div className="text-[9px] text-white/40 mt-1 font-mono">
          COORD: {(scrollProgress * 999).toFixed(0)}.{Math.floor(scrollProgress * 100 % 10)}.{activeLevel}
        </div>
      </div>

      {/* Navigation Panel */}
      <NavigationPanel />

      {/* Debug Panel */}
      <DebugPanel />

      {/* Bottom-center: Scroll Hint (Level 0 only) */}
      {activeLevel === 0 && scrollProgress < 0.05 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          {/* Animated scroll icon */}
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2 mb-3">
            <div className="w-1.5 h-3 bg-cyan-400 rounded-full animate-bounce" />
          </div>

          <div className="glass-panel px-6 py-3 text-center">
            <p className="text-midnight-light text-sm font-bold tracking-widest animate-pulse">
              ↓ SCROLL TO EXPLORE ↓
            </p>
            <p className="text-white/40 text-[10px] mt-2">
              Enter the Multiverse Simulator
            </p>
            <p className="text-white/20 text-[8px] mt-1 hidden md:block">
              Or press ↓ • 1-6 to jump • L for menu
            </p>
          </div>
        </div>
      )}

      {/* Level Transition Indicator */}
      {scrollProgress > 0 && (
        <div className="absolute bottom-8 right-8 glass-panel p-2 pointer-events-auto">
          <div className="flex gap-1">
            {LEVEL_RANGES.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeLevel ? 'scale-125' : 'scale-100 opacity-40'
                  }`}
                style={{
                  backgroundColor: i === activeLevel ? episodeData.color : '#ffffff'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Help Button */}
      <QuickHelpButton />

      {/* U1: Audio Controls */}
      <AudioControls />

      {/* U4: Mini-Map */}
      <MiniMap />

      {/* Bottom Right Tool Buttons */}
      <div className="fixed bottom-8 right-24 flex gap-2 pointer-events-auto z-50">
        {/* U2: Screenshot Button */}
        <ScreenshotButton />

        {/* U3: Keyboard Shortcuts Button */}
        <KeyboardShortcutsButton />

        {/* U5: Quote Journal Button */}
        <QuoteJournalButton />
      </div>

      {/* U3: Keyboard Shortcuts Panel (modal) */}
      <KeyboardShortcuts />

      {/* U5: Quote Journal Panel (modal) */}
      <QuoteJournal />
    </div>
  );
}
