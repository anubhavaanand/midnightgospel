// @ts-ignore
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function ReloadPrompt() {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r: any) {
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error: any) {
            console.log('SW registration error', error);
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    if (!offlineReady && !needRefresh) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 p-4 rounded-lg glass border border-white/10 shadow-lg animate-fade-in backdrop-blur-md bg-black/40 text-white max-w-sm">
            <div className="mb-2 text-sm font-space-grotesk">
                {offlineReady ? (
                    <div className="flex items-center gap-2">
                        <span className="text-cyan-400">✨</span>
                        <span>App ready to work offline</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="text-purple-400">🚀</span>
                        <span>New content available, click on reload button to update.</span>
                    </div>
                )}
            </div>

            {needRefresh && (
                <button
                    className="mr-2 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/50 rounded transition-colors"
                    onClick={() => updateServiceWorker(true)}
                >
                    Reload
                </button>
            )}

            <button
                className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded transition-colors"
                onClick={close}
            >
                Close
            </button>
        </div>
    );
}
