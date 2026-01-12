# Midnight Gospel 3D

🌌 **Visit the Simulator:** [https://midnightgospel.vercel.app/](https://midnightgospel.vercel.app/)

## Overview

**Midnight Gospel 3D** is a browser-based immersive 3D experience adapting the Netflix animated series into an interactive "Multiverse Simulator." Built with React Three Fiber (R3F), Three.js WebGL, and Google Gemini AI for generative assets.

## Quick Start

### Prerequisites

- Node.js 18+ and npm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/anubhavaanand/midnightgospel.git
cd midnightgospel

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Add your Google AI API key to `.env`:

```
VITE_GOOGLE_API_KEY=your_google_ai_api_key_here
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (TypeScript + Vite)
- `npm run preview` - Preview production build locally
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Architecture

- **React 18** + **TypeScript** for component structure
- **React Three Fiber** for declarative 3D scene graph
- **Three.js** for WebGL rendering
- **Zustand** for state management
- **Tailwind CSS** for UI styling
- **Framer Motion** + **GSAP** for animations
- **@react-three/rapier** (v1.5.x) for physics simulation - locked to 1.x for React 18 compatibility
- **Google Gemini AI** for generative assets and shaders

## Project Structure

```
src/
├── components/        # React components
│   ├── levels/       # 6 scrollable level segments
│   ├── effects/      # Visual effects (particles, transitions)
│   ├── ui/           # User interface components
│   └── physics/      # Physics-based interactions
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
└── App.tsx           # Main application entry
```

## Performance

- **Desktop**: 60 FPS target
- **Mobile**: 30+ FPS with adaptive quality
- **Build Size**: ~1 MB gzipped
- **TypeScript**: 0 errors (strict mode)

## Development

See [.github/copilot-instructions.md](.github/copilot-instructions.md) for detailed architecture documentation and development guidelines.

## License

MIT