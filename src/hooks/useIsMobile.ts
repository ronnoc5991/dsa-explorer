import { useEffect, useState } from "react";

// TODO: is it possible (or even desirable) to use a single event listener across all instances of this getting invoked?
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [breakpoint]);

  return isMobile;
}

export default useIsMobile;
