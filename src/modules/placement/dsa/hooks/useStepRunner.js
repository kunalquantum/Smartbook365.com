import { useState, useRef, useCallback } from 'react';

/**
 * Central animation engine.
 * steps: array of state snapshots
 * onStep: fn(step, idx) called for each frame
 */
export function useStepRunner(steps, onStep) {
  const [idx, setIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [speed, setSpeed] = useState(500); // ms per step
  const timerRef = useRef(null);
  const idxRef = useRef(-1);
  const stepsRef = useRef(steps);
  stepsRef.current = steps;

  const stop = useCallback(() => {
    clearInterval(timerRef.current);
    setPlaying(false);
  }, []);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setPlaying(false);
    setDone(false);
    setIdx(-1);
    idxRef.current = -1;
    if (stepsRef.current.length > 0) onStep(null, -1);
  }, [onStep]);

  const goTo = useCallback((i) => {
    if (!stepsRef.current.length) return;
    const clamped = Math.max(0, Math.min(i, stepsRef.current.length - 1));
    idxRef.current = clamped;
    setIdx(clamped);
    onStep(stepsRef.current[clamped], clamped);
    if (clamped === stepsRef.current.length - 1) {
      setDone(true);
      setPlaying(false);
      clearInterval(timerRef.current);
    } else {
      setDone(false);
    }
  }, [onStep]);

  const stepForward = useCallback(() => {
    goTo(idxRef.current + 1);
  }, [goTo]);

  const stepBack = useCallback(() => {
    goTo(idxRef.current - 1);
  }, [goTo]);

  const play = useCallback(() => {
    if (!stepsRef.current.length) return;
    if (idxRef.current >= stepsRef.current.length - 1) {
      idxRef.current = -1;
      setDone(false);
    }
    setPlaying(true);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const next = idxRef.current + 1;
      if (next >= stepsRef.current.length) {
        clearInterval(timerRef.current);
        setPlaying(false);
        setDone(true);
        return;
      }
      idxRef.current = next;
      setIdx(next);
      onStep(stepsRef.current[next], next);
    }, speed);
  }, [onStep, speed]);

  const pause = useCallback(() => {
    clearInterval(timerRef.current);
    setPlaying(false);
  }, []);

  // When speed changes during play, restart
  const updateSpeed = useCallback((s) => {
    setSpeed(s);
    if (playing) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const next = idxRef.current + 1;
        if (next >= stepsRef.current.length) {
          clearInterval(timerRef.current);
          setPlaying(false);
          setDone(true);
          return;
        }
        idxRef.current = next;
        setIdx(next);
        onStep(stepsRef.current[next], next);
      }, s);
    }
  }, [playing, onStep]);

  return {
    idx, playing, done, speed,
    play, pause, stop, reset,
    stepForward, stepBack, goTo,
    updateSpeed,
    total: steps.length,
    canForward: idx < steps.length - 1,
    canBack: idx > 0,
  };
}
