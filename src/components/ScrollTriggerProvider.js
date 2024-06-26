import { createContext, useContext, useLayoutEffect, useRef } from "react";
import { useMotionValue } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clamp from "lodash/clamp";

const ScrollTriggerContext = createContext(null);

const useScrollTrigger = () => useContext(ScrollTriggerContext);

const DEFAULT_OPTIONS = {
  end: "+=100%",
  pin: true,
  scrub: true,
  start: "top top",
};

const ScrollTriggerProvider = ({ children, options = {} }) => {
  const refScrollTrigger = useRef(null);
  const refTimeline = useRef();
  const progress = useMotionValue(0);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (refScrollTrigger.current) {
      refTimeline.current = gsap.timeline({
        scrollTrigger: {
          ...DEFAULT_OPTIONS,
          ...options,
          trigger: refScrollTrigger.current,
          onUpdate: (instance) => {
            progress.set(clamp(instance.progress, 0, 1));
          },
        },
      });
    }

    return () => {
      refTimeline.current?.scrollTrigger?.kill();
      refTimeline.current?.kill();
      refTimeline.current?.clear();
    };
  }, [options, progress]);

  return (
    <div ref={refScrollTrigger} style={{ background: "black" }}>
      <ScrollTriggerContext.Provider value={progress}>
        {children}
      </ScrollTriggerContext.Provider>
    </div>
  );
};

export { ScrollTriggerProvider, useScrollTrigger };
