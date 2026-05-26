import React from 'react';
import { Html } from '@react-three/drei';
import { useDialogueStore } from '../../../store/useDialogueStore';

export const DebateUI: React.FC = () => {
  const { narrativePhase, setNarrativePhase } = useDialogueStore();

  if (narrativePhase !== 'DEBATE') return null;

  return (
    <Html position={[0, 2, 0]} center zIndexRange={[100, 0]}>
      <div className="flex flex-col gap-2 bg-black/80 p-4 rounded-xl border border-fuchsia-500/50 backdrop-blur-md w-64">
        <h3 className="text-white font-bold text-center mb-2">Debate the President</h3>
        
        <button 
          onClick={() => setNarrativePhase('CHAOS_INTRO')}
          className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white py-2 px-4 rounded-lg transition-colors text-sm"
        >
          Argue about drug policy
        </button>
        
        <button 
          onClick={() => setNarrativePhase('ZOMBIE_MUSICAL')}
          className="bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg transition-colors text-sm"
        >
          Start a musical number
        </button>
      </div>
    </Html>
  );
};
