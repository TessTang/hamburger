import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { CartData } from "../../store/frontStore"
import Loading from "../../components/Loading";
import { auth } from "../../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

let a = 1;
export default function FrontLayout() {
    const [isLoading, setIsLoading] = useState(false);
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState({ manager: false, user: null });
    const getCart = async () => {
        setIsLoading(true)
        try {
            const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`);
            setCart(res.data.data);
            setIsLoading(false)
        }
        catch (error) {
            console.log(error)
        }
    }

    console.log(a++, 'user', user)
    //check登入與管理
    useEffect(() => {
        getCart();
        if (document.cookie.split(';')
        .find((row) => row.startsWith('hexToken='))
        ?.split('=')[1] !== "") {
            setUser({ manager: true, user: 'manager' })
            return
        }
        onAuthStateChanged(auth, (currentUser) => {
            console.log('currentUser', currentUser)
            currentUser && setUser({ manager: false, user: currentUser })
        })
    }, [])

    //數字千分位
    function numberComma(num) {
        let comma = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g
        return Math.ceil(num.toString().replace(comma, ','))
    }

    return <CartData.Provider value={{ cart, setCart, getCart, numberComma, setIsLoading, user, setUser }}>
        {isLoading && <Loading />}
        <div className="position-relative">
            <Navbar />
        </div>
        <Outlet />
        <div className="bg-dark py-5">
            <div className="container">
                <div className="d-flex align-items-center justify-content-between text-white mb-4">
                    <img className="footerLogo" src={require('../../assets/logo.png')} alt="logo" style={{ height: '50px' }} />
                    <ul className="d-flex list-unstyled mb-0 h4">
                        <li className="footerLogo px-3"><i className="bi bi-facebook" /></li>
                        <li className="footerLogo px-3"><i className="bi bi-instagram" /></li>
                        <li className="footerLogo px-3"><i className="bi bi-line" /></li>
                    </ul>
                </div>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end align-items-start text-white">
                    <div className="mb-md-0 mb-1">
                        <p className="mb-0">01-2345-6789</p>
                        <p className="mb-0">hamburger@mail.com</p>
                    </div>
                    <p className="mb-0"> 網頁僅供 project 使用 </p>
                </div>
            </div>
        </div>
    </CartData.Provider>
}