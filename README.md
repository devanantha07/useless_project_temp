# BHAASI — The Expression Challenge

> **Show the expression. Unlock the level.**

A humorous webcam-based facial-expression challenge game inspired by the exaggerated comic expressions of Malayalam cinema. The game uses real AI facial landmark detection (MediaPipe) to analyze your face and score your expression against a target.

**100% Useless · 0% Practical · 100% Technically Impressive**

## Features

- **Real facial landmark detection** using MediaPipe Face Landmarker (478 points)
- **Expression scoring** based on blendshape analysis — not random numbers
- **8 levels** of increasing difficulty (Suspicious → Ultimate Drama)
- **Countdown timer** with 10-second challenges
- **Live score** updates as you perform the expression
- **Achievements** with funny unlock conditions
- **Leaderboard** (local Hall of Fame)
- **Analytics dashboard** with completely unnecessary statistics
- **Demo mode** for testing without a webcam
- **Sound effects** via Web Audio API (off by default)
- **Privacy-first**: all camera processing is local, nothing is uploaded

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- MediaPipe Tasks Vision (Face Landmarker)
- Web Audio API
- LocalStorage

## Getting Started

### Prerequisites

- Node.js 18+
- A webcam (or use Demo Mode)
- Chrome/Firefox/Edge browser

### Installation

```bash
npm install
```

### Running

```bash
npm run dev
```

The dev server starts automatically. Open the browser to the local URL shown.

### Building

```bash
npm run build
```

## How to Play

1. Click **Start the Expression Test**
2. Create your player profile (name + optional nickname)
3. Allow camera access when prompted
4. Select a level (Level 1 is unlocked initially)
5. Read the challenge description
6. Click **Begin Challenge**
7. Watch the countdown: 3, 2, 1, DRAMA!
8. Perform the target expression for 10 seconds
9. The AI scores your expression in real-time
10. Reach the required score to unlock the next level

## Camera & Privacy

- All face detection happens **in your browser** via MediaPipe
- No video frames are stored or uploaded
- No biometric data leaves your device
- If you deny camera access, **Demo Mode** simulates the experience

## Expression Detection

The game uses MediaPipe's 52 blendshape coefficients (eye openness, brow position, mouth shape, jaw openness, etc.) plus head tilt to calculate how well your expression matches the target profile for each level. Each expression has a weighted feature profile with tolerance ranges — the closer your features match, the higher your score.

## License

This is a parody/educational project. No copyrighted movie assets are used.
