import { useContext, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../utils/firebase";
import { FrontData } from "../../../store/frontStore";
import Button from "../../../components/Button";

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
      <div className="container-fluid bg-secondary px-0 mt-2">
        <img
          className="img-fluid"
          src={require("../../../assets/banner.jpg")}
          alt="banners"
        />
      </div>
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
              myClass="mt-5 mx-2"
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
