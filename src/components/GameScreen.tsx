import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Camera, CameraOff, Scan, Eye, Brain, CheckCircle, XCircle,
  RotateCcw, ChevronRight, AlertTriangle, Loader2, Activity, Clock,
} from 'lucide-react';
import type { LevelDefinition, PlayerProfile, ScoreResult, ScreenName } from '@/game/types';
import { EXPRESSION_PROFILES, getPassFeedback, getFailFeedback, getScoreRating } from '@/game/gameData';
import { initializeFaceLandmarker, detectFaces, drawLandmarks, type DetectionResult } from '@/game/faceLandmarker';
import { calculateExpressionScore, generateDemoFeatures } from '@/game/expressionScoring';
import {
  playCountdownBeep, playDramaStart, playLevelPassed, playLevelFailed,
} from '@/game/sound';

type GamePhase = 'loading' | 'camera_error' | 'ready' | 'countdown' | 'playing' | 'result';

interface GameScreenProps {
  level: LevelDefinition;
  profile: PlayerProfile;
  onLevelComplete: (levelId: number, score: number, passed: boolean) => void;
  onNavigate: (screen: ScreenName) => void;
  onNextLevel: (level: LevelDefinition) => void;
  nextLevel: LevelDefinition | null;
  demoMode: boolean;
  onToggleDemo: () => void;
}

const CHALLENGE_DURATION = 10; // seconds
const COUNTDOWN_STEPS = ['3', '2', '1', 'DRAMA!'];

export default function GameScreen({
  level, onLevelComplete, onNavigate, onNextLevel, nextLevel, demoMode, onToggleDemo,
}: GameScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<Awaited<ReturnType<typeof initializeFaceLandmarker>> | null>(null);
  const rafRef = useRef<number>(0);
  const scanProgressRef = useRef(0);
  const phaseRef = useRef<GamePhase>('loading');
  const maxScoreRef = useRef(0);
  const challengeStartRef = useRef(0);
  const lastVideoTimeRef = useRef(-1);
  const streamReadyRef = useRef(false);

  const [phase, setPhase] = useState<GamePhase>('loading');
  const [liveScore, setLiveScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(CHALLENGE_DURATION);
  const [countdownStep, setCountdownStep] = useState(0);
  const [detectionStatus, setDetectionStatus] = useState('Initializing...');
  const [finalScore, setFinalScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [showLandmarks, setShowLandmarks] = useState(true);

  phaseRef.current = phase;

  const setPhaseSync = useCallback((p: GamePhase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  // Attach stream to video element — retries until the element is available
  const attachStreamToVideo = useCallback(async (stream: MediaStream) => {
    const tryAttach = async (attempts: number): Promise<boolean> => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch {
          // play() can reject if interrupted — not fatal, video will still display
        }
        return true;
      }
      if (attempts > 0) {
        await new Promise((r) => setTimeout(r, 50));
        return tryAttach(attempts - 1);
      }
      return false;
    };
    return tryAttach(20); // ~1 second of retries
  }, []);

  // Initialize camera
  const initCamera = useCallback(async () => {
    setPhaseSync('loading');
    setDetectionStatus('Requesting camera access...');
    streamReadyRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;

      // Wait for the video element to be in the DOM, then attach
      await attachStreamToVideo(stream);
      streamReadyRef.current = true;

      setDetectionStatus('Loading AI model...');
      const lm = await initializeFaceLandmarker();
      landmarkerRef.current = lm;

      setDetectionStatus('Ready');
      setPhaseSync('ready');
    } catch (err) {
      const error = err as Error;
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraError('Camera access denied. The AI cannot judge your face without seeing it.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError('No camera found. The AI has nothing to look at.');
      } else if (error.name === 'NotReadableError') {
        setCameraError('Camera is in use by another application.');
      } else {
        setCameraError(error.message || 'Failed to initialize camera.');
      }
      setPhaseSync('camera_error');
    }
  }, [setPhaseSync, attachStreamToVideo]);

  // Demo mode init
  const initDemo = useCallback(() => {
    setDetectionStatus('Demo mode active');
    setPhaseSync('ready');
  }, [setPhaseSync]);

  // Start countdown
  const startCountdown = useCallback(() => {
    setCountdownStep(0);
    setPhaseSync('countdown');
    playCountdownBeep();

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < COUNTDOWN_STEPS.length) {
        setCountdownStep(step);
        if (step === COUNTDOWN_STEPS.length - 1) {
          playDramaStart();
        } else {
          playCountdownBeep();
        }
      } else {
        clearInterval(interval);
        maxScoreRef.current = 0;
        challengeStartRef.current = performance.now();
        setLiveScore(0);
        setTimeLeft(CHALLENGE_DURATION);
        setPhaseSync('playing');
      }
    }, 1000);
  }, [setPhaseSync]);

  // Main detection loop
  const detectionLoop = useCallback(() => {
    if (phaseRef.current !== 'playing') {
      rafRef.current = requestAnimationFrame(detectionLoop);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      rafRef.current = requestAnimationFrame(detectionLoop);
      return;
    }

    // Update timer
    const elapsed = (performance.now() - challengeStartRef.current) / 1000;
    const remaining = Math.max(0, CHALLENGE_DURATION - elapsed);
    setTimeLeft(Math.ceil(remaining));

    if (remaining <= 0) {
      const best = maxScoreRef.current;
      setFinalScore(best);
      const didPass = best >= level.requiredScore;
      setPassed(didPass);
      setFeedback(didPass ? getPassFeedback(best) : getFailFeedback(best));
      setPhaseSync('result');
      if (didPass) playLevelPassed();
      else playLevelFailed();
      onLevelComplete(level.id, best, didPass);
      return;
    }

    scanProgressRef.current += 0.02;

    let result: DetectionResult;

    if (demoMode) {
      const demo = generateDemoFeatures();
      result = {
        faceDetected: true,
        multipleFaces: false,
        blendshapes: demo.blendshapes,
        headTilt: demo.headTilt,
        landmarks: null,
      };
      setDetectionStatus('Demo: Simulated face detected');
    } else {
      const lm = landmarkerRef.current;
      if (!lm || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(detectionLoop);
        return;
      }

      const now = performance.now();
      if (video.currentTime === lastVideoTimeRef.current) {
        rafRef.current = requestAnimationFrame(detectionLoop);
        return;
      }
      lastVideoTimeRef.current = video.currentTime;

      result = detectFaces(lm, video, now);

      if (result.multipleFaces) {
        setDetectionStatus('Too many actors detected!');
      } else if (result.faceDetected) {
        setDetectionStatus('Face detected — analyzing expression');
      } else {
        setDetectionStatus('No face detected');
      }
    }

    // Draw landmarks
    if (canvas.width !== video.videoWidth && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
    if (demoMode) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawDemoFace(canvas, scanProgressRef.current);
    } else {
      if (showLandmarks) {
        drawLandmarks(canvas, result.landmarks, scanProgressRef.current);
      } else {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    // Calculate score if face is detected
    if (result.faceDetected && !result.multipleFaces) {
      const exprProfile = EXPRESSION_PROFILES[level.expression];
      const scoreResult: ScoreResult = calculateExpressionScore(
        exprProfile, result.blendshapes, result.headTilt,
      );
      const score = scoreResult.score;
      if (score > maxScoreRef.current) {
        maxScoreRef.current = score;
      }
      setLiveScore(score);
    }

    rafRef.current = requestAnimationFrame(detectionLoop);
  }, [demoMode, level.expression, level.requiredScore, onLevelComplete, showLandmarks, setPhaseSync]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Start detection loop
  useEffect(() => {
    rafRef.current = requestAnimationFrame(detectionLoop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [detectionLoop]);

  // Initialize on mount
  useEffect(() => {
    if (demoMode) {
      initDemo();
    } else {
      initCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    initCamera();
  };

  const handleDemoFromError = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    onToggleDemo();
    initDemo();
  };

  const scoreColor = (score: number) => {
    if (score >= level.requiredScore) return 'text-green-400';
    if (score >= level.requiredScore - 15) return 'text-yellow-400';
    return 'text-red-400';
  };

  const progressBarColor = (score: number) => {
    if (score >= level.requiredScore) return 'from-green-600 to-green-400';
    if (score >= level.requiredScore - 15) return 'from-yellow-600 to-yellow-400';
    return 'from-red-600 to-red-400';
  };

  // Always render the full layout — loading/error are overlays, not early returns.
  // This ensures the <video> element is always in the DOM when initCamera runs.
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {demoMode && (
        <div className="glass-card-gold p-3 mb-4 text-center text-sm text-yellow-400 flex items-center justify-center gap-2">
          <AlertTriangle size={16} /> Demo Mode — Facial features are simulated. Camera is not active.
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT: Webcam */}
        <div>
          <div className="glass-card neon-border p-4 relative overflow-hidden">
            <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
              {/* Video element is ALWAYS in the DOM */}
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
                style={{ visibility: demoMode || phase === 'loading' || phase === 'camera_error' ? 'hidden' : 'visible' }}
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />

              {/* Loading overlay */}
              {phase === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                  <div className="text-center">
                    <Loader2 size={48} className="text-green-400 mx-auto mb-4 animate-spin" />
                    <h2 className="text-xl font-bold text-white mb-2">Initializing AI System</h2>
                    <p className="text-gray-400 text-sm">{detectionStatus}</p>
                    <p className="text-gray-600 text-xs mt-4">Loading MediaPipe Face Landmarker model...</p>
                  </div>
                </div>
              )}

              {/* Camera error overlay */}
              {phase === 'camera_error' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-20 p-6">
                  <div className="text-center max-w-sm">
                    <CameraOff size={48} className="text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-red-400 mb-3">CAMERA ACCESS DENIED</h2>
                    <p className="text-gray-400 mb-2 text-sm">
                      Unfortunately, the AI cannot judge your face without seeing your face.
                    </p>
                    <p className="text-gray-500 text-xs mb-6">{cameraError}</p>
                    <div className="flex flex-col gap-2">
                      <button onClick={handleRetry} className="btn-primary flex items-center justify-center gap-2 text-sm py-3">
                        <Camera size={16} /> Try Again
                      </button>
                      <button onClick={handleDemoFromError} className="btn-secondary flex items-center justify-center gap-2 text-sm py-3">
                        <Scan size={16} /> Play Demo Mode
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Demo mode placeholder */}
              {demoMode && phase !== 'loading' && phase !== 'camera_error' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Scan size={64} className="text-green-400/30 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-500 text-sm">Simulated face detection</p>
                  </div>
                </div>
              )}

              {/* Scanning overlay corners */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-green-400/60 pointer-events-none z-10" />
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-green-400/60 pointer-events-none z-10" />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-green-400/60 pointer-events-none z-10" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-green-400/60 pointer-events-none z-10" />

              {/* Status overlay */}
              {phase !== 'loading' && phase !== 'camera_error' && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 glass-card px-3 py-1.5 flex items-center gap-2 z-10">
                  <div className={`w-2 h-2 rounded-full ${
                    phase === 'playing' ? 'bg-green-400 animate-blink' : phase === 'countdown' ? 'bg-yellow-400' : 'bg-gray-500'
                  }`} />
                  <span className="text-xs font-mono text-gray-300">{detectionStatus}</span>
                </div>
              )}

              {/* AI Analyzing indicator */}
              {phase === 'playing' && (
                <div className="absolute bottom-3 left-3 glass-card px-3 py-1.5 flex items-center gap-2 z-10">
                  <Activity size={12} className="text-green-400 animate-pulse" />
                  <span className="text-xs font-mono text-green-400">AI ANALYZING...</span>
                </div>
              )}

              {/* Countdown overlay */}
              {phase === 'countdown' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                  <div
                    key={countdownStep}
                    className="text-7xl sm:text-8xl font-extrabold animate-countdown text-center"
                  >
                    {countdownStep === COUNTDOWN_STEPS.length - 1 ? (
                      <span className="text-green-400 text-glow-green">DRAMA!</span>
                    ) : (
                      <span className="text-white">{COUNTDOWN_STEPS[countdownStep]}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Privacy notice */}
            <p className="text-xs text-gray-600 text-center mt-3 flex items-center justify-center gap-1.5">
              <Eye size={12} /> Your camera feed is processed locally. Nothing is uploaded or stored.
            </p>
          </div>

          {/* Controls */}
          <div className="flex gap-2 mt-4 flex-wrap">
            <button
              onClick={() => setShowLandmarks(!showLandmarks)}
              className="btn-ghost text-xs"
            >
              {showLandmarks ? 'Hide' : 'Show'} Landmarks
            </button>
            <button onClick={() => onNavigate('levelselect')} className="btn-ghost text-xs">
              Exit to Levels
            </button>
          </div>
        </div>

        {/* RIGHT: Game info */}
        <div className="space-y-4">
          {/* Level header */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-mono text-green-400 tracking-wider">LEVEL {String(level.id).padStart(2, '0')}</div>
                <h2 className="text-3xl font-extrabold text-white mt-1">{level.name}</h2>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase">Required</div>
                <div className="text-2xl font-bold text-green-400 font-mono">{level.requiredScore}%</div>
              </div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 border border-green-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Brain size={16} className="text-green-400" />
                <span className="text-xs font-mono text-green-400 uppercase">Challenge</span>
              </div>
              <p className="text-gray-300 text-sm italic">"{level.instruction}"</p>
            </div>
          </div>

          {/* Score display — during play or ready */}
          {(phase === 'playing' || phase === 'ready') && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Expression Match</span>
                {phase === 'playing' && (
                  <span className="flex items-center gap-1.5 text-xs font-mono text-yellow-400">
                    <Clock size={12} />
                    {String(timeLeft).padStart(2, '0')}s
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="progress-bar-bg mb-2 relative">
                <div
                  className={`progress-bar-fill bg-gradient-to-r ${progressBarColor(liveScore)}`}
                  style={{ width: `${liveScore}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-yellow-400/80"
                  style={{ left: `${level.requiredScore}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-3xl font-mono font-extrabold ${scoreColor(liveScore)}`}>
                  {liveScore}%
                </span>
                <span className="text-xs text-gray-500">
                  Best this round: <span className="text-white font-mono">{Math.max(liveScore, 0)}%</span>
                </span>
              </div>

              {/* Timer bar */}
              {phase === 'playing' && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 uppercase">Time Remaining</span>
                    <span className="text-xs font-mono text-gray-400">{timeLeft}s</span>
                  </div>
                  <div className="progress-bar-bg h-1.5">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-red-500 rounded-full transition-all duration-1000 ease-linear"
                      style={{ width: `${(timeLeft / CHALLENGE_DURATION) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Start button */}
              {phase === 'ready' && (
                <button onClick={startCountdown} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                  <Camera size={20} /> Begin Challenge
                </button>
              )}
            </div>
          )}

          {/* Combo/Points during play */}
          {phase === 'playing' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 text-center">
                <div className="text-xs text-gray-500 uppercase mb-1">Points</div>
                <div className="text-xl font-bold text-yellow-400 font-mono">
                  +{level.points}
                </div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-xs text-gray-500 uppercase mb-1">Combo</div>
                <div className="text-xl font-bold text-green-400 font-mono">x1</div>
              </div>
            </div>
          )}

          {/* Result screen */}
          {phase === 'result' && (
            <div className={`glass-card p-8 text-center animate-scale-in ${passed ? 'neon-border' : 'neon-border-red'}`}>
              {passed ? (
                <>
                  <CheckCircle size={56} className="text-green-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-extrabold text-green-400 text-glow-green mb-2">
                    LEVEL CLEARED!
                  </h2>
                  <p className="text-gray-400 mb-6">THE AI HAS ACCEPTED YOUR DRAMA.</p>
                </>
              ) : (
                <>
                  <XCircle size={56} className="text-red-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-extrabold text-red-400 text-glow-red mb-2">
                    EXPRESSION FAILED!
                  </h2>
                  <p className="text-gray-400 mb-6">You have disappointed the facial recognition department.</p>
                </>
              )}

              {/* Final score */}
              <div className="bg-black/30 rounded-xl p-6 mb-4 border border-white/5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Expression Match Score</div>
                <div className={`text-6xl font-mono font-extrabold ${scoreColor(finalScore)} mb-2`}>
                  {finalScore}%
                </div>
                <div className="text-sm text-gray-400">{getScoreRating(finalScore)}</div>
              </div>

              {/* Feedback */}
              <div className="glass-card p-4 mb-6 border border-yellow-500/20">
                <p className="text-yellow-400 italic">"{feedback}"</p>
              </div>

              {/* Points awarded */}
              {passed && (
                <div className="mb-6 text-center">
                  <span className="text-xs text-gray-500 uppercase">Points Earned</span>
                  <div className="text-3xl font-bold text-yellow-400 font-mono animate-scale-in">+{level.points}</div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={startCountdown} className="btn-primary flex items-center justify-center gap-2">
                  <RotateCcw size={18} /> Try Again
                </button>
                {passed && nextLevel ? (
                  <button onClick={() => onNextLevel(nextLevel)} className="btn-gold flex items-center justify-center gap-2">
                    Next Level <ChevronRight size={18} />
                  </button>
                ) : (
                  <button onClick={() => onNavigate('levelselect')} className="btn-secondary flex items-center justify-center gap-2">
                    Level Select
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Feature breakdown during play */}
          {phase === 'playing' && liveScore > 0 && (
            <div className="glass-card p-4">
              <div className="text-xs font-mono text-gray-500 uppercase mb-3">Live Feature Analysis</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {EXPRESSION_PROFILES[level.expression].features.slice(0, 4).map((f) => (
                  <div key={f.blendshape} className="flex items-center justify-between">
                    <span className="text-gray-500 truncate">{f.blendshape}</span>
                    <span className="text-green-400 font-mono">{Math.round(liveScore)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Draw a simple animated face outline for demo mode
function drawDemoFace(canvas: HTMLCanvasElement, progress: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  if (w === 0 || h === 0) return;

  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.3;

  // Face oval
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx, cy, radius * 0.8, radius, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Eyes
  ctx.fillStyle = 'rgba(253, 224, 71, 0.6)';
  ctx.beginPath();
  ctx.arc(cx - radius * 0.35, cy - radius * 0.25, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + radius * 0.35, cy - radius * 0.25, 6, 0, Math.PI * 2);
  ctx.fill();

  // Mouth (animated)
  const mouthOpen = (Math.sin(progress * 3) + 1) / 2 * 20;
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx, cy + radius * 0.35, radius * 0.3, mouthOpen / 2 + 3, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Eyebrows
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
  ctx.lineWidth = 3;
  const browY = cy - radius * 0.45;
  const browOffset = Math.sin(progress * 2) * 5;
  ctx.beginPath();
  ctx.moveTo(cx - radius * 0.45, browY - browOffset);
  ctx.lineTo(cx - radius * 0.2, browY - browOffset - 3);
  ctx.moveTo(cx + radius * 0.2, browY + browOffset - 3);
  ctx.lineTo(cx + radius * 0.45, browY + browOffset);
  ctx.stroke();

  // Scan line
  const scanY = (progress % 1) * h;
  const gradient = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
  gradient.addColorStop(0, 'rgba(34, 197, 94, 0)');
  gradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.15)');
  gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, scanY - 30, w, 60);
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, scanY);
  ctx.lineTo(w, scanY);
  ctx.stroke();

  // Landmark dots
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    const px = cx + Math.cos(angle) * radius * 0.8;
    const py = cy + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.arc(px, py, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(253, 224, 71, 0.5)';
    ctx.fill();
  }
}
