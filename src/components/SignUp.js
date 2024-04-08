import { useState } from "react";
import { auth } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Button from "./Button";

export default function SignUp({
  loginError,
  setLoginError,
  setFireStore,
  googleSign,
}) {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handleData = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    createUserWithEmailAndPassword(auth, data.username, data.password)
      .then((res) => {
        setFireStore(res.user);
      })
      .catch((error) => {
        console.log(error.code);
        switch (error.code) {
          case "auth/invalid-email":
            return setLoginError("信箱格式不正確");
          case "auth/weak-password":
            return setLoginError("密碼不可小於六位數");
          case "auth/email-already-in-use":
            return setLoginError("此信箱已被使用");
          default:
            setLoginError("註冊失敗");
        }
      });
  };

  return (
    <>
      <div className="text-center">
        <Button
          text="使用Google帳號登入"
          click={googleSign}
          myClass="p-2"
          bg="success"
        />
      </div>
      <hr />
      <div
        className={`alert alert-danger ${loginError ? "d-block" : "d-none"}`}
        role="alert"
      >
        {loginError}
      </div>
      <div className="mb-2">
        <label htmlFor="signUp_email" className="form-label w-100">
          Email
        </label>
        <input
          onChange={handleData}
          id="signUp_email"
          className="form-control"
          name="username"
          type="email"
          placeholder="Email Address"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="signUp_password" className="form-label w-100">
          密碼
          <input
            onChange={handleData}
            type="password"
            className="form-control"
            name="password"
            id="signUp_password"
            placeholder="Password"
          />
        </label>
      </div>
      <Button text="註冊" click={submit} myClass="p-2" bg="primary" />
    </>
  );
}
