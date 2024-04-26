import { useContext, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { signOut } from "firebase/auth";

import Button from "../../../components/Button";
import Banner from "../../../components/Banner";

import { FrontData } from "../../../store/frontStore";
import { auth } from "../../../utils/firebase";

export default function Member() {
  const navigate = useNavigate(null);
  const { user, setUser, setCart, userIsChecked } = useContext(FrontData);

  //未登入進入網址=>跳回首頁  無填寫過資料=>新增資料頁面
  useEffect(() => {
    if (userIsChecked) {
      if (!user.user) {
        navigate("../");
      } else if (user.user.realName === "") {
        navigate("/member/memberaddprofile");
      }
    }
  }, [user, userIsChecked]);

  return (
    <>
      <Banner bgImg="banner03.jpg" />
      <div className="d-flex" style={{ minHeight: "calc(100vh - 56px)" }}>
        <div className="bg-light col-3 col-md-2">
          <ul className="list-group list-group-flush">
            <Link
              className="list-group-item list-group-item-action py-3"
              to="/member/memberprofile"
            >
              <i className="bi bi-cup-fill me-2" />
              會員資料
            </Link>
            <Link
              className="list-group-item list-group-item-action py-3"
              to="/member/memberorders"
            >
              <i className="bi bi-ticket-perforated-fill me-2" />
              訂單資料
            </Link>
            <Button
              text="登出"
              bg="dark"
              myClass="mt-5 mx-auto w-75"
              click={() => {
                signOut(auth);
                setUser({});
                setCart([]);
                navigate("../");
              }}
            />
          </ul>
        </div>
        <div className="w-100 py-3">
          <Outlet />
        </div>
      </div>
    </>
  );
}
