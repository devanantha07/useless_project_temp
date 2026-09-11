import { Lock, Play, CheckCircle, Star, ChevronRight } from 'lucide-react';
import type { LevelDefinition, PlayerProfile, ScreenName } from '@/game/types';
import { LEVELS } from '@/game/gameData';
import { playClick } from '@/game/sound';

interface LevelSelectProps {
  profile: PlayerProfile;
  onPlay: (level: LevelDefinition) => void;
  onNavigate: (screen: ScreenName) => void;
}

const difficultyColors: Record<string, string> = {
  Easy: 'text-green-400 border-green-500/30 bg-green-500/10',
  Medium: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  Hard: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
  Extreme: 'text-red-400 border-red-500/30 bg-red-500/10',
  Insane: 'text-red-500 border-red-500/40 bg-red-500/15',
};

export default function LevelSelect({ profile, onPlay, onNavigate }: LevelSelectProps) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
          Select Your <span className="text-green-400 text-glow-green">Drama Level</span>
        </h1>
        <p className="text-gray-400">8 levels of increasingly unnecessary facial expressions.</p>
      </div>

      {/* Player profile card */}
      <div className="glass-card p-6 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center">
            <span className="text-green-400 font-bold text-xl">
              {profile.nickname.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
          <div>
            <div className="text-white font-bold text-lg">{profile.nickname || profile.name}</div>
            <div className="text-xs text-gray-500">Drama Score: {profile.dramaScore.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{profile.highestLevel}</div>
            <div className="text-xs text-gray-500 uppercase">Highest Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{profile.bestExpression}%</div>
            <div className="text-xs text-gray-500 uppercase">Best Expression</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{profile.dramaScore.toLocaleString()}</div>
            <div className="text-xs text-gray-500 uppercase">Total Points</div>
          </div>
        </div>
      </div>

      {/* Level grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {LEVELS.map((level, i) => {
          const isUnlocked = profile.unlockedLevels.includes(level.id);
          const bestScore = profile.stats.bestScores[level.id] ?? 0;
          const isCompleted = bestScore >= level.requiredScore;

          return (
            <div
              key={level.id}
              className={`level-card glass-card p-6 relative overflow-hidden ${
                isUnlocked ? '' : 'locked'
              } ${isCompleted ? 'neon-border-gold' : isUnlocked ? 'neon-border' : ''}`}
              onClick={() => {
                if (isUnlocked) {
                  playClick();
                  onPlay(level);
                }
              }}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Level number */}
              <div className="absolute top-0 right-0 text-6xl font-extrabold text-white/5 leading-none p-3">
                {String(level.id).padStart(2, '0')}
              </div>

              {/* Status icon */}
              <div className="flex items-center gap-2 mb-3 relative">
                {isCompleted ? (
                  <CheckCircle size={18} className="text-yellow-400" />
                ) : isUnlocked ? (
                  <Play size={18} className="text-green-400" />
                ) : (
                  <Lock size={18} className="text-gray-600" />
                )}
                <span className="text-xs font-mono text-gray-500 uppercase">
                  Level {String(level.id).padStart(2, '0')}
                </span>
              </div>

              {/* Name */}
              <h3 className={`font-bold text-lg mb-2 ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>
                {level.name}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-500 mb-4 leading-relaxed min-h-[3rem]">
                {level.description}
              </p>

              {/* Difficulty + Required */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] px-2 py-1 rounded border ${difficultyColors[level.difficulty]}`}>
                  {level.difficulty}
                </span>
                <span className="text-xs text-gray-400">
                  Need: <span className="text-green-400 font-mono">{level.requiredScore}%</span>
                </span>
              </div>

              {/* Best score */}
              {bestScore > 0 && (
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <Star size={12} className="text-yellow-400" />
                  <span className="text-gray-500">Best:</span>
                  <span className="text-yellow-400 font-mono">{bestScore}%</span>
                </div>
              )}

              {/* Points */}
              <div className="mt-3 text-xs text-gray-600">
                +{level.points} points
              </div>
            </div>
          );
        })}
      </div>

      {/* Final level CTA */}
      {profile.stats.allLevelsComplete && (
        <div className="mt-8 text-center">
          <button onClick={() => onNavigate('finalresult')} className="btn-gold flex items-center gap-2 mx-auto">
            View Final Result <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
