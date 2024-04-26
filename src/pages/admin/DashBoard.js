import { useEffect, useReducer } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

import Message from "../../components/Message";

import {
  MessageContext,
  initState,
  messageReducer,
} from "../../store/messageStore";
import { auth, db } from "../../utils/firebase";

export default function Dashboard() {
  const navigate = useNavigate();
  const reducer = useReducer(messageReducer, initState);

  //確認現在登入者，若不是manager要轉回首頁
  useEffect(() => {
    const checkUserData = async (data) => {
      const docSnap = await getDoc(doc(db, "users", data.uid));
      if (docSnap.exists()) {
        docSnap.data().manager || navigate("../");
        return;
      }
      alert("No users data");
    };

    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        checkUserData(currentUser);
        return;
      }
      navigate("../");
    });
  }, []);

  return (
    <MessageContext.Provider value={reducer}>
      <Message />
      <nav className="navbar navbar-expand-lg bg-dark">
        <div className="container-fluid">
          <p className="text-white mb-0">HEX EATS 後台管理系統</p>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-sm btn-light"
                  onClick={() => {
                    signOut(auth);
                  }}
                >
                  登出
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="d-flex" style={{ minHeight: "calc(100vh - 56px)" }}>
        <div className="bg-light" style={{ width: "200px" }}>
          <ul className="list-group list-group-flush">
            <Link
              className="list-group-item list-group-item-action py-3"
              to="/admin/products"
            >
              <i className="bi bi-cup-fill me-2" />
              產品列表
            </Link>
            <Link
              className="list-group-item list-group-item-action py-3"
              to="/admin/coupons"
            >
              <i className="bi bi-ticket-perforated-fill me-2" />
              優惠卷列表
            </Link>
            <Link
              className="list-group-item list-group-item-action py-3"
              to="/admin/orders"
            >
              <i className="bi bi-receipt me-2" />
              訂單列表
            </Link>
            <Link
              className="list-group-item list-group-item-action py-3"
              to="/admin/blogs"
            >
              <i className="bi bi-receipt me-2" />
              文章列表
            </Link>
            <Link to="../" className="btn btn-dark mt-5">
              回前台
            </Link>
          </ul>
        </div>
        <div className="w-100">{<Outlet />}</div>
      </div>
    </MessageContext.Provider>
  );
}
