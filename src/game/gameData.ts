import type { LevelDefinition, ExpressionProfile, Achievement, LeaderboardEntry, FeedbackMessages } from './types';

export const LEVELS: LevelDefinition[] = [
  {
    id: 1,
    name: 'SUSPICIOUS',
    expression: 'SUSPICIOUS',
    description: 'Someone ate your snacks and is pretending they know nothing.',
    instruction: 'Look at the camera like you just discovered someone ate your snacks.',
    requiredScore: 65,
    points: 100,
    difficulty: 'Easy',
  },
  {
    id: 2,
    name: 'CONFUSED',
    expression: 'CONFUSED',
    description: 'You just heard something that makes absolutely no sense.',
    instruction: 'Tilt your head and squint like someone just explained quantum physics using emoji.',
    requiredScore: 70,
    points: 200,
    difficulty: 'Easy',
  },
  {
    id: 3,
    name: 'SHOCKED',
    expression: 'SHOCKED',
    description: 'You checked your bank balance after ordering food.',
    instruction: 'Open your eyes and mouth wide like you just saw the delivery fee.',
    requiredScore: 70,
    points: 300,
    difficulty: 'Medium',
  },
  {
    id: 4,
    name: 'OVERCONFIDENT',
    expression: 'OVERCONFIDENT',
    description: 'You submitted your assignment one minute before the deadline.',
    instruction: 'Smirk like you definitely know what you are doing. You do not.',
    requiredScore: 75,
    points: 400,
    difficulty: 'Medium',
  },
  {
    id: 5,
    name: 'TERRIFIED',
    expression: 'TERRIFIED',
    description: "Your teacher said: 'Everyone submit your phones.'",
    instruction: 'Look like you just received a death sentence for your social life.',
    requiredScore: 75,
    points: 500,
    difficulty: 'Hard',
  },
  {
    id: 6,
    name: 'EMOTIONAL',
    expression: 'EMOTIONAL',
    description: 'Your favorite snack is officially finished.',
    instruction: 'Look like you are about to cry on national television.',
    requiredScore: 80,
    points: 600,
    difficulty: 'Hard',
  },
  {
    id: 7,
    name: 'EXTREME SUSPICION',
    expression: 'EXTREME_SUSPICION',
    description: "Your friend said: 'Bro, trust me.'",
    instruction: 'Look like you have been betrayed by every human you have ever met.',
    requiredScore: 85,
    points: 800,
    difficulty: 'Extreme',
  },
  {
    id: 8,
    name: 'ULTIMATE DRAMA',
    expression: 'ULTIMATE_DRAMA',
    description: 'Your entire life has become a Malayalam movie climax.',
    instruction: 'Give the most exaggerated expression a human face has ever produced.',
    requiredScore: 90,
    points: 1000,
    difficulty: 'Insane',
  },
];

export const EXPRESSION_PROFILES: Record<string, ExpressionProfile> = {
  SUSPICIOUS: {
    type: 'SUSPICIOUS',
    displayName: 'SUSPICIOUS',
    features: [
      { blendshape: 'eyeSquintRight', target: 0.5, tolerance: 0.35, weight: 2 },
      { blendshape: 'eyeSquintLeft', target: 0.1, tolerance: 0.25, weight: 1 },
      { blendshape: 'browOuterUpLeft', target: 0.5, tolerance: 0.35, weight: 2 },
      { blendshape: 'browOuterUpRight', target: 0.1, tolerance: 0.2, weight: 1.5 },
      { blendshape: 'jawOpen', target: 0.05, tolerance: 0.1, weight: 1 },
      { blendshape: 'noseSneerLeft', target: 0.3, tolerance: 0.3, weight: 1 },
      { blendshape: 'mouthShrugLower', target: 0.2, tolerance: 0.2, weight: 0.5 },
    ],
    headTiltTarget: 0.25,
    headTiltTolerance: 0.4,
    headTiltWeight: 1.5,
  },
  CONFUSED: {
    type: 'CONFUSED',
    displayName: 'CONFUSED',
    features: [
      { blendshape: 'browOuterUpLeft', target: 0.6, tolerance: 0.35, weight: 2.5 },
      { blendshape: 'browOuterUpRight', target: 0.1, tolerance: 0.2, weight: 1.5 },
      { blendshape: 'jawOpen', target: 0.15, tolerance: 0.15, weight: 1 },
      { blendshape: 'mouthShrugLower', target: 0.3, tolerance: 0.25, weight: 1 },
      { blendshape: 'eyeSquintLeft', target: 0.2, tolerance: 0.2, weight: 0.5 },
    ],
    headTiltTarget: 0.3,
    headTiltTolerance: 0.45,
    headTiltWeight: 2,
  },
  SHOCKED: {
    type: 'SHOCKED',
    displayName: 'SHOCKED',
    features: [
      { blendshape: 'eyeWideLeft', target: 0.7, tolerance: 0.35, weight: 2 },
      { blendshape: 'eyeWideRight', target: 0.7, tolerance: 0.35, weight: 2 },
      { blendshape: 'browInnerUp', target: 0.7, tolerance: 0.35, weight: 1.5 },
      { blendshape: 'browOuterUpLeft', target: 0.6, tolerance: 0.35, weight: 1 },
      { blendshape: 'browOuterUpRight', target: 0.6, tolerance: 0.35, weight: 1 },
      { blendshape: 'jawOpen', target: 0.5, tolerance: 0.3, weight: 2 },
      { blendshape: 'mouthStretchLeft', target: 0.3, tolerance: 0.3, weight: 0.5 },
      { blendshape: 'mouthStretchRight', target: 0.3, tolerance: 0.3, weight: 0.5 },
    ],
  },
  OVERCONFIDENT: {
    type: 'OVERCONFIDENT',
    displayName: 'OVERCONFIDENT',
    features: [
      { blendshape: 'mouthSmileLeft', target: 0.45, tolerance: 0.3, weight: 2 },
      { blendshape: 'mouthSmileRight', target: 0.45, tolerance: 0.3, weight: 2 },
      { blendshape: 'browInnerUp', target: 0.25, tolerance: 0.25, weight: 1 },
      { blendshape: 'eyeSquintLeft', target: 0.2, tolerance: 0.2, weight: 1 },
      { blendshape: 'eyeSquintRight', target: 0.2, tolerance: 0.2, weight: 1 },
      { blendshape: 'jawOpen', target: 0.05, tolerance: 0.1, weight: 0.5 },
    ],
    headTiltTarget: -0.15,
    headTiltTolerance: 0.35,
    headTiltWeight: 1.5,
  },
  TERRIFIED: {
    type: 'TERRIFIED',
    displayName: 'TERRIFIED',
    features: [
      { blendshape: 'eyeWideLeft', target: 0.85, tolerance: 0.3, weight: 2.5 },
      { blendshape: 'eyeWideRight', target: 0.85, tolerance: 0.3, weight: 2.5 },
      { blendshape: 'browInnerUp', target: 0.8, tolerance: 0.3, weight: 2 },
      { blendshape: 'browOuterUpLeft', target: 0.7, tolerance: 0.3, weight: 1.5 },
      { blendshape: 'browOuterUpRight', target: 0.7, tolerance: 0.3, weight: 1.5 },
      { blendshape: 'jawOpen', target: 0.6, tolerance: 0.3, weight: 2 },
      { blendshape: 'mouthStretchLeft', target: 0.4, tolerance: 0.3, weight: 1 },
      { blendshape: 'mouthStretchRight', target: 0.4, tolerance: 0.3, weight: 1 },
      { blendshape: 'noseSneerLeft', target: 0.3, tolerance: 0.3, weight: 0.5 },
    ],
  },
  EMOTIONAL: {
    type: 'EMOTIONAL',
    displayName: 'EMOTIONAL',
    features: [
      { blendshape: 'browDownLeft', target: 0.5, tolerance: 0.3, weight: 2 },
      { blendshape: 'browDownRight', target: 0.5, tolerance: 0.3, weight: 2 },
      { blendshape: 'browInnerUp', target: 0.4, tolerance: 0.3, weight: 1 },
      { blendshape: 'mouthFrownLeft', target: 0.5, tolerance: 0.35, weight: 2 },
      { blendshape: 'mouthFrownRight', target: 0.5, tolerance: 0.35, weight: 2 },
      { blendshape: 'jawOpen', target: 0.15, tolerance: 0.15, weight: 1 },
      { blendshape: 'eyeSquintLeft', target: 0.35, tolerance: 0.3, weight: 1 },
      { blendshape: 'eyeSquintRight', target: 0.35, tolerance: 0.3, weight: 1 },
      { blendshape: 'mouthShrugLower', target: 0.4, tolerance: 0.3, weight: 1 },
    ],
  },
  EXTREME_SUSPICION: {
    type: 'EXTREME_SUSPICION',
    displayName: 'EXTREME SUSPICION',
    features: [
      { blendshape: 'eyeSquintRight', target: 0.7, tolerance: 0.3, weight: 2.5 },
      { blendshape: 'eyeSquintLeft', target: 0.1, tolerance: 0.2, weight: 1.5 },
      { blendshape: 'browOuterUpLeft', target: 0.7, tolerance: 0.3, weight: 2.5 },
      { blendshape: 'browOuterUpRight', target: 0.05, tolerance: 0.15, weight: 2 },
      { blendshape: 'jawOpen', target: 0.02, tolerance: 0.08, weight: 1.5 },
      { blendshape: 'noseSneerLeft', target: 0.5, tolerance: 0.3, weight: 1.5 },
      { blendshape: 'noseSneerRight', target: 0.3, tolerance: 0.3, weight: 1 },
      { blendshape: 'mouthShrugLower', target: 0.3, tolerance: 0.25, weight: 1 },
    ],
    headTiltTarget: 0.35,
    headTiltTolerance: 0.45,
    headTiltWeight: 2,
  },
  ULTIMATE_DRAMA: {
    type: 'ULTIMATE_DRAMA',
    displayName: 'ULTIMATE DRAMA',
    features: [
      { blendshape: 'eyeWideLeft', target: 0.7, tolerance: 0.35, weight: 1.5 },
      { blendshape: 'eyeWideRight', target: 0.7, tolerance: 0.35, weight: 1.5 },
      { blendshape: 'browInnerUp', target: 0.7, tolerance: 0.3, weight: 1.5 },
      { blendshape: 'browOuterUpLeft', target: 0.6, tolerance: 0.35, weight: 1 },
      { blendshape: 'browOuterUpRight', target: 0.6, tolerance: 0.35, weight: 1 },
      { blendshape: 'jawOpen', target: 0.6, tolerance: 0.3, weight: 2 },
      { blendshape: 'mouthStretchLeft', target: 0.5, tolerance: 0.3, weight: 1 },
      { blendshape: 'mouthStretchRight', target: 0.5, tolerance: 0.3, weight: 1 },
      { blendshape: 'mouthSmileLeft', target: 0.3, tolerance: 0.35, weight: 0.5 },
      { blendshape: 'mouthSmileRight', target: 0.3, tolerance: 0.35, weight: 0.5 },
      { blendshape: 'noseSneerLeft', target: 0.3, tolerance: 0.3, weight: 0.5 },
    ],
    headTiltTarget: 0.2,
    headTiltTolerance: 0.5,
    headTiltWeight: 1,
  },
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_drama',
    icon: '🎭',
    name: 'FIRST DRAMA',
    description: 'Complete your first level.',
    check: (s) => s.levelsCompleted >= 1,
  },
  {
    id: 'emotionally_available',
    icon: '😐',
    name: 'EMOTIONALLY AVAILABLE',
    description: 'Score above 80% on any level.',
    check: (s) => s.highestScore >= 80,
  },
  {
    id: 'suspicious_character',
    icon: '👀',
    name: 'SUSPICIOUS CHARACTER',
    description: 'Score 90% or above in Suspicious.',
    check: (s) => (s.bestScores[1] ?? 0) >= 90,
  },
  {
    id: 'panic_mode',
    icon: '😱',
    name: 'PANIC MODE',
    description: 'Score 95% or above in Terrified.',
    check: (s) => (s.bestScores[5] ?? 0) >= 95,
  },
  {
    id: 'this_is_cinema',
    icon: '🎬',
    name: 'THIS IS CINEMA',
    description: 'Score 95% or above in Ultimate Drama.',
    check: (s) => (s.bestScores[8] ?? 0) >= 95,
  },
  {
    id: 'why_are_you',
    icon: '🤨',
    name: 'WHY ARE YOU LIKE THIS?',
    description: 'Attempt the same level 10 times.',
    check: (s) => Object.values(s.attemptsPerLevel).some((v) => v >= 10),
  },
  {
    id: 'face_of_stone',
    icon: '🗿',
    name: 'FACE OF STONE',
    description: 'Fail 5 times consecutively.',
    check: (s) => s.consecutiveFails >= 5,
  },
  {
    id: 'bhaasi_legend',
    icon: '🏆',
    name: 'BHAASI LEGEND',
    description: 'Complete all 8 levels.',
    check: (s) => s.allLevelsComplete,
  },
];

export const SEED_LEADERBOARD: LeaderboardEntry[] = [
  { name: 'Ammu', score: 8920 },
  { name: 'Devu', score: 7450 },
  { name: 'Rahul', score: 6780 },
  { name: 'Anu', score: 5900 },
  { name: 'Random Person', score: 4320 },
  { name: 'Vaguely Dramatic Person', score: 3100 },
  { name: 'Extra #3', score: 1500 },
];

export const FAIL_FEEDBACK: string[] = [
  'Your face is suspiciously normal.',
  'More drama required.',
  'Even the AI doesn\'t believe you.',
  'The AI detected a face. Unfortunately, not the correct one.',
  'Are you sure you were making an expression?',
  'You have disappointed the facial recognition department.',
  'That expression was... a choice.',
  'The camera is on. Your face is off.',
  'Have you considered acting lessons?',
  'The AI felt nothing. Absolutely nothing.',
  'Your face said "I am alive" and nothing else.',
  'Bhaasi would not approve.',
];

export const PASS_FEEDBACK: Record<string, string[]> = {
  low: [
    'Some drama detected.',
    'Barely acceptable. But the AI will take it.',
    'You passed. The AI is not impressed, but it will allow it.',
  ],
  mid: [
    'Acceptable. But your inner actor is still sleeping.',
    'Good expression. The cinema industry is watching.',
    'Not bad. You might have a career in unnecessary drama.',
  ],
  high: [
    'Excellent. Very unnecessary. Very impressive.',
    'Cinema-level expression!',
    'The AI is standing up and clapping. Virtually.',
  ],
  legendary: [
    'THIS IS CINEMA.',
    'LEGENDARY PERFORMANCE!',
    'BHAASI HIMSELF COULD NOT HAVE DONE BETTER.',
    'The AI is filing this for the archives.',
  ],
};

export function getPassFeedback(score: number): string {
  let tier: keyof typeof PASS_FEEDBACK;
  if (score >= 95) tier = 'legendary';
  else if (score >= 85) tier = 'high';
  else if (score >= 75) tier = 'mid';
  else tier = 'low';
  const messages = PASS_FEEDBACK[tier];
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getFailFeedback(score: number): string {
  if (score < 30) return 'Are you sure you were making an expression?';
  if (score < 50) return 'The AI detected a face. Unfortunately, not the correct one.';
  if (score < 65) return 'Some drama detected. Not enough for Bhaasi standards.';
  const generic = FAIL_FEEDBACK[Math.floor(Math.random() * FAIL_FEEDBACK.length)];
  return generic;
}

export const SCORE_RATINGS: { min: number; label: string }[] = [
  { min: 95, label: 'LEGENDARY PERFORMANCE!' },
  { min: 85, label: 'Cinema-level expression!' },
  { min: 70, label: 'Pretty dramatic.' },
  { min: 50, label: "You're getting there." },
  { min: 0, label: 'That was not convincing.' },
];

export function getScoreRating(score: number): string {
  return SCORE_RATINGS.find((r) => score >= r.min)?.label ?? 'That was not convincing.';
}
