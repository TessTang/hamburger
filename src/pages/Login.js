import { useContext, useEffect, useState } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SignUp from "../components/SignUp";
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { CartData, successAlert } from "../store/frontStore";

export default function Login() {

    const navigate = useNavigate();

    const { user } = useContext(CartData);

    const [loginError, setLoginError] = useState('')

    const [data, setData] = useState({
        "username": '',
        "password": ''
    })

    //check if login
    useEffect(()=>{
    if(user.user){
        navigate('/member/memberprofile')
    }
    })

    const handleData = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const submit = async (e) => {
        try {
            if(data.username === "z8937200@gmail.com"){
                const response = await axios.post('/v2/admin/signin', data);
                const { token, expired } = response.data;
                document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
                navigate('/admin/products')
            } else {
                signInWithEmailAndPassword(auth ,data.username, data.password)
                .then(() => {
                    successAlert('登入成功')
                    navigate('../')
                })
                .catch((error) => {
                    console.log(error)
                    switch (error.code) {
                        case 'auth/invalid-email' :
                           return setLoginError('信箱格式不正確');
                        case 'auth/weak-password' :
                           return setLoginError('密碼錯誤');
                        case 'auth/invalid-credential' :
                           return setLoginError('密碼錯誤');
                        case 'auth/missing-password' :
                           return setLoginError('請輸入密碼');
                        case 'auth/user-not-found' :
                           return setLoginError('用戶不存在');
                        default:setLoginError('登入失敗')
                    }
                });
            }
        } catch (error) {
            setLoginError(error.response.data.message);
        }
    }

    return (
        <> <div className="container-fluid bg-secondary px-0 mt-2">
            <img className="img-fluid" src="https://nunforest.com/fast-foody/burger/upload/banners/ban2.jpg" alt="banners" />
        </div>

            <div className="container py-5 full-height d-flex flex-column align-items-center">
                <Tabs defaultActiveKey="signin" className="mb-3 fs-3" onClick={()=>{setLoginError('');setData({})}}>
                    <Tab eventKey="signin" title="登入">
                        <div >
                            <div className={`alert alert-danger ${loginError ? 'd-block' : 'd-none'}`} role="alert">
                                {loginError}
                            </div>
                            <div className="mb-2">
                                <label htmlFor="email" className="form-label w-100">Email</label>
                                    <input onChange={handleData} id="email" className="form-control" name="username" type="email" placeholder="Email Address" />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="password" className="form-label w-100">密碼</label>
                                <input onChange={handleData} type="password" className="form-control" name="password" id="password" placeholder="Password" />
                            </div>
                            <button type="button" className="btn btn-primary" onClick={submit} >登入</button>
                        </div>
                    </Tab>
                    <Tab eventKey="signup" title="註冊">
                        <SignUp loginError={loginError} setLoginError={setLoginError}/>
                    </Tab>

                </Tabs>

            </div>
        </>)
}
