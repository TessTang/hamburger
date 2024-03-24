import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';


export default function NotFound() {

    const navaigate = useNavigate(null);

    //三秒後轉回首頁
    useEffect(() => {
        setTimeout(() => {
            navaigate('./')
        }, 3000)
    }, [navaigate])


    return (
        <>
            <div className="container-fluid bg-secondary px-0 mt-2">
                <img
                    className="img-fluid"
                    src="https://nunforest.com/fast-foody/burger/upload/banners/ban2.jpg"
                    alt="banners"
                />
            </div>
            <div className="container full-height d-flex justify-content-center align-items-center">
                <motion.div
                    animate={{ scale: 1.5 }}
                    transition={{ duration: 1 }} className="fs-3">
                    <img src="https://cdn-icons-png.flaticon.com/512/388/388480.png" style={{ width: "3rem" }} alt="warning" />
                    找不到此頁面，將轉回首頁
                    <img src="https://cdn-icons-png.flaticon.com/512/388/388480.png" style={{ width: "3rem" }} alt="warning" />
                </motion.div>
            </div>
        </>
    );
}
