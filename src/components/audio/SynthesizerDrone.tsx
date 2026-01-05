import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

/**
 * Procedural Audio Drone Generator
 * Creates a "Lo-Fi Sci-Fi" background ambience using Web Audio API nodes directly.
 * No external files required.
 */
export default function SynthesizerDrone() {
    const { camera } = useThree();
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    useEffect(() => {
        const initAudio = async () => {
            // Create context only after user interaction ideally, but we can setup
            // We rely on the user interacting with the page (scrolling/clicking) to resume context if suspended.
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            audioContextRef.current = ctx;

            // Master Gain
            const masterGain = ctx.createGain();
            masterGain.gain.value = 0.08; // Very low background volume
            masterGain.connect(ctx.destination);
            gainNodeRef.current = masterGain;

            // Oscillator 1: Deep Drone (Bass)
            const osc1 = ctx.createOscillator();
            osc1.type = 'sawtooth';
            osc1.frequency.value = 55; // A1

            const filter1 = ctx.createBiquadFilter();
            filter1.type = 'lowpass';
            filter1.frequency.value = 200;

            osc1.connect(filter1).connect(masterGain);
            osc1.start();

            // Oscillator 2: Ethereal Highs (Sine)
            const osc2 = ctx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.value = 220; // A3

            // LFO for pitch drifting (tape wobble effect)
            const lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.1; // Slow drift
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 5; // Drift amount
            lfo.connect(lfoGain).connect(osc2.frequency);
            lfo.start();

            // Stereo Panner for movement
            const panner = ctx.createStereoPanner();

            // LFO for panning
            const panLfo = ctx.createOscillator();
            panLfo.type = 'sine';
            panLfo.frequency.value = 0.05;
            panLfo.connect(panner.pan);
            panLfo.start();

            osc2.connect(panner).connect(masterGain);
            osc2.start();

            // Pink Noise for "Tape Hiss"
            const bufferSize = 4096;
            const pinkNoise = ctx.createScriptProcessor(bufferSize, 1, 1);
            pinkNoise.onaudioprocess = function (e) {
                const output = e.outputBuffer.getChannelData(0);
                let b0, b1, b2, b3, b4, b5, b6;
                b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
                for (let i = 0; i < bufferSize; i++) {
                    const white = Math.random() * 2 - 1;
                    b0 = 0.99886 * b0 + white * 0.0555179;
                    b1 = 0.99332 * b1 + white * 0.0750759;
                    b2 = 0.96900 * b2 + white * 0.1538520;
                    b3 = 0.86650 * b3 + white * 0.3104856;
                    b4 = 0.55000 * b4 + white * 0.5329522;
                    b5 = -0.7616 * b5 - white * 0.0168980;
                    output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                    output[i] *= 0.11; //  (roughly) compensate for gain
                    b6 = white * 0.115926;
                }
            };
            const noiseGain = ctx.createGain();
            noiseGain.gain.value = 0.15; // Subtle hiss
            pinkNoise.connect(noiseGain).connect(masterGain);

            // Cleanup
            return () => {
                osc1.stop();
                osc2.stop();
                lfo.stop();
                panLfo.stop();
                pinkNoise.disconnect();
                ctx.close();
            };
        };

        const cleanup = initAudio();

        // Resume logic on click
        const handleResume = () => {
            if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }
        };
        window.addEventListener('click', handleResume);
        window.addEventListener('keydown', handleResume);

        return () => {
            cleanup.then(c => c && c());
            window.removeEventListener('click', handleResume);
            window.removeEventListener('keydown', handleResume);
        };
    }, []);

    return null;
}
