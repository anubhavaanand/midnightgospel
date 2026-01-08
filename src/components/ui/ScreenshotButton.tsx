/**
 * U2: Screenshot/Share Button
 * Capture the current 3D view and share to social media or download.
 * Uses canvas capture for high-quality screenshots.
 */
import { useState, useCallback } from 'react';
import { useSceneStore } from '@store/sceneStore';
import { LEVEL_RANGES } from '@utils/constants';

export default function ScreenshotButton() {
    const [isCapturing, setIsCapturing] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [lastScreenshot, setLastScreenshot] = useState<string | null>(null);

    const activeLevel = useSceneStore((state) => state.activeLevel);
    const levelName = LEVEL_RANGES[activeLevel]?.name || 'Unknown';

    const captureScreenshot = useCallback(async () => {
        setIsCapturing(true);

        try {
            // Find the WebGL canvas
            const canvas = document.querySelector('canvas');
            if (!canvas) throw new Error('Canvas not found');

            // Get data URL from canvas
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            setLastScreenshot(dataUrl);
            setShowMenu(true);
        } catch (error) {
            console.error('Screenshot failed:', error);
        } finally {
            setIsCapturing(false);
        }
    }, []);

    const downloadScreenshot = useCallback(() => {
        if (!lastScreenshot) return;

        const link = document.createElement('a');
        link.download = `midnight-gospel-${levelName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
        link.href = lastScreenshot;
        link.click();
        setShowMenu(false);
    }, [lastScreenshot, levelName]);

    const shareToTwitter = useCallback(() => {
        const text = `Exploring "${levelName}" in the Midnight Gospel Multiverse Simulator! 🌌✨`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }, [levelName]);

    const copyToClipboard = useCallback(async () => {
        if (!lastScreenshot) return;

        try {
            const response = await fetch(lastScreenshot);
            const blob = await response.blob();
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            alert('Screenshot copied to clipboard!');
        } catch (error) {
            console.error('Copy failed:', error);
            // Fallback: open in new tab
            window.open(lastScreenshot, '_blank');
        }
    }, [lastScreenshot]);

    return (
        <div className="pointer-events-auto relative">
            {/* Capture Button */}
            <button
                onClick={captureScreenshot}
                disabled={isCapturing}
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 
                   flex items-center justify-center hover:bg-white/10 transition-all
                   shadow-lg hover:shadow-pink-500/20 disabled:opacity-50"
                title="Take Screenshot"
            >
                {isCapturing ? (
                    <span className="animate-spin">⚡</span>
                ) : (
                    <span className="text-lg">📸</span>
                )}
            </button>

            {/* Share Menu */}
            {showMenu && lastScreenshot && (
                <div className="absolute bottom-14 right-0 w-56 bg-black/70 backdrop-blur-xl 
                        border border-white/20 rounded-lg overflow-hidden shadow-2xl
                        animate-in slide-in-from-bottom-2 duration-200">
                    {/* Preview */}
                    <div className="relative aspect-video bg-black/50">
                        <img
                            src={lastScreenshot}
                            alt="Screenshot preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-2 text-[10px] text-white/60">
                            {levelName}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-2 space-y-1">
                        <button
                            onClick={downloadScreenshot}
                            className="w-full py-2 px-3 text-left text-sm text-white/80 hover:bg-white/10 
                         rounded flex items-center gap-2 transition-colors"
                        >
                            <span>💾</span> Download PNG
                        </button>
                        <button
                            onClick={copyToClipboard}
                            className="w-full py-2 px-3 text-left text-sm text-white/80 hover:bg-white/10 
                         rounded flex items-center gap-2 transition-colors"
                        >
                            <span>📋</span> Copy to Clipboard
                        </button>
                        <button
                            onClick={shareToTwitter}
                            className="w-full py-2 px-3 text-left text-sm text-cyan-400 hover:bg-cyan-500/10 
                         rounded flex items-center gap-2 transition-colors"
                        >
                            <span>🐦</span> Share on Twitter
                        </button>
                    </div>

                    {/* Close */}
                    <button
                        onClick={() => setShowMenu(false)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 
                       flex items-center justify-center text-white/60 hover:text-white
                       text-xs transition-colors"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
}

