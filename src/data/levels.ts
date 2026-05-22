export type LevelId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface LevelConfig {
  id: LevelId;
  name: string;
  episode: number | null;
  palette: {
    primary: string;
    secondary: string;
    background: string;
    bloom: string;
  };
  shaderProfile: {
    distortionIntensity: number;
    speed: number;
    geometry: 'sphere' | 'plane' | 'torus' | 'icosahedron' | 'cylinder' | 'tunnel';
  };
}

export const LEVELS: LevelConfig[] = [
  {
    id: 0,
    name: "Chromatic Ribbon",
    episode: null,
    palette: {
      primary: "#FF00FF",
      secondary: "#00FFFF",
      background: "#050014",
      bloom: "#FF00FF"
    },
    shaderProfile: {
      distortionIntensity: 0.5,
      speed: 1.0,
      geometry: 'torus'
    }
  },
  {
    id: 1,
    name: "Zombie Capitol",
    episode: 1,
    palette: {
      primary: "#14C832",
      secondary: "#8B0000",
      background: "#1A0F14",
      bloom: "#14C832"
    },
    shaderProfile: {
      distortionIntensity: 0.8,
      speed: 1.5,
      geometry: 'sphere'
    }
  },
  {
    id: 2,
    name: "Baby Clown Pastures",
    episode: 2,
    palette: {
      primary: "#FFB6C1",
      secondary: "#FFFACD",
      background: "#87CEEB",
      bloom: "#FFB6C1"
    },
    shaderProfile: {
      distortionIntensity: 0.3,
      speed: 0.8,
      geometry: 'plane'
    }
  },
  {
    id: 3,
    name: "Cream Ocean Planet",
    episode: 3,
    palette: {
      primary: "#FFFDD0",
      secondary: "#4682B4",
      background: "#191970",
      bloom: "#4682B4"
    },
    shaderProfile: {
      distortionIntensity: 0.4,
      speed: 1.2,
      geometry: 'plane'
    }
  },
  {
    id: 4,
    name: "Vengeance Kingdom",
    episode: 4,
    palette: {
      primary: "#8B4513",
      secondary: "#FF4500",
      background: "#2F4F4F",
      bloom: "#FF4500"
    },
    shaderProfile: {
      distortionIntensity: 0.6,
      speed: 1.1,
      geometry: 'icosahedron'
    }
  },
  {
    id: 5,
    name: "Soul Prison",
    episode: 5,
    palette: {
      primary: "#8A2BE2",
      secondary: "#00CED1",
      background: "#000000",
      bloom: "#8A2BE2"
    },
    shaderProfile: {
      distortionIntensity: 0.7,
      speed: 0.9,
      geometry: 'cylinder'
    }
  },
  {
    id: 6,
    name: "Meditation Cave",
    episode: 6,
    palette: {
      primary: "#20B2AA",
      secondary: "#F0E68C",
      background: "#2F4F4F",
      bloom: "#20B2AA"
    },
    shaderProfile: {
      distortionIntensity: 0.2,
      speed: 0.5,
      geometry: 'sphere'
    }
  },
  {
    id: 7,
    name: "Planet Blank Ball",
    episode: 7,
    palette: {
      primary: "#2F6C8F",
      secondary: "#F58DFF",
      background: "#000000",
      bloom: "#2F6C8F"
    },
    shaderProfile: {
      distortionIntensity: 0.3,
      speed: 0.8,
      geometry: 'sphere'
    }
  },
  {
    id: 8,
    name: "Life Cycle Trainworld",
    episode: 8,
    palette: {
      primary: "#FFD700",
      secondary: "#DC143C",
      background: "#8B0000",
      bloom: "#FFD700"
    },
    shaderProfile: {
      distortionIntensity: 0.9,
      speed: 2.0,
      geometry: 'tunnel'
    }
  }
];
