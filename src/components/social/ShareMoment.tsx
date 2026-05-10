/**
 * Share Moment Feature
 * Screenshot current scene and share with deep link
 */
import { useState } from 'react';
import { useThree } from '@react-three/fiber';
import { useSceneStore, ACHIEVEMENTS } from '@store/sceneStore';

export function useShareMoment() {
    const { gl } = useThree();
    const scrollProgress = useSceneStore((state) => state.scrollProgress);
    const unlockAchievement = useSceneStore((state) => state.unlockAchievement);
    const achievements = useSceneStore((state) => state.achievements);
    const [isCapturing, setIsCapturing] = useState(false);

    const captureScreenshot = async (): Promise<string> => {
        return new Promise((resolve) => {
            // Render one frame to ensure latest state
            gl.render(gl.domElement as unknown as THREE.Scene, gl.domElement as unknown as THREE.Camera);

            const dataUrl = gl.domElement.toDataURL('image/png');
            resolve(dataUrl);
        });
    };

    const shareToTwitter = async () => {
        const levelPercent = Math.round(scrollProgress * 100);
        const text = `🌌 Exploring the Midnight Gospel Multiverse Simulator at ${levelPercent}% progress! Check it out:`;
        const url = generateDeepLink();
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank');

        // Unlock share achievement
        if (!achievements.some((a) => a.id === ACHIEVEMENTS.SHARE_MOMENT.id)) {
            const { id, name, description, icon } = ACHIEVEMENTS.SHARE_MOMENT;
            unlockAchievement(id, name, description, icon);
        }
    };

    const downloadScreenshot = async () => {
        setIsCapturing(true);
        try {
            const dataUrl = await captureScreenshot();
            const link = document.createElement('a');
            link.download = `midnight-gospel-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();

            // Unlock share achievement
            if (!achievements.some((a) => a.id === ACHIEVEMENTS.SHARE_MOMENT.id)) {
                const { id, name, description, icon } = ACHIEVEMENTS.SHARE_MOMENT;
                unlockAchievement(id, name, description, icon);
            }
        } finally {
            setIsCapturing(false);
        }
    };

    const copyDeepLink = async () => {
        const url = generateDeepLink();
        await navigator.clipboard.writeText(url);

        // Unlock share achievement
        if (!achievements.some((a) => a.id === ACHIEVEMENTS.SHARE_MOMENT.id)) {
            const { id, name, description, icon } = ACHIEVEMENTS.SHARE_MOMENT;
            unlockAchievement(id, name, description, icon);
        }

        return url;
    };

    const generateDeepLink = () => {
        const baseUrl = window.location.origin;
        const progress = Math.round(scrollProgress * 1000) / 1000;
        return `${baseUrl}?progress=${progress}`;
    };

    return {
        captureScreenshot,
        shareToTwitter,
        downloadScreenshot,
        copyDeepLink,
        isCapturing,
    };
}

// UI Component for share panel
export default function ShareMoment() {
    const showSharePanel = useSceneStore((state) => state.showSharePanel);
    const toggleSharePanel = useSceneStore((state) => state.toggleSharePanel);
    const scrollProgress = useSceneStore((state) => state.scrollProgress);
    const [copied, setCopied] = useState(false);

    if (!showSharePanel) return null;

    const levelPercent = Math.round(scrollProgress * 100);

    const handleCopyLink = async () => {
        const baseUrl = window.location.origin;
        const progress = Math.round(scrollProgress * 1000) / 1000;
        const url = `${baseUrl}?progress=${progress}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareTwitter = () => {
        const text = `🌌 Exploring the Midnight Gospel Multiverse Simulator at ${levelPercent}% progress! Check it out:`;
        const url = `${window.location.origin}?progress=${scrollProgress}`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={toggleSharePanel} />

            {/* Panel */}
            <div className="relative w-full max-w-sm mx-4 bg-black/80 backdrop-blur-xl 
                      border border-white/20 rounded-xl shadow-2xl overflow-hidden
                      animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-white text-lg font-bold tracking-wider flex items-center gap-2">
                        <span>📤</span> SHARE MOMENT
                    </h2>
                    <button
                        onClick={toggleSharePanel}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center
                       text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Progress indicator */}
                    <div className="text-center">
                        <div className="text-4xl mb-2">🌌</div>
                        <div className="text-white font-bold">Progress: {levelPercent}%</div>
                        <div className="text-white/50 text-sm">Share your journey through the multiverse</div>
                    </div>

                    {/* Share buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleShareTwitter}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1DA1F2]/20 
                         border border-[#1DA1F2]/50 rounded-lg text-[#1DA1F2] font-bold
                         hover:bg-[#1DA1F2]/30 transition-colors"
                        >
                            🐦 Twitter
                        </button>
                        <button
                            onClick={handleCopyLink}
                            className={`flex items-center justify-center gap-2 px-4 py-3 
                         border rounded-lg font-bold transition-all ${copied
                                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                }`}
                        >
                            {copied ? '✓ Copied!' : '🔗 Copy Link'}
                        </button>
                    </div>

                    {/* Deep link preview */}
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-white/40 text-xs mb-1">Share Link</div>
                        <div className="text-cyan-400 text-sm break-all font-mono">
                            {window.location.origin}?progress={scrollProgress.toFixed(3)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Toggle button for share panel
export function ShareButton() {
    const toggleSharePanel = useSceneStore((state) => state.toggleSharePanel);

    return (
        <button
            onClick={toggleSharePanel}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 
                 flex items-center justify-center hover:bg-white/10 transition-all
                 shadow-lg hover:shadow-cyan-500/20"
            title="Share Moment (S)"
        >
            <span className="text-lg">📤</span>
        </button>
    );
}
