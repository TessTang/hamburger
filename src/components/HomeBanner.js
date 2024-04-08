import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { banner, letterAnimation} from "../utils/variants";

const HomeBanner = () => {
  const [playMarquee, setPlayMarquee] = useState(false);

  useEffect(() => {
    setPlayMarquee(true);
  }, []);
  return (
    <motion.div className="banner" variants={banner}>
      <BannerRowTop title={"Ham"} />
      <BannerRowCenter title={"fresh"} playMarquee={playMarquee} />
      <BannerRowBottom title={"burger"} />
    </motion.div>
  );
};

const AnimatedLetters = ({ title }) => (
  <motion.span
    className="row-title"
    variants={banner}
    initial="initial"
    animate="animate"
  >
    {[...title].map((letter) => (
      <motion.span className="row-letter" variants={letterAnimation}>
        {letter}
      </motion.span>
    ))}
  </motion.span>
);

const BannerRowTop = ({ title }) => {
  return (
    <div className={"banner-row"}>
      <div className="row-col">
        <AnimatedLetters title={title} />
      </div>
      <div className="row-col">
        <span className="row-message">
          We are specialised in setting up the foundation of your brand and
          setting you up for success.
        </span>
      </div>
    </div>
  );
};

const BannerRowBottom = ({ title }) => {
  return (
    <div className={"banner-row center"}>
      <div className="scroll">
        <span>scroll</span>
        <span>down</span>
      </div>
      <AnimatedLetters title={title} />
    </div>
  );
};

const BannerRowCenter = ({ title, playMarquee }) => {
  return (
    <div className={`banner-row marquee  ${playMarquee && "animate"}`}>
      <div className="marquee__inner">
        <AnimatedLetters title={title} />
        <AnimatedLetters title={title} />
        <AnimatedLetters title={title} />
        <AnimatedLetters title={title} />
      </div>
    </div>
  );
};

export default HomeBanner;
