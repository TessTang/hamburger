import { useEffect } from "react";
import { useNavigate } from "react-router";

import { motion } from "framer-motion";

import Banner from "../../components/Banner";

export default function NotFound() {
  const navaigate = useNavigate(null);

  //2.5秒後轉回首頁
  useEffect(() => {
    setTimeout(() => {
      navaigate("./");
    }, 2500);
  }, [navaigate]);

  return (
    <>
      <Banner bgImg="banner01.jpg" />
      <div className="container full-height d-flex justify-content-center align-items-center">
        <motion.div
          animate={{ scale: 1.5 }}
          transition={{ duration: 0.8 }}
          className="fs-3"
        >
          <img
            src={require("../../assets/notFound_warning.png")}
            style={{ width: "3rem" }}
            alt="warning"
          />
          找不到此頁面，將轉回首頁
          <img
            src={require("../../assets/notFound_warning.png")}
            style={{ width: "3rem" }}
            alt="warning"
          />
        </motion.div>
      </div>
    </>
  );
}
