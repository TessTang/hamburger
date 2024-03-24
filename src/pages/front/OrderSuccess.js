import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { checkLinePayPayment } from "../../store/frontStore";

export default function OrderSuccess() {
  const { id } = useParams();
  const [orderData, setOrderData] = useState([]);
  const [orderDataLoaded, setOrderDataLoaded] = useState(false);
  const [dataOver, setDataOver] = useState(false);
  const location = useLocation();

  //取得訂單資料
  const getOrder = async (id) => {
    try {
      const order = await getDoc(doc(db, "orders", id));
      if (order.exists()) {
        setOrderData(order.data());
        setOrderDataLoaded(true);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //照網址id取得對應order資料，待若是linepay確認完付款後再次刷新
  useEffect(() => {
    getOrder(id);
  }, [id, dataOver]);

  //是否linepay? 否=>不動  是=>確認使否已付款  已付款=>顯示已付款&更正資料庫資料
  //先確認是否資料庫已更改
  useEffect(() => {
    if (orderData.payBy === "linePay") {
      if (location.search) {
        checkLinePayPayment(location, orderData, setDataOver);
      }
    }
  }, [orderDataLoaded, location, id]);

  return (
    <>
      <div className="container-fluid bg-secondary px-0 mt-2">
        <img
          className="img-fluid"
          src="https://nunforest.com/fast-foody/burger/upload/banners/ban2.jpg"
          alt="banners"
        />
      </div>
      <div className="container full-height">
        <div className="mt-5 mb-7">
          <div className="row">
            <div className="col-md-6">
              <h2>餐點選購成功</h2>
              {orderData?.is_paid && (
                <h4 className="text-success">已付款完成</h4>
              )}
              <p className="text-muted">
                親愛的顧客，感謝您在本平台訂餐。我們非常感激您對我們的信任和支持，讓我們有機會為您提供美味的餐點和優質的服務。
              </p>
              <p className="text-muted">
                感謝您選擇本平台，祝您用餐愉快，生活愉快！
              </p>
              <Link to="/" className="btn btn-dark me-2 mb-4">
                回到首頁
              </Link>
            </div>
            <div className="col-md-6">
              <div className="card rounded-0 py-4">
                <div className="card-header border-bottom-0 bg-white px-4 py-0">
                  <h2>選購餐點細節</h2>
                </div>
                <div className="card-body px-4 py-0">
                  <ul className="list-group list-group-flush">
                    {orderData.order?.carts.map((item) => {
                      return (
                        <li
                          className="list-group-item px-0"
                          key={item.product.id}
                        >
                          <div className="d-flex mt-2">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.title}
                              className="me-2"
                              style={{ width: "80px", height: "50px" }}
                            />
                            <div className="w-100 d-flex flex-column">
                              <div className="d-flex justify-content-between fw-bold">
                                <h5>{item.product.title}</h5>
                                <p className="mb-0">x{item.qty}</p>
                              </div>
                              <div className="d-flex justify-content-between mt-auto">
                                <p className="text-muted mb-0">
                                  <small>NT${item.product.price}</small>
                                </p>
                                <p className="mb-0">
                                  NT${item.total.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                    {orderData.order?.coupon?.deduct && (
                      <li className="list-group-item px-0 pb-0">
                        <div className="d-flex justify-content-between mt-2">
                          <p className="mb-0 fw-bold">優惠券</p>
                          <p className="mb-0 fw-bold">
                            NT${orderData.order?.coupon.deduct}
                          </p>
                        </div>
                      </li>
                    )}

                    <li className="list-group-item px-0 pb-0">
                      <div className="d-flex justify-content-between mt-2">
                        <p className="mb-0 h4 fw-bold">總計</p>
                        <p className="mb-0 h4 fw-bold">
                          NT${orderData.order?.final_total.toLocaleString()}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
