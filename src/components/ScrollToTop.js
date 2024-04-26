import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const goToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export default function ScrollToTop() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const { pathname } = useLocation();

  //set showTopBtn
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
        return;
      }
      setShowTopBtn(false);
    });
  }, []);

  //set change page position
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (showTopBtn) {
    return (
      <div className="back_To_Top" onClick={goToTop}>
        <i className="bi bi-arrow-bar-up back_To_TopIcon" />
      </div>
    );
  }
}
