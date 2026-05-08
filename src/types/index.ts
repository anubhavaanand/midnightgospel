export enum UniverseType {
  SURREAL = 'surreal',
  GLITCH = 'glitch',
  CELESTIAL = 'celestial',
  VOID = 'void'
}

export interface UniverseConfig {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  shaderSpeed: number;
  distortion: number;
  gravity: number;
}

export interface Episode {
  id: number;
  title: string;
  guest: string;
  topic: string;
  description: string;
  universe: UniverseType;
}

export interface AudioContextState {
  analyzer: AnalyserNode | null;
  dataArray: Uint8Array | null;
  isPlaying: boolean;
  toggleAudio: () => void;
}
