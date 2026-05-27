import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLevelStore } from '../../store/useLevelStore';

export const NavigationMenu: React.FC = () => {
  const { isMenuOpen, setMenuOpen, activeLevelId, setLevel, setTransitioning } = useLevelStore();

  const menuItems = [
    { id: 0, label: "L-00", name: "CHROMATIC RIBBON (CLANCY'S HUB)" },
    { id: 1, label: "L-01", name: "EARTH 4-169 (ZOMBIE CAPITOL)" },
    { id: 2, label: "L-02", name: "BABY CLOWN PASTURES (SLAUGHTERHOUSE)" },
    { id: 3, label: "L-03", name: "CREAM OCEAN (CEREMONIAL MAGIC)" },
    { id: 4, label: "L-04", name: "VENGEANCE KINGDOM (BLOOD ROSE)" },
    { id: 5, label: "L-05", name: "MOON R3T8 (SOUL PRISON)" },
    { id: 6, label: "L-06", name: "BUTON 78914 (MEDITATION CAVE)" },
    { id: 7, label: "L-07", name: "PLANET BLANK BALL (DEATH INDUSTRIAL)" },
    { id: 8, label: "L-08", name: "MOUSE OF SILVER (LIFE CYCLE)" }
  ];

  const handleLevelSelect = (id: number) => {
    if (id === activeLevelId) {
      setMenuOpen(false);
      return;
    }

    setTransitioning(true);
    setMenuOpen(false);

    // circular portal transition wipe timing
    setTimeout(() => {
      setLevel(id as any);
      setTransitioning(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 200 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col justify-center items-center p-8 pointer-events-auto"
        >
          {/* Subtle spinning background spiral */}
          <div className="absolute w-[80vw] h-[80vw] rounded-full bg-gradient-to-tr from-fuchsia-900/10 via-black to-cyan-900/10 opacity-30 mix-blend-color-dodge animate-spin-slow pointer-events-none" />

          {/* Navigation Title */}
          <motion.div 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-8 select-none text-center"
          >
            <h2 className="font-sans-elegant text-sm font-semibold tracking-[0.4em] text-gray-500 uppercase">
              MULTIVERSE SIMULATOR INDEX
            </h2>
            <p className="font-mono-diagnostic text-[10px] text-fuchsia-400/70 mt-1 uppercase">
              Velma 960 System Target Nodes
            </p>
          </motion.div>

          {/* Clean Levels Grid List */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="w-full max-w-xl flex flex-col gap-3 font-mono-diagnostic"
          >
            {menuItems.map((item) => {
              const isActive = activeLevelId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLevelSelect(item.id)}
                  className={`w-full py-4 px-6 rounded-2xl flex justify-between items-center transition-all duration-300 border text-left group ${
                    isActive
                      ? 'bg-fuchsia-950/20 border-fuchsia-500 text-fuchsia-400'
                      : 'bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/[0.06] hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-bold ${isActive ? 'text-fuchsia-500' : 'text-gray-600 group-hover:text-gray-400'}`}>
                      {item.label}
                    </span>
                    <span className="text-xs font-medium tracking-wide uppercase">
                      {item.name}
                    </span>
                  </div>
                  {/* Indicator hover arrow */}
                  <span className={`text-xs transition-transform duration-300 ${isActive ? 'translate-x-0' : 'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
                    {isActive ? '● ACTIVE' : 'LAUNCH ↗'}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
