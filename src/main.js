import './style.css';
import {initGlobe} from './globe.js';
import { initHandTracking } from './handTracker.js';

const container = document.getElementById('app');
const {setRotationDelta,adjustZoom} = initGlobe(container);

let prevX = null;
let prevPinchDistance = 0;

initHandTracking((results) => {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    const indexTip = landmarks[8]; 
    const thumbTip = landmarks[4];
    const dx = indexTip.x - thumbTip.x;
    const dy = indexTip.y - thumbTip.y;
    const pinchDistance = Math.sqrt(dx*dx+dy*dy);
    if(prevPinchDistance != null){
      const delta=pinchDistance-prevPinchDistance;
      if(Math.abs(delta)>0.005){
        adjustZoom(delta);
      }
    }
    if (prevX !== null) {
      const deltaX = indexTip.x - prevX;

      if (Math.abs(deltaX) > 0.01) {
        setRotationDelta(deltaX * 5); 
      } else {
        setRotationDelta(0);
      }
    }
    prevPinchDistance = pinchDistance;
    prevX = indexTip.x;
  } else {
    prevPinchDistance =null;
    setRotationDelta(0);
    prevX = null;
  }
});
