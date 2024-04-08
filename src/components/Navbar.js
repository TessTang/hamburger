import { useContext, useState, useCallback, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FrontData } from "../store/frontStore";

export default function Navbar() {
  const { cart, user } = useContext(FrontData);
  const [roll, setRoll] = useState(true);
  const handleNavigation = useCallback((e) => {
    const window = e.currentTarget;
    if (window.scrollY > 0) {
      setRoll(false);
    } else {
      setRoll(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleNavigation);
    return () => {
      window.removeEventListener("scroll", handleNavigation);
    };
  }, [handleNavigation]);

  return (
    <nav className={`row navbar fixed-top myNavbar p-2 ${roll || "scroll"}`}>
      <div className="navbarSection col-7 col-md-8 justify-content-between">
        <NavLink className="navbar-brand navbarLogo me-0" to="/">
          <img
            src={require("../assets/logo.png")}
            width="30"
            height="30"
            alt="logo"
          />
        </NavLink>
        <NavLink className="nav-item nav-link" to="/">
          首頁
        </NavLink>
        <NavLink className="nav-item nav-link" to="/products">
          產品
        </NavLink>
        <NavLink className="nav-item nav-link" to="/blogs">
          專欄
        </NavLink>
      </div>
      <div className="navbarSection col-5 col-md-4 justify-content-center gap-4 justify-content-md-end">
        <NavLink className="nav-item nav-link position-relative" to="/cart">
          <i className="bi bi-bag-fill fs-5" />
          <span className="position-absolute top-10 start-100 translate-middle badge rounded-pill bg-danger">
            {cart?.carts && cart.carts.length}
          </span>
        </NavLink>

        {user.manager ? (
          <NavLink
            className="nav-item nav-link position-relative"
            to="./admin/products"
          >
            <button className="btn btn-dark">控制台</button>
          </NavLink>
        ) : (
          <NavLink className="nav-item nav-link position-relative" to="./login">
            {user.user ? <i className="bi bi-person-circle fs-5" /> : "登入"}
          </NavLink>
        )}
      </div>
    </nav>
  );
}
