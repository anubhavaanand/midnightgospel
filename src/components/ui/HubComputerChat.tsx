import React, { useState } from 'react';
import { useDialogueStore } from '../../store/useDialogueStore';

export const HubComputerChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const setActiveQuest = useDialogueStore((state) => state.setActiveQuest);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_NVIDIA_API_URL + '/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_NVIDIA_API_KEY}`
        },
        body: JSON.stringify({
          model: 'nousresearch/hermes-3-llama-3.1-405b', // Free Hermes 120B/405B equivalent endpoint
          messages: [
            { role: 'system', content: 'You are Clancys organic computer. Recommend a level (0-8) based on user mood. Output JSON only: { recommendedLevel: number, recommendedNPC: string, response: string }' },
            { role: 'user', content: input }
          ]
        })
      });

      const data = await response.json();
      const parsed = JSON.parse(data.choices[0].message.content);

      setActiveQuest({
        recommendedLevel: parsed.recommendedLevel,
        recommendedNPC: parsed.recommendedNPC,
        userContext: input
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="absolute bottom-6 left-6 p-4 rounded-xl border border-fuchsia-500/30 bg-black/80 backdrop-blur-md z-[100] max-w-sm">
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          placeholder="What's on your mind today, Clancy?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white"
          disabled={loading}
        />
      </form>
    </div>
  );
};
