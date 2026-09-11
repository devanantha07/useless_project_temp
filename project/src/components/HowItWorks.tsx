import { Camera, Scan, Eye, Brain, CheckCircle } from 'lucide-react';

const steps = [
  { icon: Camera, title: 'CAMERA', desc: 'Your webcam captures your face.' },
  { icon: Scan, title: 'FACE LANDMARKS', desc: 'The AI identifies important points around your eyes, eyebrows and mouth.' },
  { icon: Eye, title: 'EXPRESSION ANALYSIS', desc: 'The system measures your facial features — eye openness, eyebrow height, mouth shape and more.' },
  { icon: Brain, title: 'DRAMA SCORE', desc: 'Your expression is compared with the target expression profile.' },
  { icon: CheckCircle, title: 'LEVEL RESULT', desc: 'Pass the required score and unlock the next challenge.' },
];

export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-white">
        How It <span className="text-green-400 text-glow-green">Works</span>
      </h1>
      <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
        Five simple steps between you and completely unnecessary facial recognition technology.
      </p>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="glass-card p-6 flex items-start gap-5 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                <step.icon size={24} className="text-green-400" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-green-400/50 font-mono text-sm">STEP {i + 1}</span>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
              </div>
              <p className="text-gray-400">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 glass-card-gold p-8 text-center">
        <p className="text-lg text-yellow-400 font-medium italic">
          "Basically, we built advanced technology to decide whether you look sufficiently confused."
        </p>
      </div>
    </div>
  );
}
