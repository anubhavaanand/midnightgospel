import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black overflow-hidden pointer-events-none">
      <div className="relative flex flex-col items-center">
        {/* Psychedelic pulsating orb */}
        <div className="w-32 h-32 rounded-full bg-fuchsia-600 blur-2xl animate-pulse opacity-50 mix-blend-screen absolute" />
        <div className="w-24 h-24 rounded-full bg-cyan-400 blur-xl animate-pulse opacity-60 mix-blend-screen absolute delay-75" />
        
        <h1 className="text-white text-3xl font-bold tracking-widest uppercase z-10 drop-shadow-lg font-mono">
          Entering Simulation...
        </h1>
        <p className="text-gray-400 mt-2 tracking-widest text-sm font-mono animate-pulse">
          ALIGNING CHAKRAS
        </p>
      </div>
    </div>
  );
};
