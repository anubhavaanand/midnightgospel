/**
 * U4: Mini-Map
 * Visual representation of scroll progress through all levels.
 * Shows current position and level transitions.
 */
import { useSceneStore } from '@store/sceneStore';
import { LEVEL_RANGES } from '@utils/constants';

// Level colors matching the theme
const LEVEL_COLORS = [
    '#00ffff', // Chromatic Void
    '#ff3333', // Zombie Apocalypse
    '#ffcc00', // Clown Planet
    '#00aaff', // Ass Cream
    '#ff9900', // Blinded by My End
    '#9900ff', // Soul Prison
    '#ffffff', // The Exit
];

export default function MiniMap() {
    const scrollProgress = useSceneStore((state) => state.scrollProgress);
    const activeLevel = useSceneStore((state) => state.activeLevel);
    const showMiniMap = useSceneStore((state) => state.showMiniMap);
    const toggleMiniMap = useSceneStore((state) => state.toggleMiniMap);

    if (!showMiniMap) {
        return (
            <button
                onClick={toggleMiniMap}
                className="fixed right-8 top-1/2 -translate-y-1/2 w-8 h-8 
                   bg-black/40 backdrop-blur-xl border border-white/20 rounded-full
                   flex items-center justify-center hover:bg-white/10 transition-all
                   pointer-events-auto z-50"
                title="Show Mini-Map (M)"
            >
                <span className="text-white/60 text-xs">📍</span>
            </button>
        );
    }

    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 pointer-events-auto z-50">
            {/* Track Container */}
            <div className="relative">
                {/* Hide Button */}
                <button
                    onClick={toggleMiniMap}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-white/30 
                     hover:text-white/60 text-[10px] transition-colors"
                    title="Hide Mini-Map"
                >
                    ✕
                </button>

                {/* Track Background */}
                <div className="w-3 h-64 bg-black/40 backdrop-blur-xl rounded-full 
                        border border-white/20 overflow-hidden relative">
                    {/* Level Segments */}
                    {LEVEL_RANGES.map((level, i) => {
                        const startPercent = level.scrollStart * 100;
                        const heightPercent = (level.scrollEnd - level.scrollStart) * 100;
                        const isActive = i === activeLevel;

                        return (
                            <div
                                key={level.level}
                                className="absolute left-0 right-0 transition-all duration-300"
                                style={{
                                    top: `${startPercent}%`,
                                    height: `${heightPercent}%`,
                                    backgroundColor: isActive ? LEVEL_COLORS[i] + '40' : 'transparent',
                                }}
                            >
                                {/* Level Divider */}
                                <div
                                    className="absolute top-0 left-0 right-0 h-px"
                                    style={{ backgroundColor: LEVEL_COLORS[i] + '60' }}
                                />
                            </div>
                        );
                    })}

                    {/* Progress Fill */}
                    <div
                        className="absolute left-0 right-0 top-0 transition-all duration-100"
                        style={{
                            height: `${scrollProgress * 100}%`,
                            background: `linear-gradient(180deg, ${LEVEL_COLORS[0]}20, ${LEVEL_COLORS[activeLevel]}40)`,
                        }}
                    />

                    {/* Current Position Indicator */}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 w-5 h-1.5 rounded-full 
                       transition-all duration-100 shadow-lg"
                        style={{
                            top: `calc(${scrollProgress * 100}% - 3px)`,
                            backgroundColor: LEVEL_COLORS[activeLevel],
                            boxShadow: `0 0 10px ${LEVEL_COLORS[activeLevel]}, 0 0 20px ${LEVEL_COLORS[activeLevel]}50`,
                        }}
                    />
                </div>

                {/* Level Labels */}
                <div className="absolute left-6 top-0 h-64 flex flex-col justify-between py-2">
                    {LEVEL_RANGES.map((level, i) => {
                        const isActive = i === activeLevel;
                        return (
                            <div
                                key={level.level}
                                className={`text-[8px] tracking-wider transition-all duration-300 whitespace-nowrap
                           ${isActive ? 'opacity-100 translate-x-1' : 'opacity-30'}`}
                                style={{ color: isActive ? LEVEL_COLORS[i] : '#ffffff' }}
                            >
                                {i}
                            </div>
                        );
                    })}
                </div>

                {/* Current Level Name */}
                <div
                    className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full
                     text-[10px] font-bold tracking-wider max-w-[80px] text-right
                     transition-all duration-300"
                    style={{ color: LEVEL_COLORS[activeLevel] }}
                >
                    {LEVEL_RANGES[activeLevel]?.name}
                </div>

                {/* Progress Percentage */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
                    <span
                        className="text-[10px] font-mono"
                        style={{ color: LEVEL_COLORS[activeLevel] }}
                    >
                        {(scrollProgress * 100).toFixed(0)}%
                    </span>
                </div>
            </div>
        </div>
    );
}
