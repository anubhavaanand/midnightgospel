/**
 * U3: Keyboard Shortcuts Panel
 * Overlay showing all keyboard shortcuts for navigation and controls.
 * Beautiful glassmorphism design with organized sections.
 */
import { useEffect } from 'react';
import { useSceneStore } from '@store/sceneStore';

const SHORTCUTS = [
    {
        category: 'NAVIGATION',
        color: '#00ffff',
        items: [
            { keys: ['↑', '↓'], description: 'Scroll through levels' },
            { keys: ['1-7'], description: 'Jump to specific level' },
            { keys: ['Home'], description: 'Go to beginning' },
            { keys: ['End'], description: 'Go to end' },
            { keys: ['Space'], description: 'Pause/Resume auto-scroll' },
        ],
    },
    {
        category: 'INTERFACE',
        color: '#ff007f',
        items: [
            { keys: ['L'], description: 'Toggle level menu' },
            { keys: ['M'], description: 'Toggle mini-map' },
            { keys: ['K'], description: 'Toggle this panel' },
            { keys: ['J'], description: 'Toggle quote journal' },
            { keys: ['Esc'], description: 'Close all panels' },
        ],
    },
    {
        category: 'AUDIO',
        color: '#9900ff',
        items: [
            { keys: ['A'], description: 'Toggle audio controls' },
            { keys: ['0'], description: 'Mute/Unmute' },
            { keys: ['+', '-'], description: 'Volume up/down' },
        ],
    },
    {
        category: 'OTHER',
        color: '#ffcc00',
        items: [
            { keys: ['P'], description: 'Take screenshot' },
            { keys: ['F'], description: 'Toggle fullscreen' },
            { keys: ['D'], description: 'Toggle debug info' },
        ],
    },
];

export default function KeyboardShortcuts() {
    const showKeyboardShortcuts = useSceneStore((state) => state.showKeyboardShortcuts);
    const toggleKeyboardShortcuts = useSceneStore((state) => state.toggleKeyboardShortcuts);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showKeyboardShortcuts) {
                toggleKeyboardShortcuts();
            }
            if (e.key === 'k' || e.key === 'K') {
                if (!e.ctrlKey && !e.metaKey) {
                    toggleKeyboardShortcuts();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showKeyboardShortcuts, toggleKeyboardShortcuts]);

    if (!showKeyboardShortcuts) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={toggleKeyboardShortcuts}
            />

            {/* Panel */}
            <div className="relative w-full max-w-2xl mx-4 bg-black/80 backdrop-blur-xl 
                      border border-white/20 rounded-xl shadow-2xl overflow-hidden
                      animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h2 className="text-white text-lg font-bold tracking-wider">KEYBOARD SHORTCUTS</h2>
                        <p className="text-white/40 text-xs mt-1">Press K to toggle this panel</p>
                    </div>
                    <button
                        onClick={toggleKeyboardShortcuts}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center
                       text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                    {SHORTCUTS.map((section) => (
                        <div
                            key={section.category}
                            className="bg-white/5 rounded-lg p-3 border border-white/10"
                        >
                            <h3
                                className="text-xs font-bold tracking-widest mb-3 flex items-center gap-2"
                                style={{ color: section.color }}
                            >
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: section.color }}
                                />
                                {section.category}
                            </h3>
                            <div className="space-y-2">
                                {section.items.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex gap-1">
                                            {item.keys.map((key, j) => (
                                                <span key={j}>
                                                    <kbd
                                                        className="px-2 py-0.5 text-[11px] bg-white/10 rounded 
                                       border border-white/20 text-white/80 font-mono"
                                                    >
                                                        {key}
                                                    </kbd>
                                                    {j < item.keys.length - 1 && (
                                                        <span className="text-white/30 mx-1 text-[10px]">/</span>
                                                    )}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-white/50 text-xs">{item.description}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-white/10 flex items-center justify-center">
                    <span className="text-white/30 text-[10px]">
                        Press <kbd className="px-1 bg-white/10 rounded text-white/60">?</kbd> anytime for help
                    </span>
                </div>
            </div>
        </div>
    );
}

/**
 * Quick toggle button for keyboard shortcuts
 */
export function KeyboardShortcutsButton() {
    const toggleKeyboardShortcuts = useSceneStore((state) => state.toggleKeyboardShortcuts);

    return (
        <button
            onClick={toggleKeyboardShortcuts}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 
                 flex items-center justify-center hover:bg-white/10 transition-all
                 shadow-lg hover:shadow-yellow-500/20"
            title="Keyboard Shortcuts (K)"
        >
            <span className="text-lg">⌨️</span>
        </button>
    );
}
