import { useState } from 'react';
import { User, Sparkles } from 'lucide-react';
import { playClick } from '@/game/sound';

interface ProfileSetupProps {
  onComplete: (name: string, nickname: string) => void;
  initialName?: string;
  initialNickname?: string;
}

export default function ProfileSetup({ onComplete, initialName, initialNickname }: ProfileSetupProps) {
  const [name, setName] = useState(initialName ?? '');
  const [nickname, setNickname] = useState(initialNickname ?? '');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Even Bhaasi had a name. Enter yours.');
      return;
    }
    if (name.trim().length > 20) {
      setError('Keep it under 20 characters. This is not a wedding invitation.');
      return;
    }
    playClick();
    onComplete(name.trim(), nickname.trim() || name.trim());
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="glass-card neon-border p-8 max-w-md w-full animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles size={24} className="text-green-400" />
            <h2 className="text-2xl font-bold text-white">Player Registration</h2>
          </div>
          <p className="text-gray-400 text-sm">
            Before the AI judges your face, it needs to know who to insult.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-green-400 mb-2 tracking-wider uppercase">
              Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="input-field pl-12"
                placeholder="Enter your name"
                maxLength={20}
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-green-400 mb-2 tracking-wider uppercase">
              Nickname <span className="text-gray-600 text-xs">(optional)</span>
            </label>
            <div className="relative">
              <Sparkles size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="input-field pl-12"
                placeholder="Your dramatic alias"
                maxLength={20}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm animate-shake">{error}</p>
          )}

          <button onClick={handleSubmit} className="btn-primary w-full">
            Begin the Drama
          </button>
        </div>
      </div>
    </div>
  );
}
