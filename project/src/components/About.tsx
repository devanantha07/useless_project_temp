export default function About() {
  const tech = ['HTML5', 'CSS3', 'TypeScript', 'React', 'MediaPipe Face Landmarker', 'Web Camera API', 'LocalStorage', 'Web Audio API'];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-8 text-white">
        Why Does This <span className="text-red-400 text-glow-red">Exist?</span>
      </h1>

      <div className="glass-card-red neon-border-red p-12 text-center mb-8">
        <p className="text-6xl font-extrabold text-red-400 mb-4">It doesn't.</p>
      </div>

      <div className="glass-card p-8 mb-8">
        <p className="text-gray-300 leading-relaxed text-lg text-center">
          This project was created as a useless technology experiment combining computer vision,
          facial landmarks, gamification and completely unnecessary levels of drama.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-8">
          <h2 className="text-sm font-mono text-green-400 mb-4 tracking-wider">TECHNOLOGY USED</h2>
          <div className="flex flex-wrap gap-2">
            {tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card-gold p-8">
          <h2 className="text-sm font-mono text-yellow-400 mb-4 tracking-wider">PURPOSE</h2>
          <p className="text-2xl font-bold text-white">Absolutely none.</p>
          <p className="text-gray-400 mt-2 text-sm">
            Unless making people laugh counts. Then: maximum purpose.
          </p>
        </div>
      </div>

      <div className="glass-card p-6 text-center">
        <p className="text-gray-500 text-sm">
          Inspired by the exaggerated expressions of Malayalam cinema comedy.
          No movie footage, audio, or copyrighted assets are used.
          This is an original, parody-style game.
        </p>
      </div>
    </div>
  );
}
