import React, { useState, useEffect } from 'react';

export const TouchJoystick: React.FC = () => {
  const [touching, setTouching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const detectMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    detectMobile();
  }, []);

  if (!isMobile) return null;

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const touch = e.touches[0];
    
    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 50);
    const angle = Math.atan2(dy, dx);
    
    setPosition({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    });

    // Set global decoupled movement vector state
    (window as any).joystickDelta = {
      x: (Math.cos(angle) * distance) / 50,
      y: -(Math.sin(angle) * distance) / 50
    };
  };

  const handleTouchEnd = () => {
    setTouching(false);
    setPosition({ x: 0, y: 0 });
    (window as any).joystickDelta = { x: 0, y: 0 };
  };

  return (
    <div 
      className={`absolute bottom-8 right-8 w-28 h-28 rounded-full border-2 bg-black/40 backdrop-blur-sm z-[100] transition-all duration-200 ${
        touching ? 'border-fuchsia-500 bg-black/60 shadow-[0_0_15px_rgba(240,46,170,0.4)]' : 'border-fuchsia-500/20'
      }`}
      onTouchStart={() => setTouching(true)}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className={`w-12 h-12 rounded-full absolute top-8 left-8 border border-white/20 transition-all shadow-lg ${
          touching ? 'bg-fuchsia-500 scale-95 shadow-[0_0_10px_rgba(240,46,170,0.6)]' : 'bg-fuchsia-600'
        }`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`
        }}
      />
    </div>
  );
};
