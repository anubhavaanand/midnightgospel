/**
 * Achievement System
 * Tracks player progress and displays toast notifications on unlock
 */
import { useEffect, useRef, useState } from 'react';
import { useSceneStore, ACHIEVEMENTS, Achievement } from '@store/sceneStore';
import { EASTER_EGGS } from '@components/interactive/EasterEggSystem';

// Achievement toast notification
function AchievementToast({ achievement, onComplete }: { achievement: Achievement; onComplete: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 4000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed top-20 right-4 z-[200] animate-in slide-in-from-right duration-500">
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-900/90 to-pink-900/90 
                      backdrop-blur-xl border border-yellow-500/50 rounded-xl shadow-2xl shadow-purple-500/30">
                <div className="text-3xl animate-bounce">{achievement.icon}</div>
                <div>
                    <div className="text-yellow-400 text-xs font-bold tracking-wider">ACHIEVEMENT UNLOCKED</div>
                    <div className="text-white font-bold">{achievement.name}</div>
                    <div className="text-white/60 text-xs">{achievement.description}</div>
                </div>
            </div>
        </div>
    );
}

// Achievement tracking hook - monitors progress and unlocks
export function useAchievementTracker() {
    const collectedEggs = useSceneStore((state) => state.collectedEggs);
    const savedQuotes = useSceneStore((state) => state.savedQuotes);
    const levelsVisited = useSceneStore((state) => state.levelsVisited);
    const maxScrollProgress = useSceneStore((state) => state.maxScrollProgress);
    const achievements = useSceneStore((state) => state.achievements);
    const unlockAchievement = useSceneStore((state) => state.unlockAchievement);

    const hasUnlocked = (id: string) => achievements.some((a) => a.id === id);

    useEffect(() => {
        // First egg collected
        if (collectedEggs.length >= 1 && !hasUnlocked(ACHIEVEMENTS.FIRST_EGG.id)) {
            const { id, name, description, icon } = ACHIEVEMENTS.FIRST_EGG;
            unlockAchievement(id, name, description, icon);
        }

        // All eggs collected
        if (collectedEggs.length >= EASTER_EGGS.length && !hasUnlocked(ACHIEVEMENTS.ALL_EGGS.id)) {
            const { id, name, description, icon } = ACHIEVEMENTS.ALL_EGGS;
            unlockAchievement(id, name, description, icon);
        }

        // Quote collector (10 quotes)
        if (savedQuotes.length >= 10 && !hasUnlocked(ACHIEVEMENTS.QUOTE_COLLECTOR.id)) {
            const { id, name, description, icon } = ACHIEVEMENTS.QUOTE_COLLECTOR;
            unlockAchievement(id, name, description, icon);
        }

        // All levels visited
        if (levelsVisited.length >= 6 && !hasUnlocked(ACHIEVEMENTS.ALL_LEVELS.id)) {
            const { id, name, description, icon } = ACHIEVEMENTS.ALL_LEVELS;
            unlockAchievement(id, name, description, icon);
        }

        // Deep dive (100% scroll)
        if (maxScrollProgress >= 0.99 && !hasUnlocked(ACHIEVEMENTS.DEEP_DIVE.id)) {
            const { id, name, description, icon } = ACHIEVEMENTS.DEEP_DIVE;
            unlockAchievement(id, name, description, icon);
        }
    }, [collectedEggs, savedQuotes, levelsVisited, maxScrollProgress, achievements, unlockAchievement]);
}

// Toast queue manager
export function AchievementNotifications() {
    const achievements = useSceneStore((state) => state.achievements);
    const [queue, setQueue] = useState<Achievement[]>([]);
    const [current, setCurrent] = useState<Achievement | null>(null);
    const shownRef = useRef<Set<string>>(new Set());

    // Add new achievements to queue
    useEffect(() => {
        const newAchievements = achievements.filter((a) => !shownRef.current.has(a.id));
        if (newAchievements.length > 0) {
            setQueue((prev) => [...prev, ...newAchievements]);
            newAchievements.forEach((a) => shownRef.current.add(a.id));
        }
    }, [achievements]);

    // Process queue
    useEffect(() => {
        if (!current && queue.length > 0) {
            setCurrent(queue[0]);
            setQueue((prev) => prev.slice(1));
        }
    }, [current, queue]);

    const handleComplete = () => setCurrent(null);

    return current ? <AchievementToast achievement={current} onComplete={handleComplete} /> : null;
}

// Achievement list panel
export default function AchievementSystem() {
    const showAchievements = useSceneStore((state) => state.showAchievements);
    const toggleAchievements = useSceneStore((state) => state.toggleAchievements);
    const achievements = useSceneStore((state) => state.achievements);

    const allAchievements = Object.values(ACHIEVEMENTS);
    const unlockedCount = achievements.length;
    const totalCount = allAchievements.length;

    if (!showAchievements) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={toggleAchievements} />

            {/* Panel */}
            <div className="relative w-full max-w-lg mx-4 max-h-[80vh] bg-black/80 backdrop-blur-xl 
                      border border-white/20 rounded-xl shadow-2xl overflow-hidden
                      animate-in zoom-in-95 duration-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-white text-lg font-bold tracking-wider flex items-center gap-2">
                            <span>🏆</span> ACHIEVEMENTS
                        </h2>
                        <p className="text-white/40 text-xs mt-1">
                            {unlockedCount}/{totalCount} unlocked
                        </p>
                    </div>
                    <button
                        onClick={toggleAchievements}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center
                       text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 gap-3">
                        {allAchievements.map((achievementDef) => {
                            const isUnlocked = achievements.some((a) => a.id === achievementDef.id);
                            const unlockedData = achievements.find((a) => a.id === achievementDef.id);

                            return (
                                <div
                                    key={achievementDef.id}
                                    className={`p-3 rounded-lg border transition-all ${isUnlocked
                                            ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-yellow-500/50'
                                            : 'bg-white/5 border-white/10 opacity-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`text-2xl ${isUnlocked ? '' : 'grayscale'}`}>
                                            {achievementDef.icon}
                                        </span>
                                        <div>
                                            <div className={`text-sm font-bold ${isUnlocked ? 'text-white' : 'text-white/50'}`}>
                                                {achievementDef.name}
                                            </div>
                                            <div className="text-white/40 text-xs">{achievementDef.description}</div>
                                        </div>
                                    </div>
                                    {isUnlocked && unlockedData && (
                                        <div className="text-yellow-400/60 text-[10px] mt-2">
                                            Unlocked {new Date(unlockedData.unlockedAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Toggle button for achievements
export function AchievementButton() {
    const toggleAchievements = useSceneStore((state) => state.toggleAchievements);
    const achievements = useSceneStore((state) => state.achievements);
    const totalAchievements = Object.keys(ACHIEVEMENTS).length;

    return (
        <button
            onClick={toggleAchievements}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 
                 flex items-center justify-center hover:bg-white/10 transition-all
                 shadow-lg hover:shadow-yellow-500/20 relative"
            title="Achievements (A)"
        >
            <span className="text-lg">🏆</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full 
                       text-[9px] text-black flex items-center justify-center font-bold">
                {achievements.length}/{totalAchievements}
            </span>
        </button>
    );
}
