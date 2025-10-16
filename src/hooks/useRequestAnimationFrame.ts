import { useEffect } from "react";

// could return a start and stop function?
// only start the ticking when the algo is running and stop it when it is done?
export default function useRequestAnimationFrame(
  callback: (d: number) => void
) {
  let animationFrameHandle: number | null = null;
  // needs to be able to cancel the loop?

  const tick = (d: number) => {
    callback(d);
    animationFrameHandle = requestAnimationFrame(tick);
  };

  useEffect(() => {
    animationFrameHandle = requestAnimationFrame(tick);

    return () => {
      if (!animationFrameHandle) return;
      cancelAnimationFrame(animationFrameHandle);
    };
  }, [callback]);
}
