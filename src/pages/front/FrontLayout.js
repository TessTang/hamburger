import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { FrontData } from "../../store/frontStore"
import Loading from "../../components/Loading";
import { auth, db } from "../../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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

    const checkUserData = async(data)=>{
        if(data){
            const docSnap = await getDoc(doc(db, "users", data.uid));
            if (docSnap.exists()) {
                setUser({ manager: false, user: docSnap.data() })
            } else {
                console.log("No such document!");
            };
        }else{
            return
        }
    }

    //check登入與管理
    useEffect(() => {
        getCart();
        if (document.cookie.split(';')
        .find((row) => row.startsWith('hexToken='))
        ?.split('=')[1]) {
            setUser({ manager: true, user: 'manager' })
            return
        }
        onAuthStateChanged(auth, (currentUser) => {
            if(currentUser){
            checkUserData(currentUser)
                }else{
                    return
                }
        })
        // onAuthStateChanged(auth, async(currentUser) => {
        //         if(currentUser){
        //             const docSnap = await getDoc(doc(db, "users", currentUser.uid));
        //             if (docSnap.exists()) {
        //                 setUser({ manager: false, user: docSnap.data() })
        //             } else {
        //                 console.log("No such document!");
        //             };
        //         }else{
        //             return
        //         }
        // })
    }, [])

    //數字千分位
    function numberComma(num) {
        let comma = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g
        return Math.ceil(num.toString().replace(comma, ','))
    }

    return <FrontData.Provider value={{ cart, setCart, getCart, numberComma, setIsLoading, user, setUser, checkUserData }}>
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
    </FrontData.Provider>
}