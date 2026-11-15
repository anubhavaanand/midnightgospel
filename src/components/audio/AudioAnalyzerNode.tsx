import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useDialogueStore } from '../../store/useDialogueStore';

interface AudioAnalyzerNodeProps {
  audioUrl?: string; // Optional for testing or actual use
}

export const AudioAnalyzerNode: React.FC<AudioAnalyzerNodeProps> = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const requestRef = useRef<number>();
  const updateAudioMetrics = useDialogueStore((state) => state.updateAudioMetrics);

  useEffect(() => {
    // We initialize on first render for this component
    // In a real scenario, this might need to be tied to a user interaction (like a play button)
    const initAudio = () => {
      try {
        const ctx = THREE.AudioContext.getContext();
        audioContextRef.current = ctx;
        analyzerRef.current = ctx.createAnalyser();
        analyzerRef.current.fftSize = 256;
        
        const bufferLength = analyzerRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        let lastBass = 0;
        let lastMid = 0;
        let lastTreble = 0;
        let lastRms = 0;

        const analyze = () => {
          if (!analyzerRef.current || !dataArrayRef.current) return;
          
          analyzerRef.current.getByteFrequencyData(dataArrayRef.current as unknown as Uint8Array<ArrayBuffer>);
          
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

          // Only dispatch when metrics measurably change
          if (
            Math.abs(bass - lastBass) > 0.01 ||
            Math.abs(mid - lastMid) > 0.01 ||
            Math.abs(treble - lastTreble) > 0.01 ||
            Math.abs(rms - lastRms) > 0.01
          ) {
            lastBass = bass;
            lastMid = mid;
            lastTreble = treble;
            lastRms = rms;
            updateAudioMetrics({ bass, mid, treble, rms });
          }
          
          requestRef.current = requestAnimationFrame(analyze);
        };
        
        analyze();
      } catch {
        // Safe fallback when audio is blocked or uninitialized
      }
    };

    initAudio();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (analyzerRef.current) {
        try {
          analyzerRef.current.disconnect();
        } catch {
          // Ignore if disconnected
        }
      }
    };
  }, [updateAudioMetrics]);

  return null; // Logic-only component, mounts and pumps data to store
};
