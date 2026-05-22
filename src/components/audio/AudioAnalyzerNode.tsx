import React, { useEffect, useRef } from 'react';
import { useDialogueStore } from '../../store/useDialogueStore';

interface AudioAnalyzerNodeProps {
  audioUrl?: string; // Optional for testing or actual use
}

export const AudioAnalyzerNode: React.FC<AudioAnalyzerNodeProps> = ({ audioUrl: _audioUrl }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const requestRef = useRef<number>();
  const updateAudioMetrics = useDialogueStore((state) => state.updateAudioMetrics);

  useEffect(() => {
    // We initialize on first render for this component
    // In a real scenario, this might need to be tied to a user interaction (like a play button)
    const initAudio = async () => {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyzerRef.current = audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 256;
      
      const bufferLength = analyzerRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      const analyze = () => {
        if (!analyzerRef.current || !dataArrayRef.current) return;
        
        analyzerRef.current.getByteFrequencyData(dataArrayRef.current as any);
        
        let bassSum = 0;
        let midSum = 0;
        let trebleSum = 0;
        let rmsSum = 0;
        
        const len = dataArrayRef.current.length;
        for (let i = 0; i < len; i++) {
          const val = dataArrayRef.current[i];
          const normalized = val / 255;
          rmsSum += normalized * normalized;
          
          if (i < len * 0.1) bassSum += normalized;
          else if (i < len * 0.6) midSum += normalized;
          else trebleSum += normalized;
        }

        const bass = bassSum / (len * 0.1);
        const mid = midSum / (len * 0.5);
        const treble = trebleSum / (len * 0.4);
        const rms = Math.sqrt(rmsSum / len);

        updateAudioMetrics({ bass, mid, treble, rms });
        
        requestRef.current = requestAnimationFrame(analyze);
      };
      
      analyze();
    };

    initAudio();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [updateAudioMetrics]);

  return null; // Logic-only component, mounts and pumps data to store
};
