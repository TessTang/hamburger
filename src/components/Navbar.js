import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { CartData } from "../store/cartStore"


export default function Navbar() {

    const [roll, setRoll] = useState(false)
    const { cart } = useContext(CartData);

    return (
        <nav className="row navbar navbar-light fixed-top myNavbar p-2 active">
            <div className="navbarSection col-3"/>
            <div className="navbarSection col-6 justify-content-between">
            <NavLink className="nav-item nav-link" to='/'>首頁</NavLink>
            <NavLink className="navbar-brand navbarLogo me-0"><img src={require('../assets/logo.png')} width="30" height="30" alt="123" /></NavLink>
            <NavLink className="nav-item nav-link" to='/products'>產品</NavLink>
            </div>
            <div className="navbarSection col-3 justify-content-end gap-4">
                <NavLink className="nav-item nav-link  position-relative" to='/cart'>
                    <i className="bi bi-bag-fill fs-5"></i>
                    <span className="position-absolute top-10 start-100 translate-middle badge rounded-pill bg-danger">
                        {cart.carts?.length}
                    </span>
                </NavLink>
                <NavLink className="nav-item nav-link  position-relative" to='/cart'>
                    <i className="bi bi-person-circle fs-5"></i>
                </NavLink>
            </div>
        </nav>
    )
}