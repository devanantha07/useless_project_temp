export type ScreenName =
  | 'home'
  | 'howitworks'
  | 'leaderboard'
  | 'about'
  | 'achievements'
  | 'analytics'
  | 'levelselect'
  | 'game'
  | 'finalresult';

export interface LevelDefinition {
  id: number;
  name: string;
  expression: ExpressionType;
  description: string;
  instruction: string;
  requiredScore: number;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme' | 'Insane';
}

export type ExpressionType =
  | 'SUSPICIOUS'
  | 'CONFUSED'
  | 'SHOCKED'
  | 'OVERCONFIDENT'
  | 'TERRIFIED'
  | 'EMOTIONAL'
  | 'EXTREME_SUSPICION'
  | 'ULTIMATE_DRAMA';

export interface FeatureTarget {
  blendshape: string;
  target: number;
  tolerance: number;
  weight: number;
}

export interface ExpressionProfile {
  type: ExpressionType;
  displayName: string;
  features: FeatureTarget[];
  headTiltTarget?: number;
  headTiltTolerance?: number;
  headTiltWeight?: number;
}

export interface Achievement {
  id: string;
  icon: string;
  name: string;
  description: string;
  check: (stats: PlayerStats) => boolean;
}

export interface PlayerStats {
  totalExpressions: number;
  totalAttempts: number;
  totalFails: number;
  consecutiveFails: number;
  attemptsPerLevel: Record<number, number>;
  bestScores: Record<number, number>;
  expressionCounts: Record<string, number>;
  failCounts: Record<number, number>;
  totalTimeMs: number;
  highestScore: number;
  levelsCompleted: number;
  allLevelsComplete: boolean;
}

export interface PlayerProfile {
  name: string;
  nickname: string;
  dramaScore: number;
  currentLevel: number;
  highestLevel: number;
  bestExpression: number;
  unlockedLevels: number[];
  unlockedAchievements: string[];
  stats: PlayerStats;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  isPlayer?: boolean;
}

export interface FeedbackMessages {
  fail: string[];
  pass: string[];
}

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info' | 'achievement';
}

export interface FacialFeatures {
  blendshapes: Record<string, number>;
  headTilt: number;
  faceDetected: boolean;
}

export interface ScoreBreakdown {
  featureName: string;
  current: number;
  target: number;
  subScore: number;
  weight: number;
}

export interface ScoreResult {
  score: number;
  breakdown: ScoreBreakdown[];
}
