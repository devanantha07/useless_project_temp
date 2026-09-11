import { Lock } from 'lucide-react';
import type { Achievement, PlayerStats } from '@/game/types';
import { ACHIEVEMENTS } from '@/game/gameData';

interface AchievementsProps {
  stats: PlayerStats;
  unlocked: string[];
}

export default function Achievements({ stats, unlocked }: AchievementsProps) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
          <span className="text-green-400 text-glow-green">Achievements</span>
        </h1>
        <p className="text-gray-400">
          {unlocked.length} of {ACHIEVEMENTS.length} unlocked
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ACHIEVEMENTS.map((achievement, i) => {
          const isUnlocked = unlocked.includes(achievement.id) || achievement.check(stats);
          return (
            <div
              key={achievement.id}
              className={`glass-card p-6 text-center animate-fade-in-up relative overflow-hidden ${
                isUnlocked ? 'neon-border' : 'opacity-40'
              }`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="text-4xl mb-3">{achievement.icon}</div>
              <h3 className="font-bold text-sm text-white mb-2">{achievement.name}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{achievement.description}</p>
              {!isUnlocked && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Lock size={24} className="text-gray-600" />
                </div>
              )}
              {isUnlocked && (
                <div className="absolute top-2 right-2 text-green-400 text-xs font-mono">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
