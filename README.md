<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/en/2/23/Midnight_Gospel_Logo.png" alt="Midnight Gospel" width="400"/>
  <h1>Midnight Gospel 3D Simulator</h1>
  
  <p><strong>An immersive, WebGL-powered interactive multiverse experience built with React Three Fiber.</strong></p>

  <p>
    <a href="https://midnightgospel.vercel.app"><img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel" alt="Vercel Deployed" /></a>
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
  </p>

  <p>
    <a href="#overview">Overview</a> •
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

---

## 🌌 Overview

The **Midnight Gospel 3D Simulator** is a browser-based, high-performance WebGL application that adapts the thematic elements of the animated series into an interactive "Multiverse Simulator". 

Players navigate a central "Hub" (The Chromatic Ribbon) and dive into diegetic portals that seamlessly load into distinct, mathematically driven 3D environments.

## ✨ Features

- **Seamless Scene Graph Routing**: Enter and exit 9 different 3D worlds without ever unmounting the WebGL context, ensuring zero memory leaks and 60FPS performance.
- **Dynamic GLSL Shaders**: Every episode features custom vertex and fragment shaders that react procedurally to time (`uTime`) and user interaction.
- **MoodSync Architecture**: A robust Zustand state engine that maps static dialogue trees to real-time shader uniform mutations (`uIntensity`, `uSpeed`, `uColorBloom`).
- **Accessible Cinematic Overlay**: Fully ARIA-compliant dialogue systems utilizing `framer-motion` for smooth cinematic reveals.

## 🚀 Quick Start

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

The simulator will be running locally at `http://localhost:5173`.

## 🏗️ Architecture & Technology Stack

We practice rigorous **Spec-Driven Development (SDD)** to ensure maximum scalability and type-safety.

- **Core**: React 18, TypeScript (Strict Mode)
- **3D Engine**: Three.js, React Three Fiber (R3F), `@react-three/drei`
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Testing & QA**: Vitest (Unit hooks), Playwright (E2E Routing)

## 🤝 Contributing

We welcome contributions! If you're looking to help out, please read our [CONTRIBUTING.md](CONTRIBUTING.md) guide.

If you encounter a bug or have a feature request, please [open an issue](https://github.com/anubhavaanand/midnightgospel/issues).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.