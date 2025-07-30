import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import * as drawingUtils from '@mediapipe/drawing_utils';

export function initHandTracking(onResultsCallback) {
  const videoElement = document.getElementById('webcam');
  const canvasElement = document.getElementById('output_canvas');
  const canvasCtx = canvasElement.getContext('2d');

  const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });

  hands.onResults((results) => {
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      for (const landmarks of results.multiHandLandmarks) {
        drawingUtils.drawConnectors(canvasCtx, landmarks, Hands.HAND_CONNECTIONS, {
          color: "#FF0000",
          lineWidth: 1,
        });
        drawingUtils.drawLandmarks(canvasCtx, landmarks, {
          color: "#00FF00",
          lineWidth: 2,
        });
      }
    }

    onResultsCallback(results);
  });

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await hands.send({ image: videoElement });
    },
    width: 300,
    height: 225,
  });

  camera.start();
}
