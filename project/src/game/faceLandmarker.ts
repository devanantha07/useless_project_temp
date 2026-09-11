import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

let landmarker: FaceLandmarker | null = null;
let loadingPromise: Promise<FaceLandmarker> | null = null;

export async function initializeFaceLandmarker(): Promise<FaceLandmarker> {
  if (landmarker) return landmarker;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm',
    );
    const lm = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU',
      },
      outputFaceBlendshapes: true,
      runningMode: 'VIDEO',
      numFaces: 3,
    });
    landmarker = lm;
    return lm;
  })();

  return loadingPromise;
}

export interface DetectionResult {
  faceDetected: boolean;
  multipleFaces: boolean;
  blendshapes: Record<string, number>;
  headTilt: number;
  landmarks: number[][] | null;
}

export function detectFaces(
  lm: FaceLandmarker,
  video: HTMLVideoElement,
  timestamp: number,
): DetectionResult {
  const results = lm.detectForVideo(video, timestamp);

  const faceCount = results.faceLandmarks?.length ?? 0;
  const faceDetected = faceCount > 0;
  const multipleFaces = faceCount > 1;

  const blendshapes: Record<string, number> = {};
  if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
    const bs = results.faceBlendshapes[0];
    for (const category of bs.categories) {
      blendshapes[category.categoryName] = category.score;
    }
  }

  let headTilt = 0;
  let landmarks: number[][] | null = null;
  if (faceDetected && results.faceLandmarks.length > 0) {
    landmarks = results.faceLandmarks[0].map((p) => [p.x, p.y, p.z ?? 0]);
    // Compute head tilt from eye line angle
    const pts = results.faceLandmarks[0];
    const leftEye = pts[33];  // left eye outer
    const rightEye = pts[263]; // right eye outer
    const dx = rightEye.x - leftEye.x;
    const dy = rightEye.y - leftEye.y;
    headTilt = Math.atan2(dy, dx) / (Math.PI / 2); // normalize to [-1, 1]
  }

  return { faceDetected, multipleFaces, blendshapes, headTilt, landmarks };
}

// Draw facial landmarks on canvas with cinematic styling
export function drawLandmarks(
  canvas: HTMLCanvasElement,
  landmarks: number[][] | null,
  scanProgress: number,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  if (!landmarks || landmarks.length === 0) return;

  // Draw connection lines for key facial regions
  const connections: [number, number][] = [
    // Face oval (subset)
    [10, 338], [338, 297], [297, 332], [332, 284], [284, 251], [251, 389],
    [389, 356], [356, 454], [454, 323], [323, 361], [361, 288], [288, 397],
    [397, 365], [365, 379], [379, 378], [378, 400], [400, 377], [377, 152],
    [152, 148], [148, 176], [176, 149], [149, 150], [150, 136], [136, 172],
    [172, 58], [58, 132], [132, 93], [93, 234], [234, 127], [127, 162],
    [162, 21], [21, 54], [54, 103], [103, 67], [67, 109], [109, 10],
    // Left eye
    [33, 7], [7, 163], [163, 144], [144, 145], [145, 153], [153, 154],
    [154, 155], [155, 133], [133, 173], [173, 157], [157, 158], [158, 159],
    [159, 160], [160, 161], [161, 246], [246, 33],
    // Right eye
    [263, 249], [249, 390], [390, 373], [373, 374], [374, 380], [380, 381],
    [381, 382], [382, 362], [362, 398], [398, 384], [384, 385], [385, 386],
    [386, 387], [387, 388], [388, 466], [466, 263],
    // Left eyebrow
    [70, 63], [63, 105], [105, 66], [66, 107], [107, 55],
    // Right eyebrow
    [336, 296], [296, 334], [334, 293], [293, 300], [300, 285],
    // Mouth outer
    [61, 146], [146, 91], [91, 181], [181, 84], [84, 17], [17, 314],
    [314, 405], [405, 321], [321, 375], [375, 291], [291, 409], [409, 270],
    [270, 269], [269, 267], [267, 0], [0, 37], [37, 39], [39, 40], [40, 185],
    [185, 61],
    // Nose
    [168, 6], [6, 197], [197, 195], [195, 5], [5, 4], [4, 1], [1, 19],
    [19, 94], [94, 2],
  ];

  ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (const [a, b] of connections) {
    if (landmarks[a] && landmarks[b]) {
      ctx.moveTo(landmarks[a][0] * w, landmarks[a][1] * h);
      ctx.lineTo(landmarks[b][0] * w, landmarks[b][1] * h);
    }
  }
  ctx.stroke();

  // Draw landmark points
  for (let i = 0; i < landmarks.length; i++) {
    const [x, y] = landmarks[i];
    ctx.beginPath();
    ctx.arc(x * w, y * h, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(253, 224, 71, 0.8)';
    ctx.fill();
  }

  // Draw scanning line effect
  const scanY = (scanProgress % 1) * h;
  const gradient = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
  gradient.addColorStop(0, 'rgba(34, 197, 94, 0)');
  gradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.15)');
  gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, scanY - 30, w, 60);

  // Bright scan line
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, scanY);
  ctx.lineTo(w, scanY);
  ctx.stroke();
}
