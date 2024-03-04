import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { successAlert } from "../store/frontStore"

export default function SignUp({ loginError, setLoginError }) {

    const navigate = useNavigate();
    const [data, setData] = useState({
        "username": '',
        "password": ''
    })

    const handleData = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }


    const setFireStore = async (userData) => {
        try {
            await setDoc(doc(db, "users", userData.uid), {
                'displayName': userData.displayName? userData.displayName: '',
                'realName': '',
                'email': userData.email,
                'phoneNumber': '',
                'address': '',
                'orders': [],
                'manerger': false,
                'uid': userData.uid
            });
            successAlert('註冊成功');
            navigate('/member/memberaddprofile')
        }
        catch (err) {
            console.error("匯入Error: ", err);
        }
    }

    const submit = (e) => {
        createUserWithEmailAndPassword(auth, data.username, data.password)
            .then((res) => {
                setFireStore(res.user)
            }
            )
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

    const googleSignUp = async()=>{
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            setFireStore(result.user)
            console.log('signupresult', result)
        } catch (error) {
            console.log('googlesignuperror', error)
        }
    }



    return (
        <>

            <div className="text-center">
                <button
                onClick={googleSignUp}
                className="btn btn-success border p-2">
                    <i className="bi bi-google me-2" />
                    使用Google帳號註冊
                    </button>
            </div>
            <hr />
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