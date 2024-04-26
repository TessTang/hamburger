export const fadeIn = (direction, delay) => {
  return {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
};

//home 猜你喜歡
export const likeProduct_h4 = {
  hover: {
    backgroundColor: "#879416",
    color: "#ffffff",
    transition: { duration: 0.5 },
  },
};
export const likeProduct_icon = {
  hover: {
    scale: [1, 2, 2, 1, 1],
    transition: {
      duration: 1,
      ease: "easeInOut",
      times: [0, 0.2, 0.5, 0.8, 1],
      repeat: Infinity,
      repeatDelay: 1,
    },
  },
};

export const likeProduct_fire = {
  hover: {
    opacity: 1,
    x: [0, -6, 5, -3, 2, 0],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 3,
        ease: "linear",
      },
      duration: 0.5,
    },
  },
};

//home hover
export const hoverScale = (scale) => {
  return {
    hover: {
      scale: scale,
      transition: { duration: 0.2 },
    },
  };
};

//home banner
export const marqueeVariants = {
  animate: {
    x: [0, "-100%"],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 7,
        ease: "linear",
      },
    },
  },
};

export const banner = {
  animate: {
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.1,
    },
  },
};

export const letterAnimation = {
  initial: {
    y: 400,
  },
  animate: {
    y: 0,
    transition: {
      ease: [0.6, 0.01, -0.05, 0.95],
      duration: 1,
    },
  },
};
