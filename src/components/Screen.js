import { useEffect, useRef, useState } from "react";

import { motion, useScroll, useTransform } from "framer-motion";

import { useScrollTrigger } from "./ScrollTriggerProvider";

//animation設定
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
};

//SECTION背景顏色變化設定
const colorStart = "#000000";
const colorEnd = "#ffffff";
const fontColorFinal = "#474747ee";
const fontColorStart = "#e3ece5d2";

const Screen = () => {
  //hamburger layer animate
  const [hamHeight, setHamHeight] = useState(0);
  const hamRef = useRef(null);
  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, 300], [0, hamHeight * 0.2]);
  const y2 = useTransform(scrollY, [0, 300], [0, hamHeight * 0.15]);
  const y3 = useTransform(scrollY, [0, 300], [0, hamHeight * 0.1]);
  const y4 = useTransform(scrollY, [0, 300], [0, hamHeight * 0.05]);
  const y5 = useTransform(scrollY, [0, 300], [0, hamHeight * -0.02]);
  const y6 = useTransform(scrollY, [0, 300], [0, hamHeight * -0.1]);
  const y7 = useTransform(scrollY, [0, 300], [0, hamHeight * -0.15]);

  //section background color animate
  const progress = useScrollTrigger();
  const bg = useTransform(progress, [0, 1], [colorStart, colorEnd]);
  const fontColor = useTransform(
    progress,
    [0, 1],
    [fontColorStart, fontColorFinal],
  );

  const HamburgerLayer = ({ y, zIndex, title, custom }) => (
    <motion.div
      className="box"
      style={{ x: 0, y: y, zIndex: zIndex }}
      custom={custom}
      variants={hamburgerAnimation}
      initial="initial"
      animate="animate"
    >
      <img
        src={require(`../assets/${title}.png`)}
        alt={title}
        style={{ width: "100%" }}
      />
    </motion.div>
  );

  const AnimatedLetters = ({ title }) => (
    <motion.span
      className="row-title d-block"
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

  //偵測 section 高度調整 hamburger layer 移動距離
  useEffect(() => {
    setHamHeight(hamRef.current.clientHeight);
  }, []);

  return (
    <motion.div
      className="screen d-flex flex-wrap"
      style={{ height: "100vh", backgroundColor: bg }}
    >
      {/* 左邊字體banner */}
      <motion.div
        variants={banner}
        className="banner flex-grow-1 col-3"
        style={{ color: fontColor }}
      >
        <div className="banner-row">
          <div className="row-col text-center ps-3">
            <AnimatedLetters title="Ham" />
            <AnimatedLetters title="burger" />
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
      </motion.div>

      {/* 漢堡動畫區塊 */}
      <div
        className="mt-1 col-4 col-md-auto d-flex flex-column justify-content-around"
        ref={hamRef}
      >
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

      <motion.div
        variants={banner}
        className="w-100"
        style={{ color: fontColor }}
      >
        <div className={`marquee animate`}>
          <div className="marquee__inner">
            <AnimatedLetters title="新鮮" />
            <AnimatedLetters title="美味" />
            <AnimatedLetters title="快速" />
            <AnimatedLetters title="健康" />
          </div>
          <div className="marquee__inner">
            <AnimatedLetters title="新鮮" />
            <AnimatedLetters title="美味" />
            <AnimatedLetters title="快速" />
            <AnimatedLetters title="健康" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Screen;
