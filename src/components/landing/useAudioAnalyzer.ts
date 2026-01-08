import { useState, useCallback, useRef, useEffect } from 'react';

export const useAudioAnalyzer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<OscillatorNode | null>(null);
    const lfoRef = useRef<OscillatorNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);

    const initContext = useCallback(() => {
        if (!audioContextRef.current) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            audioContextRef.current = new AudioContextClass();

            const analyzer = audioContextRef.current.createAnalyser();
            analyzer.fftSize = 256;
            analyzerRef.current = analyzer;

            const bufferLength = analyzer.frequencyBinCount;
            dataArrayRef.current = new Uint8Array(bufferLength);

            const gainNode = audioContextRef.current.createGain();
            gainNode.gain.value = 0.15;
            gainNode.connect(audioContextRef.current.destination);
            gainNodeRef.current = gainNode;
        }
        return audioContextRef.current;
    }, []);

    const triggerWarp = useCallback(() => {
        const context = initContext();
        if (context.state === 'suspended') context.resume();

        const warpOsc = context.createOscillator();
        const warpGain = context.createGain();
        const filter = context.createBiquadFilter();

        warpOsc.type = 'square';
        warpOsc.frequency.setValueAtTime(100, context.currentTime);
        warpOsc.frequency.exponentialRampToValueAtTime(2000, context.currentTime + 0.5);

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(100, context.currentTime);
        filter.frequency.exponentialRampToValueAtTime(5000, context.currentTime + 0.5);

        warpGain.gain.setValueAtTime(0.2, context.currentTime);
        warpGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.6);

        warpOsc.connect(filter);
        filter.connect(warpGain);
        warpGain.connect(context.destination);

        warpOsc.start();
        warpOsc.stop(context.currentTime + 0.6);
    }, [initContext]);

    const toggleAudio = useCallback(async () => {
        const context = initContext();

        if (isPlaying) {
            if (sourceRef.current) sourceRef.current.stop();
            if (lfoRef.current) lfoRef.current.stop();
            sourceRef.current = null;
            lfoRef.current = null;
            setIsPlaying(false);
            return;
        }

        if (context.state === 'suspended') await context.resume();

        try {
            const osc = context.createOscillator();
            const lfo = context.createOscillator();
            const lfoGain = context.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(55, context.currentTime);

            lfo.type = 'sine';
            lfo.frequency.setValueAtTime(0.5, context.currentTime);
            lfoGain.gain.setValueAtTime(10, context.currentTime);

            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);

            const filter = context.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, context.currentTime);
            filter.Q.setValueAtTime(10, context.currentTime);

            osc.connect(filter);
            filter.connect(analyzerRef.current!);
            analyzerRef.current!.connect(gainNodeRef.current!);

            lfo.start();
            osc.start();

            sourceRef.current = osc;
            lfoRef.current = lfo;
            setIsPlaying(true);
        } catch (err) {
            console.error('Audio failed:', err);
            setIsPlaying(false);
        }
    }, [isPlaying, initContext]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (sourceRef.current) {
                try { sourceRef.current.stop(); } catch (e) { }
            }
            if (lfoRef.current) {
                try { lfoRef.current.stop(); } catch (e) { }
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);

    return {
        isPlaying,
        toggleAudio,
        triggerWarp,
        analyzer: analyzerRef.current,
        dataArray: dataArrayRef.current
    };
};
