import { Play, HelpCircle, Trophy, Info, Award, BarChart3, Volume2, VolumeX, Home } from 'lucide-react';
import type { ScreenName } from '@/game/types';

interface HeaderProps {
  current: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const navItems: { screen: ScreenName; label: string; icon: typeof Home }[] = [
  { screen: 'home', label: 'Home', icon: Home },
  { screen: 'levelselect', label: 'Play', icon: Play },
  { screen: 'howitworks', label: 'How It Works', icon: HelpCircle },
  { screen: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { screen: 'achievements', label: 'Awards', icon: Award },
  { screen: 'analytics', label: 'Analytics', icon: BarChart3 },
  { screen: 'about', label: 'About', icon: Info },
];

export default function Header({ current, onNavigate, soundEnabled, onToggleSound }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-green-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg neon-border flex items-center justify-center bg-black/40">
                <span className="text-green-400 font-mono font-bold text-lg">B</span>
              </div>
              <div className="absolute -inset-1 rounded-lg bg-green-500/20 blur-md -z-10 group-hover:bg-green-500/30 transition-all" />
            </div>
            <div className="text-left">
              <div className="font-extrabold text-lg tracking-wider text-white leading-none">
                BHAASI<span className="text-green-400 text-xs align-top">TM</span>
              </div>
              <div className="text-[9px] text-green-400/60 tracking-[0.15em] uppercase mt-0.5 hidden sm:block">
                AI Expression Authentication System
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(({ screen, label, icon: Icon }) => (
              <button
                key={screen}
                onClick={() => onNavigate(screen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  current === screen
                    ? 'text-green-400 bg-green-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>

          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-green-400 hover:bg-green-500/5 transition-all"
            title={soundEnabled ? 'Sound ON' : 'Sound OFF'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span className="hidden sm:inline">{soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Mobile Nav */}
        <nav className="lg:hidden flex items-center gap-1 overflow-x-auto pb-2 -mx-1 px-1">
          {navItems.map(({ screen, label, icon: Icon }) => (
            <button
              key={screen}
              onClick={() => onNavigate(screen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                current === screen
                  ? 'text-green-400 bg-green-500/10'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
