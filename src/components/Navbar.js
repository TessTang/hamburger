import { useContext, useState, useCallback, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { CartData } from "../store/cartStore"


export default function Navbar() {

    const [roll, setRoll] = useState(false)
    const { cart } = useContext(CartData);

    const [y, setY] = useState(true);

    console.log(window.scrollY)
    // const handleNavigation = useCallback(
    //   e => {
    //     const window = e.currentTarget;
    //     if (y > window.scrollY) {
    //       console.log(window.scrollY,"scrolling up");
    //     } else if (y < window.scrollY) {
    //       console.log("scrolling down");
    //     }
    //     setY(window.scrollY);
    //   }, [y]
    // );
    const handleNavigation = useCallback(
      e => {
        const window = e.currentTarget;
        // if (y > window.scrollY) {
        //   console.log(window.scrollY,"scrolling up");
        // } else if (y < window.scrollY) {
        //   console.log("scrolling down");
        // }
        if(window.scrollY > 0){
            console.log('>0')
            setY(false);
        } else {
            setY(true)
            console.log('=0')
        }
        
      }, []
    );
    
    useEffect(() => {
    //   setY(window.scrollY);
      window.addEventListener("scroll", handleNavigation);
    
      return () => {
        window.removeEventListener("scroll", handleNavigation);
      };
    }, [handleNavigation]);


    return (
        <nav className={`row navbar fixed-top myNavbar p-2 ${y || 'scroll'}`}>
            <div className="navbarSection col-3"/>
            <div className="navbarSection col-6 justify-content-between">
            <NavLink className="nav-item nav-link" to='/'>首頁</NavLink>
            <NavLink className="navbar-brand navbarLogo me-0" to='/'>
                <img src={require('../assets/logo.png')} width="30" height="30" alt="logo" />
                </NavLink>
            <NavLink className="nav-item nav-link" to='/products'>產品</NavLink>
            </div>
            <div className="navbarSection col-3 justify-content-end gap-4">
                <NavLink className="nav-item nav-link position-relative" to='/cart'>
                    <i className="bi bi-bag-fill fs-5"></i>
                    <span className="position-absolute top-10 start-100 translate-middle badge rounded-pill bg-danger">
                        {cart.carts?.length}
                    </span>
                </NavLink>
                <NavLink className="nav-item nav-link position-relative" to='/cart'>
                    <i className="bi bi-person-circle fs-5"></i>
                </NavLink>
            </div>
        </nav>
    )
}