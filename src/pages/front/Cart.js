import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";

import Button from "../../components/Button";
import Banner from "../../components/Banner";

import { FrontData, messageAlert } from "../../store/frontStore";
import { db } from "../../utils/firebase";
import { fadeIn } from "../../utils/variants";

export default function Cart() {
  const { cart, getCart, user, userIsChecked } = useContext(FrontData);
  const [message, setMessage] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  //增減數量
  const changeQty = (item, type) => {
    const thisItem = cart.carts.findIndex(
      (product) => product.product.id === item.product.id,
    );
    if (type === "plus") {
      putQty({
        ...cart,
        carts: cart.carts.map((item, index) => {
          if (index === thisItem) {
            return {
              ...cart.carts[thisItem],
              qty: cart.carts[thisItem].qty + 1,
              total: (cart.carts[thisItem].total += item.product.price),
            };
          }
          return item;
        }),
        total: (cart.total += item.product.price),
        final_total: (cart.final_total += item.product.price),
      });
    } else {
      if (item.qty !== 1) {
        putQty({
          ...cart,
          carts: cart.carts.map((item, index) => {
            if (index === thisItem) {
              return {
                ...cart.carts[thisItem],
                qty: cart.carts[thisItem].qty - 1,
                total: cart.carts[thisItem].total - item.product.price,
              };
            }
            return item;
          }),
          total: cart.total - item.product.price,
          final_total: cart.final_total - item.product.price,
        });
      }
    }
  };

  //將增減數量加入資料庫並獲得更新資料
  const putQty = async (data) => {
    try {
      await updateDoc(doc(db, "carts", user.user.uid), data);
      getCart();
    } catch (error) {
      messageAlert("warning", `噢!有地方出錯了${error}`);
    }
  };

  //刪除
  const deleteCart = (id, title) => {
    Swal.fire({
      icon: "question",
      title: `確定刪除${title}?`,
      showCancelButton: true,
      confirmButtonText: "刪除",
      confirmButtonColor: "#e91717",
      cancelButtonText: `取消`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const thisItem = cart.carts.findIndex(
          (product) => product.product.id === id,
        );
        try {
          await updateDoc(doc(db, "carts", user.user.uid), {
            ...cart,
            carts: cart.carts.filter((item, index) => index !== thisItem),
            total:
              cart.carts.map((item) => item.total).reduce((a, b) => a + b) -
              cart.carts[thisItem].total,
            final_total:
              cart.carts.map((item) => item.total).reduce((a, b) => a + b) -
              cart.carts[thisItem].total -
              (cart.coupon?.deduct ? cart.coupon.deduct : 0),
          });
          getCart();
          messageAlert("success", `已刪除${title}`);
        } catch (error) {
          messageAlert("warning", `噢!網頁有地方出錯了${error}`);
        }
      }
    });
  };

  //輸入coupon
  //1.確認是否有此coupon
  //2.確認coupon是否過期
  //3.確認coupon最低可使用金額

  const [data, setData] = useState({});
  const submitCoupon = async () => {
    if (!data.code) {
      setMessage({ type: "error", message: "請輸入優惠券" });
      return;
    }
    try {
      const couponData = await getDoc(doc(db, "coupons", data.code));
      if (couponData.exists()) {
        if (couponData.data().due_date > data.date.getTime()) {
          if (cart.final_total < couponData.data().minimum) {
            return setMessage({
              type: "error",
              message: `消費金額須大於NTD$ ${couponData.data().minimum}`,
            });
          }
          try {
            await updateDoc(doc(db, "carts", user.user.uid), {
              ...cart,
              coupon: couponData.data(),
              final_total:
                cart.carts.map((item) => item.total).reduce((a, b) => a + b) -
                couponData.data().deduct,
            });
            getCart();
            setMessage({ type: "success", message: "已套用優惠券" });
          } catch (error) {
            messageAlert("warning", `噢!網頁有地方出錯了${error}`);
          }
        } else {
          setMessage({
            type: "error",
            message: `優惠券 "${data.code}" 已過期`,
          });
        }
      } else {
        setMessage({ type: "error", message: `優惠券 "${data.code}" 不存在` });
      }
    } catch (error) {
      setMessage({ type: "error", message: error.response.data.message });
    }
  };

  //進入頁面確認是否已登入
  useEffect(() => {
    if (userIsChecked) {
      if (!user.user) {
        messageAlert("warning", "請先登入喔!");
        navigate("../login");
      }
    }
  }, [cart, userIsChecked, user, navigate]);

  return (
    <>
      <Banner bgImg="banner01.jpg" />
      <div className="container full-height">
        <motion.div initial="hidden" animate="show" className="mt-3">
          <motion.h3
            variants={fadeIn("up", 0.1)}
            className="mt-3 mb-4 fs-2 fw-bold"
          >
            購物車
          </motion.h3>
          {!cart.carts || cart.carts?.length === 0 ? (
            <div className="fs-4 mt-5">購物車是空的喔!</div>
          ) : (
            <div className="row">
              {/* LEFT SECTION */}
              <motion.div variants={fadeIn("right", 0.2)} className="col-md-8">
                <table className="table text-center">
                  <thead>
                    <tr className="text-center">
                      <th scope="col" className="border-0 ps-0">
                        品項
                      </th>
                      <th scope="col" className="border-0">
                        數量
                      </th>
                      <th scope="col" className="border-0">
                        金額
                      </th>
                      <th scope="col" className="border-0" />
                    </tr>
                  </thead>
                  <tbody>
                    {cart.carts?.map((item) => {
                      return (
                        <tr
                          className="border-bottom border-top"
                          key={item.product.id}
                        >
                          <th
                            scope="row"
                            className="border-0 px-0 py-4 d-flex flex-column flex-md-row column-gap-2 align-items-md-center"
                          >
                            <img
                              className="col-md-5"
                              src={item.product.imageUrl}
                              alt={item.product.title}
                              style={{
                                width: "90px",
                                height: "72px",
                                objectFit: "cover",
                                margin: "0 auto",
                              }}
                            />
                            <p className="col-md-7 mb-0 fw-bold">
                              {item.product.title}
                            </p>
                          </th>
                          <td
                            className="border-0 align-middle px-xl-5"
                            style={{ maxWidth: "160px" }}
                          >
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <button
                                  className="btn btn-outline-primary border-0 py-2"
                                  type="button"
                                  onClick={() => {
                                    changeQty(item, "min");
                                  }}
                                >
                                  <i className="bi bi-dash fs-5" />
                                </button>
                              </div>
                              <input
                                type="text"
                                className="form-control border-0 text-center my-auto shadow-none p-0"
                                value={item.qty}
                                readOnly
                              />
                              <div className="input-group-append">
                                <button
                                  className="btn btn-outline-primary border-0 py-2"
                                  type="button"
                                  onClick={() => {
                                    changeQty(item, "plus");
                                  }}
                                >
                                  <i className="bi bi-plus fs-5" />
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="border-0 align-middle">
                            <p className="mb-0 ms-auto">
                              NT$ {item.total.toLocaleString()}
                            </p>
                          </td>
                          <td className="border-0 align-middle position-relative">
                            <button
                              type="button"
                              className="cartDeleteBtn btn btn-outline-primary border-0 py-2"
                              onClick={() => {
                                deleteCart(item.product.id, item.product.title);
                              }}
                            >
                              <i className="bi bi bi-x-lg" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="input-group w-50 mb-3">
                  <input
                    onChange={(e) => {
                      setData({ date: new Date(), code: e.target.value });
                    }}
                    type="text"
                    className="form-control rounded-0 border-bottom border-top-0 border-start-0 border-end-0 shadow-none me-2"
                    placeholder="優惠券"
                  />
                  <div className="input-group-append">
                    <Button
                      text={<i className="bi bi-send" />}
                      myClass="p-2"
                      click={submitCoupon}
                    />
                  </div>
                </div>
                <p
                  className={`errorAlert ${message.type === "error" ? "d-block" : "d-none"}`}
                >
                  {message.message}
                </p>
              </motion.div>

              {/* RIGHT SECTION */}
              <motion.div variants={fadeIn("left", 0.2)} className="col-md-4">
                <div className="border p-4 mb-4">
                  <h4 className="fw-bold">訂單資訊</h4>
                  <table className="table text-muted border-bottom">
                    <tbody>
                      <tr>
                        <th
                          scope="row"
                          className="border-0 px-0 pt-4 font-weight-normal"
                        >
                          小計
                        </th>
                        <td className="text-end border-0 px-0 pt-4">
                          NT$ {cart.total?.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <th
                          scope="row"
                          className="border-0 px-0 pt-0 pb-4 font-weight-normal"
                        >
                          {cart.total > cart.final_total
                            ? `已套用優惠券[${cart.coupon.title}]`
                            : "優惠券"}
                        </th>
                        <td className="text-end border-0 px-0 pt-0 pb-4">
                          NT$ {cart.total - Math.ceil(cart.final_total)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-between mt-4">
                    <p className="mb-0 h4 fw-bold">總金額</p>
                    <p className="mb-0 h4 fw-bold">
                      NT$&nbsp;
                      {cart.final_total ? cart.final_total.toLocaleString() : 0}
                    </p>
                  </div>
                  <Button
                    text="確認訂單"
                    myClass="w-100 mt-4 py-2"
                    linkto="/checkout"
                  />
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
