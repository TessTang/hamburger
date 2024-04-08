import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useScrollTrigger } from "./ScrollTriggerProvider";

const banner = {
  animate: {
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.1,
    },
  },
};

const letterAnimation = {
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
const hamburgerAnimation = {
  initial: {
    y: -1000,
  },
  animate: (custom) => ({
    y: 0,
    transition: {
      delay: 2 - custom * 0.25,
    },
  }),
  shake: (custom) => ({
    x: [0, custom - 3, custom + 1, custom - 2, custom + 2, 0],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 2,
        ease: "linear",
      },
    },
  }),
};

const Screen = () => {
  const [hamHeight, setHamHeight] = useState(0);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, hamHeight * 0.2]);
  const y2 = useTransform(scrollY, [0, 300], [0, hamHeight * 0.15]);
  const y3 = useTransform(scrollY, [0, 300], [0, hamHeight * 0.1]);
  const y4 = useTransform(scrollY, [0, 300], [0, hamHeight * 0.05]);
  const y5 = useTransform(scrollY, [0, 300], [0, hamHeight * -0.02]);
  const y6 = useTransform(scrollY, [0, 300], [0, hamHeight * -0.1]);
  const y7 = useTransform(scrollY, [0, 300], [0, hamHeight * -0.15]);
  const y8 = useTransform(scrollY, [0, 300], [0, -600]);

  const mt1Ref = useRef(null);
  useEffect(() => {
    setHamHeight(mt1Ref.current.clientHeight);
  }, []);

  const progress = useScrollTrigger();
  const colorStart = "#000000";
  const colorEnd = "#c7e4df";

  const fontColorFinal = "#474747ee";
  const fontColorStart = "#e3ece5d2";

  const bg = useTransform(progress, [0, 1], [colorStart, colorEnd]);
  const fontColor = useTransform(
    progress,
    [0, 1],
    [fontColorStart, fontColorFinal],
  );

  const AnimatedLetters = ({ title }) => (
    <motion.span
      className="row-title"
      variants={banner}
      initial="initial"
      animate="animate"
    >
      {[...title].map((letter, idx) => (
        <motion.span
          className="row-letter"
          key={idx}
          variants={letterAnimation}
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );

  const [playMarquee, setPlayMarquee] = useState(false);

  useEffect(() => {
    setPlayMarquee(true);
  }, []);

  const HamburgerLayer = ({ y, zIndex, title, custom }) => (
    <motion.div
      className="box"
      style={{ x: 0, y: y, zIndex: zIndex }}
      custom={custom}
      variants={hamburgerAnimation}
      initial="initial"
      animate="animate"
      whileInView="shake"
    >
      <img
        src={require(`../assets/${title}.png`)}
        alt={title}
        style={{ width: "100%" }}
      />
    </motion.div>
  );

  return (
    <motion.div
      className="screen d-flex align-items-center justify-content-around"
      style={{ height: "100vh", backgroundColor: bg }}
    >
      <motion.img
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ y: y8, x: 0 }}
        src="https://modinatheme.com/html/foodking-html/assets/img/shape/tomato-shape-2.png"
        alt="bannerSmallImg"
        className="bannerSmallImg"
      />
      <motion.div
        variants={banner}
        className="banner flex-grow-1 col-3"
        style={{ color: fontColor }}
      >
        <div className="banner-row">
          <div className="row-col">
            <AnimatedLetters title="Ham" />
          </div>
          <div className="row-col">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="row-message"
            >
              陪伴顧客走過每一段別具滋味的片刻時光，共享每一刻美好瞬間。這樣的滋味，真好！
            </motion.span>
          </div>
        </div>

        <div className={`banner-row marquee  ${playMarquee && "animate"}`}>
          <div className="marquee__inner">
            <AnimatedLetters title="fresh" />
            <AnimatedLetters title="fresh" />
            <AnimatedLetters title="fresh" />
            <AnimatedLetters title="fresh" />
          </div>
        </div>
        <div className="banner-row center">
          <AnimatedLetters title="Burger" />
        </div>
      </motion.div>

      <div className="mt-1 col-4 col-md-auto" ref={mt1Ref}>
        <HamburgerLayer custom={1} y={y1} zIndex="1" title="hamburger01_top" />
        <HamburgerLayer custom={2} y={y2} zIndex="5" title="hamburger_vege01" />
        <HamburgerLayer custom={3} y={y3} zIndex="4" title="hamburger_tomato" />
        <HamburgerLayer
          custom={4}
          y={y4}
          zIndex="3"
          title="hamburger_cheese02"
        />
        <HamburgerLayer custom={5} y={y5} zIndex="2" title="hamburger_egg" />
        <HamburgerLayer custom={6} y={y6} zIndex="1" title="hamburger_beef" />
        <HamburgerLayer
          custom={7}
          y={y7}
          zIndex="1"
          title="hamburger01_bottom"
        />
      </div>
    </motion.div>
  );
};

export default Screen;
