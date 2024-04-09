import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from "firebase/auth";
import { motion } from "framer-motion";

import SignUp from "../components/SignUp";
import Banner from "../components/Banner";
import Button from "../components/Button";
import { auth, db } from "../utils/firebase";
import { fadeIn } from "../utils/variants";
import { FrontData, messageAlert } from "../store/frontStore";
import AnimatedPage from "../components/AnimatedPage";

export default function Login() {
  const navigate = useNavigate();

  const { user } = useContext(FrontData);

  const [loginError, setLoginError] = useState("");

  const [data, setData] = useState({
    username: "",
    password: "",
  });

  //check if login
  useEffect(() => {
    if (user.user) {
      navigate("/member/memberprofile");
    }
  });

  const handleData = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    try {
      signInWithEmailAndPassword(auth, data.username, data.password)
        .then(() => {
          messageAlert("success", "登入成功");
          navigate("../");
        })
        .catch((error) => {
          console.log(error);
          switch (error.code) {
            case "auth/invalid-email":
              return setLoginError("信箱格式不正確");
            case "auth/weak-password":
              return setLoginError("密碼錯誤");
            case "auth/invalid-credential":
              return setLoginError("密碼錯誤");
            case "auth/missing-password":
              return setLoginError("請輸入密碼");
            case "auth/user-not-found":
              return setLoginError("用戶不存在");
            default:
              setLoginError("登入失敗");
          }
        });
      // }
    } catch (error) {
      setLoginError(error.response.data.message);
    }
  };

  const setFireStore = async (userData) => {
    try {
      await setDoc(doc(db, "users", userData.uid), {
        displayName: userData.displayName ? userData.displayName : "",
        realName: "",
        email: userData.email,
        phoneNumber: "",
        address: "",
        orders: [],
        manager: false,
        uid: userData.uid,
      });
      messageAlert("success", "註冊成功");
      navigate("/member/memberaddprofile");
    } catch (err) {
      console.error("匯入Error: ", err);
    }
  };

  const googleSign = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { isNewUser } = getAdditionalUserInfo(result);
      if (isNewUser) {
        setFireStore(result.user);
      } else {
        messageAlert("success", "登入成功");
        navigate("/products");
      }
    } catch (error) {
      console.log("googlesignuperror", error);
    }
  };

  return (
    <AnimatedPage>
      {" "}
      <Banner bgImg="https://nunforest.com/fast-foody/burger/upload/banners/ban2.jpg" />
      <motion.div
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        animate="show"
        className="container py-5 full-height d-flex flex-column align-items-center"
      >
        <Tabs
          defaultActiveKey="signin"
          className="mb-3 fs-3"
          onClick={() => {
            setLoginError("");
            setData({});
          }}
        >
          <Tab eventKey="signin" title="登入">
            <div className="text-center">
              <Button
                text="使用Google帳號登入"
                click={googleSign}
                myClass="p-2"
                bg="success"
              />
            </div>
            <hr />
            <div>
              <div
                className={`alert alert-danger ${loginError ? "d-block" : "d-none"}`}
                role="alert"
              >
                {loginError}
              </div>
              <div className="mb-2">
                <label htmlFor="email" className="form-label w-100">
                  Email
                </label>
                <input
                  onChange={handleData}
                  id="email"
                  className="form-control"
                  name="username"
                  type="email"
                  placeholder="Email Address"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="password" className="form-label w-100">
                  密碼
                </label>
                <input
                  onChange={handleData}
                  type="password"
                  className="form-control"
                  name="password"
                  id="password"
                  placeholder="Password"
                />
              </div>
              <Button text="登入" click={submit} myClass="p-2" bg="primary" />
            </div>
          </Tab>
          <Tab eventKey="signup" title="註冊">
            <SignUp
              loginError={loginError}
              setLoginError={setLoginError}
              setFireStore={setFireStore}
              googleSign={googleSign}
            />
          </Tab>
        </Tabs>
      </motion.div>
      <motion.div
        variants={fadeIn("right", 0.8)}
        initial="hidden"
        animate="show"
        className="position-absolute login_deco top-50"
      >
        <img
          src="https://modinatheme.com/html/foodking-html/assets/img/shape/patato-shape.png"
          alt="deco"
        />
      </motion.div>
    </AnimatedPage>
  );
}
