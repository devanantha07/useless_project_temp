import type { ExpressionProfile, ScoreResult, ScoreBreakdown } from './types';

export function calculateExpressionScore(
  profile: ExpressionProfile,
  blendshapes: Record<string, number>,
  headTilt: number,
): ScoreResult {
  const breakdown: ScoreBreakdown[] = [];
  let totalWeight = 0;
  let totalScore = 0;

  for (const feature of profile.features) {
    const current = blendshapes[feature.blendshape] ?? 0;
    const diff = Math.abs(current - feature.target);
    // Score: 1 when within tolerance, drops to 0 at 2x tolerance
    const subScore = Math.max(0, 1 - diff / (feature.tolerance * 2));
    const weighted = subScore * feature.weight;
    totalScore += weighted;
    totalWeight += feature.weight;

    breakdown.push({
      featureName: feature.blendshape,
      current,
      target: feature.target,
      subScore: subScore * 100,
      weight: feature.weight,
    });
  }

  // Head tilt scoring
  if (profile.headTiltTarget !== undefined && profile.headTiltTolerance !== undefined && profile.headTiltWeight !== undefined) {
    const tiltDiff = Math.abs(headTilt - profile.headTiltTarget);
    const tiltScore = Math.max(0, 1 - tiltDiff / (profile.headTiltTolerance * 2));
    totalScore += tiltScore * profile.headTiltWeight;
    totalWeight += profile.headTiltWeight;

    breakdown.push({
      featureName: 'headTilt',
      current: headTilt,
      target: profile.headTiltTarget,
      subScore: tiltScore * 100,
      weight: profile.headTiltWeight,
    });
  }

  const rawScore = totalWeight > 0 ? totalScore / totalWeight : 0;
  // Apply slight curve to make scoring feel more responsive
  const score = Math.min(100, Math.round(Math.pow(rawScore, 0.85) * 100));

  return { score, breakdown };
}

// Generate simulated blendshapes for demo mode
export function generateDemoFeatures(): {
  blendshapes: Record<string, number>;
  headTilt: number;
} {
  const names = [
    'eyeWideLeft', 'eyeWideRight', 'eyeBlinkLeft', 'eyeBlinkRight',
    'eyeSquintLeft', 'eyeSquintRight', 'browInnerUp',
    'browOuterUpLeft', 'browOuterUpRight', 'browDownLeft', 'browDownRight',
    'jawOpen', 'mouthSmileLeft', 'mouthSmileRight',
    'mouthFrownLeft', 'mouthFrownRight', 'mouthShrugLower',
    'mouthStretchLeft', 'mouthStretchRight', 'noseSneerLeft', 'noseSneerRight',
  ];
  const blendshapes: Record<string, number> = {};
  for (const name of names) {
    blendshapes[name] = Math.random() * 0.6;
  }
  const headTilt = (Math.random() - 0.5) * 0.8;
  return { blendshapes, headTilt };
}
