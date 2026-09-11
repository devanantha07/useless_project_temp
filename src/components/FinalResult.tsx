import { useEffect, useState } from 'react';
import { Trophy, Play, BarChart3, Award, RotateCcw } from 'lucide-react';
import type { PlayerProfile, ScreenName } from '@/game/types';
import { playClick } from '@/game/sound';

interface FinalResultProps {
  profile: PlayerProfile;
  onNavigate: (screen: ScreenName) => void;
  onReset: () => void;
}

export default function FinalResult({ profile, onNavigate, onReset }: FinalResultProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const rating = profile.bestExpression >= 95 ? 5 : profile.bestExpression >= 80 ? 4 : 3;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${-Math.random() * 100}px`,
                backgroundColor: ['#22c55e', '#facc15', '#ef4444', '#ffffff'][Math.floor(Math.random() * 4)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-2xl w-full z-20">
        <div className="glass-card-gold neon-border-gold p-8 sm:p-12 text-center animate-scale-in">
          {/* Trophy */}
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/40 flex items-center justify-center animate-pulse-glow">
              <Trophy size={40} className="text-yellow-400" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-400 text-glow-gold mb-4">
            BHAASI LEGEND
          </h1>

          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            YOU HAVE SUCCESSFULLY MASTERED THE ART OF<br />
            COMPLETELY UNNECESSARY FACIAL EXPRESSIONS.
          </p>

          {/* Final score */}
          <div className="glass-card p-6 mb-6">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Final Drama Score</div>
            <div className="text-5xl font-mono font-extrabold text-green-400 text-glow-green">
              {profile.dramaScore.toLocaleString()}
            </div>
          </div>

          {/* Cinematic rating */}
          <div className="glass-card p-6 mb-6">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Cinematic Rating</div>
            <div className="flex justify-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-3xl ${i < rating ? 'text-yellow-400' : 'text-gray-700'}`}
                  style={{
                    animation: i < rating ? `scaleIn 0.5s ease ${i * 0.15}s both` : 'none',
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* AI Verdict */}
          <div className="glass-card p-6 mb-8 border border-green-500/20">
            <div className="text-xs text-green-400 uppercase tracking-wider mb-2">AI Verdict</div>
            <p className="text-xl text-white font-medium italic">
              "THIS PERSON HAS TOO MUCH FREE TIME."
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => { playClick(); onNavigate('levelselect'); }} className="btn-primary flex items-center justify-center gap-2">
              <Play size={18} fill="currentColor" /> Play Again
            </button>
            <button onClick={() => { playClick(); onNavigate('analytics'); }} className="btn-secondary flex items-center justify-center gap-2">
              <BarChart3 size={18} /> Analytics
            </button>
            <button onClick={() => { playClick(); onNavigate('achievements'); }} className="btn-secondary flex items-center justify-center gap-2">
              <Award size={18} /> Achievements
            </button>
          </div>

          <button
            onClick={() => { playClick(); onReset(); }}
            className="mt-6 text-xs text-gray-600 hover:text-red-400 transition-colors flex items-center gap-1 mx-auto"
          >
            <RotateCcw size={12} /> Reset all progress
          </button>
        </div>
      </div>
    </div>
  );
}
