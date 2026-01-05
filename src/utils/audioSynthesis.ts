/**
 * Audio Synthesis
 * 
 * Procedurally generated sound effects for lo-fi sci-fi aesthetic.
 * Creates tape hiss, vinyl crackle, analog synth drones, and glitch effects.
 */

/**
 * Generate procedural audio buffer for tape hiss
 */
export function generateTapeHiss(
  audioContext: AudioContext,
  duration: number = 2,
  intensity: number = 0.3
): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  // White noise filtered for tape hiss character
  for (let i = 0; i < buffer.length; i++) {
    const noise = Math.random() * 2 - 1;
    
    // Simple high-pass-ish filter simulation
    const filtered = noise * intensity * 0.1;
    data[i] = filtered;
  }

  return buffer;
}

/**
 * Generate procedural audio buffer for vinyl crackle
 */
export function generateVinylCrackle(
  audioContext: AudioContext,
  duration: number = 2,
  density: number = 0.3
): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  // Sparse clicks with decay envelope
  for (let i = 0; i < buffer.length; i++) {
    if (Math.random() < density * 0.001) {
      // Generate click
      const clickLength = Math.floor(sampleRate * 0.001); // 1ms click
      const decayFactor = 0.9;
      
      for (let j = 0; j < Math.min(clickLength, buffer.length - i); j++) {
        data[i + j] += (Math.random() * 2 - 1) * Math.pow(decayFactor, j);
      }
    }
  }

  return buffer;
}

/**
 * Generate procedural audio buffer for analog synth drone
 */
export function generateAnalogDrone(
  audioContext: AudioContext,
  frequency: number = 55, // Low frequency for drone
  duration: number = 4,
  modulation: number = 0.2
): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  // Sine wave with slight frequency modulation for "analog" character
  for (let i = 0; i < buffer.length; i++) {
    const t = i / sampleRate;
    
    // Base frequency with subtle LFO modulation
    const lfo = Math.sin(t * 0.5) * frequency * modulation;
    const f = frequency + lfo;
    
    // Slight decay envelope
    const envelope = Math.max(0.3, 1 - t / (duration * 2));
    
    data[i] = Math.sin(2 * Math.PI * f * t) * 0.15 * envelope;
  }

  return buffer;
}

/**
 * Generate procedural audio buffer for glitch noise
 */
export function generateGlitchNoise(
  audioContext: AudioContext,
  duration: number = 0.5,
  intensity: number = 0.8
): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  // Harsh digital noise with bit-depth reduction
  const bitDepth = 8 + Math.random() * 8; // 8-16 bit
  const levels = Math.pow(2, bitDepth);

  for (let i = 0; i < buffer.length; i++) {
    const noise = Math.random() * 2 - 1;
    
    // Bit-depth reduction for digital glitch
    const quantized = Math.round(noise * (levels - 1)) / (levels - 1);
    
    // Fade envelope
    const t = i / buffer.length;
    const envelope = Math.sin(t * Math.PI) * intensity;
    
    data[i] = quantized * envelope;
  }

  return buffer;
}

/**
 * Generate "digital phone call" effect
 */
export function generatePhoneEffect(
  audioContext: AudioContext,
  duration: number = 2
): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  // Combination of low-pass filter effect + slight distortion
  
  for (let i = 0; i < buffer.length; i++) {
    // Base tone (like dial tone modulation)
    const t = i / sampleRate;
    const tone = Math.sin(2 * Math.PI * 800 * t) * 0.1 + 
                 Math.sin(2 * Math.PI * 1200 * t) * 0.1;
    
    // Add some noise
    const noise = (Math.random() * 2 - 1) * 0.05;
    
    data[i] = (tone + noise) * 0.3;
  }

  return buffer;
}

/**
 * Generate "ethereal" pad sound
 */
export function generateEtherealPad(
  audioContext: AudioContext,
  baseFrequency: number = 110,
  duration: number = 4
): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  // Layered sine waves with different frequencies for rich harmonic content
  const harmonics = [1, 1.5, 2, 3, 5]; // Partial frequencies
  
  for (let i = 0; i < buffer.length; i++) {
    const t = i / sampleRate;
    let sample = 0;

    for (const harmonic of harmonics) {
      const f = baseFrequency * harmonic;
      
      // Slow amplitude modulation
      const am = 0.5 + 0.5 * Math.sin(t * 0.3);
      
      sample += Math.sin(2 * Math.PI * f * t) * am * (0.2 / harmonics.length);
    }

    // Fade envelope (attack + sustain + release)
    let envelope = 1;
    if (t < 0.1) {
      envelope = t / 0.1; // Attack
    } else if (t > duration * 0.8) {
      envelope = (duration - t) / (duration * 0.2); // Release
    }

    data[i] = sample * envelope * 0.3;
  }

  return buffer;
}

/**
 * Mix multiple audio buffers
 */
export function mixBuffers(
  audioContext: AudioContext,
  buffers: { buffer: AudioBuffer; volume: number }[]
): AudioBuffer {
  if (buffers.length === 0) return audioContext.createBuffer(1, 0, audioContext.sampleRate);

  const duration = Math.max(...buffers.map((b) => b.buffer.duration));
  const sampleRate = audioContext.sampleRate;
  const mixBuffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const mixData = mixBuffer.getChannelData(0);

  // Sum all buffers
  for (const { buffer, volume } of buffers) {
    const data = buffer.getChannelData(0);
    for (let i = 0; i < Math.min(data.length, mixData.length); i++) {
      mixData[i] += data[i] * volume;
    }
  }

  // Normalize to prevent clipping
  let max = 0;
  for (let i = 0; i < mixData.length; i++) {
    max = Math.max(max, Math.abs(mixData[i]));
  }

  if (max > 1) {
    for (let i = 0; i < mixData.length; i++) {
      mixData[i] /= max;
    }
  }

  return mixBuffer;
}
