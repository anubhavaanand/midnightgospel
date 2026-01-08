/**
 * U5: Quote Collection/Journal
 * Save favorite philosophical quotes from floating quotes to a personal collection.
 * Persisted to localStorage for returning visitors.
 */
import { useSceneStore, SavedQuote } from '@store/sceneStore';
import { LEVEL_RANGES } from '@utils/constants';

// Level colors for quote cards
const LEVEL_COLORS = [
    '#00ffff', '#ff3333', '#ffcc00', '#00aaff',
    '#ff9900', '#9900ff', '#ffffff'
];

export default function QuoteJournal() {
    const showQuoteJournal = useSceneStore((state) => state.showQuoteJournal);
    const toggleQuoteJournal = useSceneStore((state) => state.toggleQuoteJournal);
    const savedQuotes = useSceneStore((state) => state.savedQuotes);
    const removeQuote = useSceneStore((state) => state.removeQuote);
    const clearAllQuotes = useSceneStore((state) => state.clearAllQuotes);

    if (!showQuoteJournal) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={toggleQuoteJournal}
            />

            {/* Panel */}
            <div className="relative w-full max-w-xl mx-4 max-h-[80vh] bg-black/80 backdrop-blur-xl 
                      border border-white/20 rounded-xl shadow-2xl overflow-hidden
                      animate-in zoom-in-95 duration-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-white text-lg font-bold tracking-wider flex items-center gap-2">
                            <span>📜</span> QUOTE JOURNAL
                        </h2>
                        <p className="text-white/40 text-xs mt-1">
                            {savedQuotes.length} saved quote{savedQuotes.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {savedQuotes.length > 0 && (
                            <button
                                onClick={() => {
                                    if (confirm('Clear all saved quotes?')) {
                                        clearAllQuotes();
                                    }
                                }}
                                className="px-2 py-1 text-[10px] text-red-400/60 hover:text-red-400 
                           hover:bg-red-500/10 rounded transition-colors"
                            >
                                Clear All
                            </button>
                        )}
                        <button
                            onClick={toggleQuoteJournal}
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center
                         text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {savedQuotes.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4 opacity-30">📝</div>
                            <p className="text-white/40 text-sm">No quotes saved yet</p>
                            <p className="text-white/20 text-xs mt-2">
                                Click the ❤️ on floating quotes to save them
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {savedQuotes.slice().reverse().map((quote) => (
                                <QuoteCard
                                    key={quote.savedAt}
                                    quote={quote}
                                    onRemove={() => removeQuote(quote.savedAt)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {savedQuotes.length > 0 && (
                    <div className="p-3 border-t border-white/10 flex items-center justify-center flex-shrink-0">
                        <button
                            onClick={() => {
                                const text = savedQuotes
                                    .map(q => `"${q.text}" — ${q.author}`)
                                    .join('\n\n');
                                navigator.clipboard.writeText(text);
                                alert('All quotes copied to clipboard!');
                            }}
                            className="text-cyan-400 text-xs hover:underline"
                        >
                            Copy all to clipboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function QuoteCard({ quote, onRemove }: { quote: SavedQuote; onRemove: () => void }) {
    const levelName = LEVEL_RANGES[quote.level]?.name || 'Unknown';
    const color = LEVEL_COLORS[quote.level] || '#ffffff';
    const date = new Date(quote.savedAt);

    return (
        <div
            className="relative p-4 bg-white/5 rounded-lg border border-white/10
                 hover:border-white/20 transition-colors group"
            style={{ borderLeftColor: color, borderLeftWidth: 3 }}
        >
            {/* Quote Text */}
            <p className="text-white/80 text-sm italic mb-2 pr-8">
                "{quote.text}"
            </p>

            {/* Author */}
            <p className="text-white/50 text-xs">
                — {quote.author}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-2 mt-2 text-[10px]">
                <span
                    className="px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: color + '20', color }}
                >
                    {levelName}
                </span>
                <span className="text-white/30">
                    {date.toLocaleDateString()}
                </span>
            </div>

            {/* Remove Button */}
            <button
                onClick={onRemove}
                className="absolute top-2 right-2 w-6 h-6 rounded-full 
                   flex items-center justify-center text-white/30
                   hover:text-red-400 hover:bg-red-500/10 
                   opacity-0 group-hover:opacity-100 transition-all"
                title="Remove quote"
            >
                ✕
            </button>

            {/* Share Button */}
            <button
                onClick={() => {
                    const text = `"${quote.text}" — ${quote.author} (The Midnight Gospel)`;
                    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                    window.open(url, '_blank');
                }}
                className="absolute bottom-2 right-2 w-6 h-6 rounded-full 
                   flex items-center justify-center text-white/30
                   hover:text-cyan-400 hover:bg-cyan-500/10 
                   opacity-0 group-hover:opacity-100 transition-all"
                title="Share quote"
            >
                🐦
            </button>
        </div>
    );
}

/**
 * Toggle button for quote journal
 */
export function QuoteJournalButton() {
    const toggleQuoteJournal = useSceneStore((state) => state.toggleQuoteJournal);
    const savedQuotes = useSceneStore((state) => state.savedQuotes);

    return (
        <button
            onClick={toggleQuoteJournal}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 
                 flex items-center justify-center hover:bg-white/10 transition-all
                 shadow-lg hover:shadow-purple-500/20 relative"
            title="Quote Journal (J)"
        >
            <span className="text-lg">📜</span>
            {savedQuotes.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full 
                         text-[9px] text-white flex items-center justify-center font-bold">
                    {savedQuotes.length > 9 ? '9+' : savedQuotes.length}
                </span>
            )}
        </button>
    );
}
