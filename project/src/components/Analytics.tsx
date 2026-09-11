import type { PlayerStats } from '@/game/types';
import { LEVELS } from '@/game/gameData';

interface AnalyticsProps {
  stats: PlayerStats;
}

export default function Analytics({ stats }: AnalyticsProps) {
  const avgDrama =
    stats.totalExpressions > 0
      ? Math.round(stats.highestScore / stats.totalExpressions * 10) / 10
      : 0;

  // Most used expression
  const expressionEntries = Object.entries(stats.expressionCounts);
  const mostUsedExpression =
    expressionEntries.length > 0
      ? expressionEntries.sort((a, b) => b[1] - a[1])[0][0]
      : 'None yet';

  // Most failed level
  const failEntries = Object.entries(stats.failCounts);
  const mostFailedLevel =
    failEntries.length > 0
      ? LEVELS.find((l) => String(l.id) === failEntries.sort((a, b) => b[1] - a[1])[0][0])?.name ?? 'None'
      : 'None yet';

  const totalMinutes = Math.floor(stats.totalTimeMs / 60000);
  const emotionalDamage = Math.min(100, Math.round(stats.totalFails * 8 + stats.consecutiveFails * 5));
  const cinematicPotential = Math.min(100, Math.round(stats.highestScore * 0.8 + stats.levelsCompleted * 2.5));

  const statCards = [
    { label: 'Total Expressions Detected', value: stats.totalExpressions.toString(), color: 'text-green-400' },
    { label: 'Average Drama', value: `${avgDrama}%`, color: 'text-yellow-400' },
    { label: 'Most Used Expression', value: mostUsedExpression, color: 'text-blue-400' },
    { label: 'Most Failed Level', value: mostFailedLevel, color: 'text-red-400' },
    { label: 'Total Time Wasted', value: `${totalMinutes} minutes`, color: 'text-purple-400' },
    { label: 'Emotional Damage', value: `${emotionalDamage}%`, color: 'text-red-400' },
    { label: 'Cinematic Potential', value: `${cinematicPotential}%`, color: 'text-yellow-400' },
    { label: 'Levels Completed', value: `${stats.levelsCompleted} / 8`, color: 'text-green-400' },
  ];

  // Simple CSS bar chart for expression distribution
  const maxExprCount = Math.max(...Object.values(stats.expressionCounts), 1);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
          AI <span className="text-green-400 text-glow-green">Analytics</span>
        </h1>
        <p className="text-gray-400">A completely unnecessary dashboard for your completely unnecessary game.</p>
      </div>

      {/* Stat grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {statCards.map((stat, i) => (
          <div
            key={stat.label}
            className="glass-card p-6 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className={`text-3xl font-mono font-bold ${stat.color} mb-2`}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Expression distribution chart */}
      <div className="glass-card p-8 mb-8">
        <h2 className="text-lg font-bold text-white mb-6">Expression Attempt Distribution</h2>
        {expressionEntries.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No data yet. Go make some expressions.</p>
        ) : (
          <div className="space-y-3">
            {expressionEntries
              .sort((a, b) => b[1] - a[1])
              .map(([name, count]) => (
                <div key={name} className="flex items-center gap-4">
                  <div className="w-40 text-sm text-gray-400 truncate">{name}</div>
                  <div className="flex-1 progress-bar-bg">
                    <div
                      className="progress-bar-fill bg-gradient-to-r from-green-600 to-green-400"
                      style={{ width: `${(count / maxExprCount) * 100}%` }}
                    />
                  </div>
                  <div className="w-12 text-right font-mono text-sm text-green-400">{count}</div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Best scores per level */}
      <div className="glass-card p-8">
        <h2 className="text-lg font-bold text-white mb-6">Best Scores Per Level</h2>
        <div className="space-y-3">
          {LEVELS.map((level) => {
            const best = stats.bestScores[level.id] ?? 0;
            return (
              <div key={level.id} className="flex items-center gap-4">
                <div className="w-32 text-sm text-gray-400 truncate">L{level.id} — {level.name}</div>
                <div className="flex-1 progress-bar-bg">
                  <div
                    className={`progress-bar-fill ${
                      best >= level.requiredScore
                        ? 'bg-gradient-to-r from-green-600 to-green-400'
                        : best > 0
                          ? 'bg-gradient-to-r from-yellow-600 to-yellow-400'
                          : 'bg-gray-700'
                    }`}
                    style={{ width: `${best}%` }}
                  />
                </div>
                <div className="w-12 text-right font-mono text-sm text-gray-400">
                  {best > 0 ? `${best}%` : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
