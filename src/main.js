import './style.css';
import {initGlobe} from './globe.js';
import { initHandTracking } from './handTracker.js';

const container = document.getElementById('app');
const {setRotationDelta} = initGlobe(container);

let prevX = null;

initHandTracking((results) => {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    const indexTip = landmarks[8]; // Index fingertip

    if (prevX !== null) {
      const deltaX = indexTip.x - prevX;

      if (Math.abs(deltaX) > 0.01) {
        setRotationDelta(deltaX * 5); // Adjust rotation sensitivity
      } else {
        setRotationDelta(0);
      }
    }

    prevX = indexTip.x;
  } else {
    setRotationDelta(0);
    prevX = null;
  }
});
