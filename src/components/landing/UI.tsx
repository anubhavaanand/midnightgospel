import { useNavigate } from 'react-router-dom';
import { EPISODES, UNIVERSES, THEMES, CHARACTERS } from './constants';
import { UniverseType, UniverseConfig } from './types';

interface UIProps {
    currentUniverse: UniverseType;
    setUniverse: (type: UniverseType) => void;
    isPlaying: boolean;
    toggleAudio: () => void;
}

export const Navigation: React.FC<UIProps> = ({ currentUniverse, setUniverse, isPlaying, toggleAudio }) => {
    const config = UNIVERSES[currentUniverse];

    return (
        <nav className="fixed top-0 left-0 w-full z-50 p-4 md:p-10 flex flex-row justify-between items-center gap-4 bg-black/20 backdrop-blur-md lg:bg-transparent">
            <div className="flex items-center gap-3 md:gap-6">
                <div className="relative group shrink-0">
                    <div className="absolute inset-0 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: config.primaryColor }} />
                    <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center bg-black overflow-hidden">
                        <div className="w-4 h-4 rounded-full animate-bounce" style={{ backgroundColor: config.accentColor }} />
                    </div>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-lg md:text-2xl font-black tracking-tighter uppercase leading-none">Midnight Gospel</h1>
                    <span className="text-[7px] md:text-[9px] uppercase tracking-[0.3em] md:tracking-[0.5em] opacity-50 font-bold">5D Simulator v4.2</span>
                </div>
            </div>

            <div className="flex gap-2 md:gap-4 items-center">
                <button
                    onClick={toggleAudio}
                    className={`glass px-4 py-2 md:px-6 md:py-3 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 active:scale-95 flex items-center gap-2 ${isPlaying ? 'bg-white text-black' : 'hover:bg-white/10 text-white'
                        }`}
                >
                    <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-white'}`} />
                    {isPlaying ? 'SIG_ACTIVE' : 'START_TRANS'}
                </button>

                <div className="hidden lg:flex gap-1 glass p-1.5 rounded-full border border-white/10">
                    {Object.entries(UNIVERSES).map(([key, u]) => (
                        <button
                            key={key}
                            onClick={() => setUniverse(key as UniverseType)}
                            className={`px-5 py-2 rounded-full text-[9px] uppercase font-black tracking-wider transition-all duration-500 ${currentUniverse === key ? 'bg-white text-black shadow-lg shadow-white/20' : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {u.name}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export const Hero: React.FC<{ config: UniverseConfig }> = ({ config }) => {
    const navigate = useNavigate();

    const handleEnterSimulation = () => {
        navigate('/simulator');
    };

    return (
        <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-20">
            {/* Animated background glow */}
            <div
                className="absolute inset-0 opacity-20 blur-3xl"
                style={{
                    background: `radial-gradient(ellipse at center, ${config.primaryColor}40 0%, transparent 70%)`
                }}
            />

            <div className="max-w-5xl z-10 space-y-6 md:space-y-8">
                <div className="relative inline-block">
                    {/* Glowing text effect */}
                    <h2
                        className="text-7xl md:text-[14vw] font-black mb-0 tracking-tighter leading-[0.8] select-none italic"
                        style={{
                            background: `linear-gradient(135deg, ${config.primaryColor}, ${config.accentColor}, white)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: `0 0 80px ${config.primaryColor}50`
                        }}
                    >
                        CLANCY
                    </h2>
                    <div
                        className="absolute -top-4 -right-2 md:-right-4 text-black text-[8px] md:text-[10px] px-3 py-1.5 font-bold uppercase tracking-widest rotate-12 rounded-lg shadow-lg"
                        style={{
                            background: `linear-gradient(135deg, ${config.accentColor}, white)`,
                            boxShadow: `0 0 20px ${config.accentColor}50`
                        }}
                    >
                        Multiverse ID: 001
                    </div>
                </div>

                <p className="text-base md:text-3xl text-white/70 max-w-3xl mx-auto font-medium leading-relaxed px-4">
                    Navigating the <span className="font-bold" style={{ color: config.primaryColor }}>Chromatic Ribbon</span> to interview simulated beings across <span className="italic" style={{ color: config.accentColor }}>dying worlds</span>.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center pt-4 md:pt-8">
                    <button
                        onClick={handleEnterSimulation}
                        className="relative group px-8 py-4 md:px-12 md:py-5 rounded-full overflow-hidden font-black uppercase tracking-widest transition-all duration-500 hover:scale-105 active:scale-95 text-xs md:text-base"
                        style={{
                            background: `linear-gradient(135deg, ${config.primaryColor}, ${config.accentColor})`,
                            color: 'black',
                            boxShadow: `0 0 40px ${config.primaryColor}60`
                        }}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
                            ENTER_SIMULATION
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                    </button>
                    <button
                        className="glass px-8 py-4 md:px-10 md:py-5 rounded-full font-black uppercase tracking-widest transition-all duration-300 hover:bg-white/10 border text-xs md:text-base"
                        style={{ borderColor: `${config.primaryColor}40` }}
                    >
                        <span className="opacity-70">VIEW_LOGS</span>
                    </button>
                </div>
            </div>

            <div className="absolute bottom-10 md:bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                <div
                    className="w-[2px] h-12 md:h-24 animate-pulse rounded-full"
                    style={{ background: `linear-gradient(to bottom, ${config.primaryColor}, transparent)` }}
                />
                <span className="text-[7px] md:text-[8px] uppercase tracking-[0.5em] md:tracking-[0.8em] font-bold opacity-40">DESCENT_INITIATED</span>
            </div>
        </section>
    );
};

export const EpisodeSection: React.FC<UIProps> = ({ currentUniverse, setUniverse }) => {
    return (
        <section className="relative px-6 max-w-7xl mx-auto z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-6 md:gap-8">
                <div className="max-w-2xl">
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[1em] block mb-2 md:mb-4" style={{ color: UNIVERSES[currentUniverse].accentColor }}>AVAILABLE_REALITIES</span>
                    <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">SIMULATIONS</h3>
                </div>
                <p className="text-white/40 max-w-xs text-[10px] md:text-xs font-mono">
                    Each data-node represents a distinct consciousness harvested during the transition.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {EPISODES.map((ep) => (
                    <div
                        key={ep.id}
                        onClick={() => setUniverse(ep.universe)}
                        className={`group relative glass p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] cursor-pointer transition-all duration-700 hover:-translate-y-2 md:hover:-translate-y-4 border-2 ${currentUniverse === ep.universe ? 'border-white scale-105 shadow-2xl' : 'border-transparent hover:border-white/20'
                            }`}
                    >
                        <div className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-bold opacity-30 group-hover:opacity-100 transition-opacity">
                            {ep.id}
                        </div>

                        <span className="text-[8px] md:text-[9px] font-black opacity-30 mb-4 md:mb-8 block tracking-widest uppercase">Freq: {UNIVERSES[ep.universe].shaderSpeed}Ghz</span>

                        <h4 className="text-2xl md:text-3xl font-black mb-1 md:mb-2 leading-none group-hover:tracking-tighter transition-all">{ep.title}</h4>
                        <span className="text-xs md:text-sm font-bold block mb-4 md:mb-6 italic" style={{ color: UNIVERSES[ep.universe].accentColor }}>
                            {ep.guest}
                        </span>

                        <p className="text-[10px] md:text-xs text-white/50 mb-6 md:mb-8 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">{ep.description}</p>

                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[8px] md:text-[9px] font-black tracking-widest uppercase">
                                {ep.topic}
                            </div>
                        </div>

                        {currentUniverse === ep.universe && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full animate-ping" style={{ backgroundColor: UNIVERSES[ep.universe].primaryColor }} />
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

const CharacterAvatar: React.FC<{ character: typeof CHARACTERS[0] }> = ({ character }) => {
    return (
        <div className="relative w-36 h-36 md:w-48 md:h-48 mb-6 md:mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
            {/* Glow effect */}
            <div
                className="absolute inset-0 rounded-full blur-2xl opacity-20 group-hover:opacity-50 transition-opacity duration-700"
                style={{ backgroundColor: character.color }}
            />

            {/* Character image container */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-white/20 bg-black/60 backdrop-blur-sm overflow-hidden flex items-center justify-center group-hover:border-white/50 transition-all duration-700 shadow-2xl">
                {character.image ? (
                    <img
                        src={character.image}
                        alt={character.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                            // Fallback to colored circle if image fails
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                ) : (
                    <div
                        className="w-20 h-20 rounded-full opacity-50"
                        style={{ backgroundColor: character.color }}
                    />
                )}
            </div>

            {/* Rotating rings */}
            <div className="absolute inset-0 border-2 border-dashed border-white/5 rounded-full animate-[spin_20s_linear_infinite] group-hover:scale-110 transition-transform" />
            <div className="absolute inset-2 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse] group-hover:scale-105 transition-transform" />

            {/* Color indicator dot */}
            <div
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full shadow-lg group-hover:animate-bounce"
                style={{ backgroundColor: character.color, boxShadow: `0 0 20px ${character.color}` }}
            />
        </div>
    );
};


export const CharactersSection: React.FC<{ config: UniverseConfig }> = ({ config: _config }) => {
    return (
        <section className="relative px-6 max-w-7xl mx-auto z-10 py-16 md:py-32">
            <div className="text-center mb-16 md:mb-24">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[1em] md:tracking-[1.5em] opacity-30 mb-2 md:mb-4 block">Simulation_Cast</span>
                <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">KEY_ACTORS</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
                {CHARACTERS.map((char, i) => (
                    <div key={i} className="group flex flex-col items-center text-center cursor-pointer md:cursor-default">
                        <CharacterAvatar character={char} />

                        <div className="space-y-2 relative w-full flex flex-col items-center transition-transform duration-700 group-hover:scale-105">
                            <h4 className="text-xl md:text-2xl font-black uppercase tracking-tighter transition-all duration-500 group-hover:text-white group-hover:scale-110" style={{ color: char.color }}>{char.name}</h4>
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/40 block opacity-60 group-hover:opacity-100 transition-opacity duration-500">{char.role}</span>

                            <div className="relative overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] max-h-0 group-hover:max-h-[200px] group-active:max-h-[200px]">
                                <div className="p-2 transition-all duration-700 scale-90 group-hover:scale-100">
                                    <p className="text-[10px] md:text-xs text-white/70 mt-3 md:mt-4 leading-relaxed max-w-[180px] md:max-w-[200px] opacity-0 group-hover:opacity-100 group-active:opacity-100 translate-y-4 group-hover:translate-y-0 group-active:translate-y-0 transition-all duration-700 italic">
                                        "{char.description}"
                                    </p>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="pt-3 md:pt-4 flex flex-col items-center transition-all duration-700 delay-100 transform group-hover:translate-y-1 scale-95 group-hover:scale-100">
                                <span className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Voice:</span>
                                <span className="text-[9px] md:text-[10px] font-bold text-white/60 group-hover:text-white/100 transition-colors duration-500">{char.voice}</span>
                            </div>

                            <div className="md:hidden mt-4 opacity-20 group-hover:opacity-0 transition-all duration-500">
                                <span className="text-[8px] font-bold uppercase tracking-tighter animate-pulse">Tap to investigate</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export const AboutSection: React.FC<{ config: UniverseConfig }> = ({ config }) => {
    return (
        <section className="relative px-4 md:px-6 z-10 py-16 md:py-24">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-24 items-center glass p-8 md:p-32 rounded-[2.5rem] md:rounded-[5rem] border border-white/5">
                <div className="space-y-8 md:space-y-12">
                    <div className="space-y-3 md:space-y-4">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[1em] opacity-30">THE_CONCEPT</span>
                        <h3 className="text-5xl md:text-8xl font-black mb-4 md:mb-8 leading-[0.9] tracking-tighter">SPACE CASTERS</h3>
                    </div>

                    <div className="space-y-6 md:space-y-8 text-base md:text-xl text-white/60 font-light leading-relaxed">
                        <p>
                            The Midnight Gospel is a surrealist exploration of the human condition, set within a malfunctioning multiverse simulator.
                        </p>
                        <p className="border-l-4 pl-6 md:pl-8 py-2" style={{ borderColor: config.primaryColor }}>
                            Clancy Gilroy doesn't just travel; he transmutes. Every interview is a collision of high-concept philosophy and psychedelic chaos.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {THEMES.map((theme, i) => (
                        <div key={i} className="group p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 transition-all hover:scale-105">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl mb-4 md:mb-6 flex items-center justify-center bg-black/50 text-[10px] md:text-xs font-black" style={{ color: config.accentColor }}>
                                0{i + 1}
                            </div>
                            <h5 className="font-black mb-2 md:mb-3 uppercase text-xs md:text-sm tracking-widest">{theme.title}</h5>
                            <p className="text-[10px] md:text-xs text-white/40 leading-relaxed font-mono">{theme.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
