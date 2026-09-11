import { Trophy, Crown } from 'lucide-react';
import type { LeaderboardEntry } from '@/game/types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export default function Leaderboard({ entries }: LeaderboardProps) {
  const sorted = [...entries].sort((a, b) => b.score - a.score);
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const medalColors = ['text-yellow-400', 'text-gray-300', 'text-orange-400'];
  const medalLabels = ['1st', '2nd', '3rd'];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <Trophy size={40} className="text-yellow-400" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Drama <span className="text-yellow-400 text-glow-gold">Leaderboard</span>
          </h1>
        </div>
        <div className="inline-block glass-card-gold px-4 py-2">
          <p className="text-xs font-mono text-yellow-400 tracking-wider">LOCAL HALL OF FAME</p>
        </div>
      </div>

      {/* Top 3 */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {top3.map((entry, i) => (
          <div
            key={`${entry.name}-${i}`}
            className={`glass-card p-6 text-center animate-fade-in-up ${i === 0 ? 'neon-border-gold' : ''}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={`text-3xl font-extrabold mb-2 ${medalColors[i]}`}>
              {i === 0 && <Crown size={28} className="mx-auto mb-2 text-yellow-400" />}
              {medalLabels[i]}
            </div>
            <div className={`font-bold text-lg ${entry.isPlayer ? 'text-green-400' : 'text-white'}`}>
              {entry.name}
              {entry.isPlayer && <span className="text-xs ml-2 text-green-400/70">(YOU)</span>}
            </div>
            <div className="text-2xl font-mono font-bold text-yellow-400 mt-2">
              {entry.score.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Rest of leaderboard */}
      <div className="glass-card divide-y divide-white/5">
        {rest.length === 0 && (
          <div className="p-8 text-center text-gray-500">No other entries yet.</div>
        )}
        {rest.map((entry, i) => (
          <div
            key={`${entry.name}-${i}`}
            className="flex items-center justify-between p-4 hover:bg-white/5 transition-all animate-fade-in"
            style={{ animationDelay: `${(i + 3) * 0.05}s` }}
          >
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-mono text-sm w-8">{i + 4}</span>
              <span className={`font-medium ${entry.isPlayer ? 'text-green-400' : 'text-white'}`}>
                {entry.name}
                {entry.isPlayer && <span className="text-xs ml-2 text-green-400/70">(YOU)</span>}
              </span>
            </div>
            <span className="font-mono font-bold text-yellow-400">{entry.score.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-600 text-xs mt-6">
        Scores are stored locally in your browser. No backend required for this useless feature.
      </p>
    </div>
  );
}
