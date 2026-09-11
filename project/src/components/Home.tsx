import { Play, HelpCircle, AlertTriangle, Sparkles, Zap } from 'lucide-react';
import type { ScreenName, PlayerProfile } from '@/game/types';

interface HomeProps {
  onNavigate: (screen: ScreenName) => void;
  profile: PlayerProfile | null;
}

export default function Home({ onNavigate, profile }: HomeProps) {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center grid-bg overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 text-center py-20 z-10">
          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in-up">
            <span className="glass-card px-4 py-2 text-xs font-mono text-green-400 border border-green-500/30">
              100% Useless
            </span>
            <span className="glass-card px-4 py-2 text-xs font-mono text-red-400 border border-red-500/30">
              0% Practical
            </span>
            <span className="glass-card px-4 py-2 text-xs font-mono text-yellow-400 border border-yellow-500/30">
              100% Technically Impressive
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-white">CAN YOUR FACE</span>
            <br />
            <span className="text-green-400 text-glow-green">PASS THE TEST?</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Your mission is simple: Make the correct expression.
            <br />
            <span className="text-gray-300">The AI will decide whether you are dramatic enough.</span>
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => onNavigate(profile ? 'levelselect' : 'levelselect')}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Play size={20} fill="currentColor" />
              Start the Expression Test
            </button>
            <button
              onClick={() => onNavigate('howitworks')}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <HelpCircle size={20} />
              How Does This Work?
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-sm text-gray-600 italic animate-fade-in-up flex items-center justify-center gap-2" style={{ animationDelay: '0.4s' }}>
            <AlertTriangle size={14} className="text-yellow-500/60" />
            Warning: This system has absolutely no practical purpose.
          </p>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <Zap size={20} className="text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">THE PROBLEM</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Modern technology has solved communication, transportation, healthcare and finance.
            </p>
          </div>

          <div className="glass-card-gold p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                <Sparkles size={20} className="text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">THE SOLUTION</h2>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              We decided to solve the real problem nobody asked us to solve:
            </p>
            <p className="text-green-400 font-semibold leading-relaxed">
              Can AI determine whether your facial expression is dramatic enough?
            </p>
          </div>
        </div>

        <div className="mt-6 glass-card p-6 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-gray-500 text-sm">
            <span className="text-white font-semibold">Applications:</span> None.
          </p>
        </div>
      </section>

      {/* Features preview */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          How It <span className="text-green-400">Works</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { num: '01', title: 'Camera', desc: 'Your webcam captures your face in real-time, entirely in your browser.' },
            { num: '02', title: 'Face Landmarks', desc: 'AI identifies 478 key points around your eyes, eyebrows, nose and mouth.' },
            { num: '03', title: 'Drama Score', desc: 'Your expression is scored against the target. Be dramatic enough to pass.' },
          ].map((step, i) => (
            <div
              key={step.num}
              className="glass-card p-8 animate-fade-in-up relative overflow-hidden"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="absolute top-0 right-0 text-7xl font-extrabold text-green-500/5 leading-none p-4">
                {step.num}
              </div>
              <div className="text-green-400 font-mono text-sm mb-3">STEP {step.num}</div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy notice */}
      <section className="pb-20 px-6 max-w-4xl mx-auto">
        <div className="glass-card p-6 text-center">
          <p className="text-sm text-gray-400">
            <span className="text-green-400 font-semibold">Privacy:</span> Camera processing happens locally in your browser.
            No facial images are uploaded to a server. Nothing is stored.
          </p>
        </div>
      </section>
    </div>
  );
}
