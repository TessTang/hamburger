import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUp({loginError, setLoginError}) {

    const navigate = useNavigate();
    const [data, setData] = useState({
        "username": '',
        "password": ''
    })

    const handleData = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }
    // console.log(firebase)

    const submit = (e) => {
        console.log(data);
        createUserWithEmailAndPassword(auth, data.username, data.password)
            .then((userCredential) => {
                console.log('成功');
                console.log(userCredential.user);
                navigate('../')
            })
            .catch((error) => {
                console.log(error.code)
                switch (error.code) {
                    case 'auth/invalid-email':
                        return setLoginError('信箱格式不正確');
                    case 'auth/weak-password':
                        return setLoginError('密碼不可小於六位數');
                    case 'auth/email-already-in-use':
                        return setLoginError('此信箱已被使用');
                    default: setLoginError('註冊失敗')
                }
            });
    }

    return (
        <>
            <div className={`alert alert-danger ${loginError ? 'd-block' : 'd-none'}`} role="alert">
                {loginError}
            </div>
            <div className="mb-2">
                <label htmlFor="signUp_email" className="form-label w-100">Email</label>
                <input onChange={handleData} id="signUp_email" className="form-control" name="username" type="email" placeholder="Email Address" />

            </div>
            <div className="mb-2">
                <label htmlFor="signUp_password" className="form-label w-100">
                    密碼
                    <input onChange={handleData} type="password" className="form-control" name="password" id="signUp_password" placeholder="Password" />
                </label>
            </div>
            <button type="button" className="btn btn-primary" onClick={submit} >註冊</button>
        </>
    )
}