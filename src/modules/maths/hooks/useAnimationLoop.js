import { useState, useEffect, useRef } from 'react';

export const useAnimationLoop = (isRunning, maxFrames = 100, fps = 60) => {
  const [frame, setFrame] = useState(0);
  const lastTimeRef = useRef(0);
  const frameInterval = 1000 / fps;

  useEffect(() => {
    let requestRef;
    
    const animate = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaTime = time - lastTimeRef.current;

      if (isRunning && deltaTime >= frameInterval) {
        setFrame((prev) => {
          if (prev >= maxFrames) {
            return maxFrames;
          }
          return prev + 1;
        });
        lastTimeRef.current = time - (deltaTime % frameInterval);
      }
      
      requestRef = requestAnimationFrame(animate);
    };

    if (isRunning) {
      requestRef = requestAnimationFrame(animate);
    } else {
      lastTimeRef.current = 0;
    }

    return () => cancelAnimationFrame(requestRef);
  }, [isRunning, maxFrames, frameInterval]);

  return { frame, setFrame };
};
