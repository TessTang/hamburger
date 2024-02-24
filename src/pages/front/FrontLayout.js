import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { CartData } from "../../store/cartStore"
import Loading from "../../components/Loading";

export default function FrontLayout() {
    const [isLoading, setIsLoading] = useState(false)
    const [cart, setCart] = useState([])
    const getCart = async () => {
        setIsLoading(true)
        try {
            const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`);
            console.log(res);
            setCart(res.data.data);
            setIsLoading(false)
        }
        catch (error) {
            console.log(error)
        }
    }    
    useEffect(() => {
        getCart()
    }, [])

    //數字千分位
    function numberComma(num){
        let comma=/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g
        return num.toString().replace(comma, ',')
      }

    return <CartData.Provider value={{ cart, setCart, getCart, numberComma, setIsLoading}}>
        {isLoading&&<Loading/>}
        <div className="position-relative">
            <Navbar />
        </div>
        <Outlet />
        <div className="bg-dark py-5">
            <div className="container">
                <div className="d-flex align-items-center justify-content-between text-white mb-md-7 mb-4">
                    <a className="text-white h4" href="./index.html">LOGO</a>
                    <ul className="d-flex list-unstyled mb-0 h4">
                        <li><a href="#" className="text-white mx-3"><i className="fab fa-facebook"></i></a></li>
                        <li><a href="#" className="text-white mx-3"><i className="fab fa-instagram"></i></a></li>
                        <li><a href="#" className="text-white ms-3"><i className="fab fa-line"></i></a></li>
                    </ul>
                </div>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end align-items-start text-white">
                    <div className="mb-md-0 mb-1">
                        <p className="mb-0">02-3456-7890</p>
                        <p className="mb-0">service@mail.com</p>
                    </div>
                    <p className="mb-0">© 2020 LOGO All Rights Reserved.</p>
                </div>
            </div>
        </div>
    </CartData.Provider>
}