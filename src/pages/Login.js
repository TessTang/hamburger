import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const navigate = useNavigate();

    const [loginError, setLoginError] = useState('')

    const [data, setData] = useState({
        "username": '',
        "password": ''
    })

    const handleData = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const submit = async (e) => {
        try {
            const response = await axios.post('/v2/admin/signin', data);
            const { token, expired } = response.data;
            document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
            navigate('/admin/products')

        } catch (error) {
            setLoginError(error.response.data.message);
        }
    }

    return (<div className="container py-5">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <h2>登入帳號</h2>

                <div className={`alert alert-danger ${loginError? 'd-block':'d-none'}`} role="alert">
                    {loginError}
                </div>
                <div className="mb-2">
                    <label htmlFor="email" className="form-label w-100">
                        Email
                        <input onChange={handleData} id="email" className="form-control" name="username" type="email" placeholder="Email Address" />
                    </label>
                </div>
                <div className="mb-2">
                    <label htmlFor="password" className="form-label w-100">
                        密碼
                        <input onChange={handleData} type="password" className="form-control" name="password" id="password" placeholder="Password" />
                    </label>
                </div>
                <button type="button" className="btn btn-primary" onClick={submit} >登入</button>
            </div>
        </div>
    </div>)
}
