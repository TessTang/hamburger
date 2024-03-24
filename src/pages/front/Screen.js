import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useScrollTrigger } from './ScrollTriggerProvider';

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

  const mt1Ref = useRef(null);
  useEffect(() => {
    setHamHeight(mt1Ref.current.clientHeight)
  }, [])
  
  const progress = useScrollTrigger();
  const colorStart = '#0000000';
  const colorEnd = '#BBE2EC';

  const bg = useTransform(progress, [0, 1], [colorStart, colorEnd]);

  return (

    <motion.div className="screen d-flex align-items-center justify-content-around" style={{ height: '100vh', backgroundColor: bg }}>

      <div className="col-md-4 text-center bg-light bg-opacity-50 rounded-2 px-3 py-5 h-75">
        <h2 className="fs-1 fw-bolder">Hamburger</h2>
        <p className="text-muted mb-0 fs-5 mt-4">
          1984年，Hamburger帶著美式熱情基因而來，數十個年頭，一點一滴融入台灣在地文化。亙古不變的服務理念、與時俱進的服務精神，以「美食」、「數位」、「服務」的三大升級持續向前邁進！陪伴顧客走過每一段別具滋味的片刻時光，共享每一刻美好瞬間。這樣的滋味，真好！
        </p>
        <Link to="/products" className="btn btn-dark mt-4 ">
          立即選購
        </Link>
      </div>
      <div className='mt-1' ref={mt1Ref}>
        <motion.div className="box" style={{ x: 0, y: y1, zIndex: "1" }} >
          <img src={require('../../assets/hamburger01_top.png')} alt="ja" style={{ width: "100%" }} />
        </motion.div>
        <motion.div className="box" style={{ x: 0, y: y2, zIndex: "5" }} >
          <img src={require('../../assets/hamburger_vege01.png')} alt="ja" style={{ width: "100%" }} />
        </motion.div>
        <motion.div className="box" style={{ x: 0, y: y3, zIndex: "4" }} >
          <img src={require('../../assets/hamburger_tomato.png')} alt="ja" style={{ width: "100%" }} />
        </motion.div>
        <motion.div className="box" style={{ x: 0, y: y4, zIndex: "3" }} >
          <img src={require('../../assets/hamburger_cheese02.png')} alt="ja" style={{ width: "100%" }} />
        </motion.div>
        <motion.div className="box" style={{ x: 0, y: y5, zIndex: "2" }} >
          <img src={require('../../assets/hamburger_egg.png')} alt="ja" style={{ width: "100%" }} />
        </motion.div>
        <motion.div className="box" style={{ x: 0, y: y6, zIndex: "1" }} >
          <img src={require('../../assets/hamburger_beef.png')} alt="ja" style={{ width: "100%" }} />
        </motion.div>
        <motion.div className="box" style={{ x: 0, y: y7 }} >
          <img src={require('../../assets/hamburger01_bottom.png')} alt="ja" style={{ width: "100%" }} />
        </motion.div>
      </div>
    </motion.div>

  );
};

export default Screen;