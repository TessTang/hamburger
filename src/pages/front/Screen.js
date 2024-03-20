import { motion, useTransform } from 'framer-motion';
import React from 'react';
import { useScrollTrigger } from './ScrollTriggerProvider';

const Screen = ({
    colorStart = '#333399',
    colorEnd = '#663399',
    fadeIn = true,
    fadeOut = true,
    showProgress = false,
    title,
    y1,
    y2
  }) => {
    const progress = useScrollTrigger();
  
    const bg = useTransform(progress, [0, 1], [colorStart, colorEnd]);
    const titleOpacity = useTransform(progress, [0, 0.5, 1], [fadeIn ? 0 : 1, 1, fadeOut ? 0 : 1]);
    const bgProgress = useTransform(progress, [0, 1], ['100% 0%', '100% 100%']);
  
    return (
      <motion.div className="screen" style={{ backgroundColor: bg }}>
        <motion.h2 style={{ opacity: titleOpacity }}>{title}</motion.h2>
        <motion.div className="box" style={{ y: y1, x: -50 }} />
        <motion.div className="box" style={{ y: y2, x: 50, background: 'salmon' }} />
        {showProgress && (
          <div className="progress">
            <motion.div className="progress-inner" style={{ backgroundSize: bgProgress }} />
          </div>
        )}
      </motion.div>
    );
  };

export default Screen;