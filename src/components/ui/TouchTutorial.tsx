import { useState, useEffect } from 'react';
import { useDeviceDetection } from '@hooks/useMobileResponsive';

/**
 * Mobile Touch Tutorial
 * Shows first-time users how to navigate on mobile devices
 */

interface TouchTutorialProps {
    onDismiss?: () => void;
}

export function TouchTutorial({ onDismiss }: TouchTutorialProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [step, setStep] = useState(0);
    const { isMobile, touchEnabled } = useDeviceDetection();

    useEffect(() => {
        // Only show on mobile/touch devices
        if (!isMobile && !touchEnabled) return;

        // Check if user has seen the tutorial
        const hasSeenTutorial = localStorage.getItem('mg-tutorial-seen');
        if (hasSeenTutorial) return;

        // Show after a short delay
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
    }, [isMobile, touchEnabled]);

    const handleDismiss = () => {
        localStorage.setItem('mg-tutorial-seen', 'true');
        setIsVisible(false);
        onDismiss?.();
    };

    const handleNext = () => {
        if (step < 2) {
            setStep(step + 1);
        } else {
            handleDismiss();
        }
    };

    if (!isVisible) return null;

    const tutorialSteps = [
        {
            icon: '👆',
            title: 'Swipe Up/Down',
            description: 'Scroll through the multiverse to change levels'
        },
        {
            icon: '👌',
            title: 'Pinch to Zoom',
            description: 'Get closer to cosmic elements'
        },
        {
            icon: '🎯',
            title: 'Tap to Interact',
            description: 'Interact with floating objects and quotes'
        }
    ];

    const currentStep = tutorialSteps[step];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="max-w-sm mx-4 text-center">
                {/* Animated Icon */}
                <div className="text-6xl mb-6 animate-bounce">
                    {currentStep.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-2">
                    {currentStep.title}
                </h3>

                {/* Description */}
                <p className="text-white/60 mb-8">
                    {currentStep.description}
                </p>

                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mb-6">
                    {tutorialSteps.map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-cyan-400 w-6' : 'bg-white/30'
                                }`}
                        />
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={handleDismiss}
                        className="px-6 py-2 text-sm text-white/50 hover:text-white transition-colors"
                    >
                        Skip
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full text-white font-bold text-sm uppercase tracking-wider hover:scale-105 transition-transform"
                    >
                        {step < 2 ? 'Next' : 'Start'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * Quick Help Button - Shows control hints
 */
export function QuickHelpButton() {
    const [isOpen, setIsOpen] = useState(false);
    const { isMobile } = useDeviceDetection();

    const controls = isMobile ? [
        { action: 'Navigate', control: 'Swipe Up/Down' },
        { action: 'Zoom', control: 'Pinch' },
        { action: 'Interact', control: 'Tap' },
    ] : [
        { action: 'Navigate', control: 'Scroll / Arrow Keys' },
        { action: 'Jump Level', control: 'Press 1-6' },
        { action: 'Level Menu', control: 'Press L' },
        { action: 'Exit', control: 'ESC' },
    ];

    return (
        <div className="fixed bottom-8 right-8 z-30">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
                aria-label="Help"
            >
                ?
            </button>

            {isOpen && (
                <div className="absolute bottom-12 right-0 w-48 glass-panel p-3 rounded-lg">
                    <h4 className="text-xs font-bold text-white/80 mb-2 uppercase tracking-wider">Controls</h4>
                    <div className="space-y-1">
                        {controls.map((c, i) => (
                            <div key={i} className="flex justify-between text-[10px]">
                                <span className="text-white/50">{c.action}</span>
                                <span className="text-cyan-400 font-mono">{c.control}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
