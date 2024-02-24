import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { CartData } from "../store/cartStore"


export default function Navbar() {

    const { cart } = useContext(CartData);

    return (
        <nav className="row navbar navbar-light fixed-top myNavbar p-2">
            <div className="navbarSection col-3"/>
            <div className="navbarSection col-6 justify-content-between">
            <NavLink className="nav-item nav-link" to='/'>首頁</NavLink>
            <NavLink className="navbar-brand navbarLogo me-0">Navbar</NavLink>
            <NavLink className="nav-item nav-link" to='/products'>產品</NavLink>
            </div>
            <div className="navbarSection col-3 justify-content-end gap-3">
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