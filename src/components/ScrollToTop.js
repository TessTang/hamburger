import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (showTopBtn) {
    return (
      <div className="back_To_Top" onClick={goToTop}>
        <i className="bi bi-arrow-bar-up back_To_TopIcon" />
      </div>
    );
  } else {
    return null;
  }
}
