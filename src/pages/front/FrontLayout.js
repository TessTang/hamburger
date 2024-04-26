import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";

import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import AnimatedPage from "../../components/AnimatedPage";

import { FrontData, messageAlert } from "../../store/frontStore";
import { auth, db } from "../../utils/firebase";

export default function FrontLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState({ manager: false, user: null });
  const [userIsChecked, setUserIsChecked] = useState(false);
  const [cartIsChecked, setCartIsChecked] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  //確認是否登入，有登入setUser資料
  const checkUserData = async (data) => {
    if (!data) return;
    const docSnap = await getDoc(doc(db, "users", data.uid));
    if (docSnap.exists()) {
      setUser({ manager: docSnap.data().manager, user: docSnap.data() });
      setUserIsChecked(true);
    } else {
      messageAlert("warning", `噢!網頁使用者登入狀況出錯了`);
    }
  };

  //若登入了就取得購物車資料
  const getCart = useCallback(async () => {
    if (user.user) {
      try {
        const cartDoc = await getDoc(doc(db, "carts", user.user.uid));
        setCart(cartDoc.data() || []);
        setCartIsChecked(true);
      } catch (error) {
        messageAlert("warning", `噢!購物車內容出錯了${error}`);
      }
    }
  }, [user]);

  //getProduct data
  const getProducts = async () => {
    try {
      setIsLoading(true);
      const queryProducts = await getDocs(collection(db, "products"));
      const productsArray = queryProducts.docs.map((doc) => ({
        ...doc.data(),
      }));
      setAllProducts(productsArray);
      setIsLoading(false);
    } catch (error) {
      messageAlert("warning", `噢!取得產品出錯了${error}`);
    }
  };

  //check登入與管理
  useEffect(() => {
    getProducts();
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        checkUserData(currentUser);
      } else {
        setUserIsChecked(true);
      }
    });
  }, []);

  //有user資料後取得購物車資料
  useEffect(() => {
    getCart();
  }, [getCart]);

  return (
    <FrontData.Provider
      value={{
        isLoading,
        allProducts,
        cart,
        setCart,
        getCart,
        setIsLoading,
        user,
        setUser,
        checkUserData,
        userIsChecked,
        cartIsChecked,
      }}
    >
      {isLoading && <Loading />}
      <div className="position-relative">
        <Navbar />
      </div>
      <AnimatedPage>
        {" "}
        <Outlet />
      </AnimatedPage>
      {/* Footer */}
      <div className="bg-dark py-5 myFooter">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between text-white mb-4">
            <img
              className="footerLogo"
              src={require("../../assets/logo.png")}
              alt="logo"
              style={{ height: "50px" }}
            />
            <ul className="d-flex list-unstyled mb-0 h4">
              <li className="footerLogo px-3">
                <i className="bi bi-facebook" />
              </li>
              <li className="footerLogo px-3">
                <i className="bi bi-instagram" />
              </li>
              <li className="footerLogo px-3">
                <i className="bi bi-line" />
              </li>
            </ul>
          </div>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end align-items-start text-white">
            <div className="mb-md-0 mb-1">
              <p className="mb-0">01-2345-6789</p>
              <p className="mb-0">hamburger@mail.com</p>
            </div>
            <p className="mb-0"> 網頁僅供 project 使用 </p>
          </div>
        </div>
      </div>
    </FrontData.Provider>
  );
}
