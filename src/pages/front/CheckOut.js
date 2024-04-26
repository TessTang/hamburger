import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { motion } from "framer-motion";

import Banner from "../../components/Banner";
import Button from "../../components/Button";

import { FrontData, linePayRequest } from "../../store/frontStore";
import { messageAlert } from "../../store/frontStore";
import { db } from "../../utils/firebase";
import { fadeIn } from "../../utils/variants";

export default function CheckOut() {
  const navigate = useNavigate();
  const [payment, setPayment] = useState("");
  const { cart, user, checkUserData, getCart } = useContext(FrontData);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  //將購物車資料寫入orders中
  //此order id寫入user資料內
  //刪除此購物車資料
  //若LINEPAY轉向LINEPAY頁面，貨到付款直接轉向訂單成功頁面

  const onSubmit = async (userData) => {
    const newOrder = doc(collection(db, "orders"));
    await setDoc(newOrder, {
      is_paid: false,
      paid_date: 0,
      create_at: new Date().getTime(),
      id: newOrder.id,
      order: { ...cart },
      status: 0,
      orderContact: {
        name: userData.name,
        email: userData.email,
        tel: userData.tel,
        address: userData.address,
      },
      user: user.user?.uid,
      payBy: userData.pay,
      message: userData.message,
    });

    await updateDoc(doc(db, "users", user.user.uid), {
      ...user.user,
      orders: [...user.user.orders, newOrder.id],
    });

    checkUserData(user.user);

    await deleteDoc(doc(db, "carts", user.user.uid));

    if (userData.pay === "linePay") {
      messageAlert("success", "正在為您跳轉LinePay頁面", 30000);
      linePayRequest(
        cart,
        newOrder.id,
        user.user.uid,
        `https://tesstang.github.io/hamburger/#/ordersuccess/${newOrder.id}`,
      );
      getCart();
      return;
    }
    getCart();
    navigate(`/ordersuccess/${newOrder.id}`);
  };

  useEffect(() => {
    setValue("name", user.user?.realName);
    setValue("email", user.user?.email);
    setValue("tel", user.user?.phoneNumber);
    setValue("address", user.user?.address);
    setValue("message", "");
  }, [user]);

  return (
    <>
      <Banner bgImg="banner01.jpg" />
      <motion.div initial="hidden" animate="show" className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <motion.h3
              variants={fadeIn("up", 0.1)}
              className="fw-bold mb-4 pt-3"
            >
              確認訂單
            </motion.h3>
          </div>
        </div>
        <div className="row flex-row-reverse justify-content-center pb-5">
          {/* right side */}
          <motion.div variants={fadeIn("left", 0.2)} className="col-md-4">
            <div className="border p-4 mb-4">
              {cart.carts?.map((item) => {
                return (
                  <div className="d-flex mt-2" key={item.product.id}>
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="me-2"
                      style={{
                        width: "48px",
                        height: "48px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="w-100">
                      <div className="d-flex justify-content-between">
                        <p className="mb-0 fw-bold">{item.product.title}</p>
                        <p className="mb-0">
                          NT$ {item.total.toLocaleString()}
                        </p>
                      </div>
                      <p className="mb-0 fw-bold">x{item.qty}</p>
                    </div>
                  </div>
                );
              })}

              <table className="table mt-4 border-top border-bottom text-muted">
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
                  {cart.coupon?.deduct && (
                    <tr>
                      <th
                        scope="row"
                        className="border-0 px-0 pt-4 font-weight-normal"
                      >
                        優惠券折抵
                      </th>
                      <td className="text-end border-0 px-0 pt-4">
                        NT$ {cart.coupon.deduct}
                      </td>
                    </tr>
                  )}

                  <tr>
                    <th
                      scope="row"
                      className="border-0 px-0 pt-0 pb-4 font-weight-normal"
                    >
                      付款方式
                    </th>
                    <td className="text-end border-0 px-0 pt-0 pb-4">
                      {payment}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="d-flex justify-content-between mt-4">
                <p className="mb-0 h4 fw-bold">總金額</p>
                <p className="mb-0 h4 fw-bold">
                  NT$&nbsp;
                  {cart.final_total ? cart.final_total?.toLocaleString() : "0"}
                </p>
              </div>
            </div>
          </motion.div>
          {/* left side */}
          <motion.div variants={fadeIn("right", 0.2)} className="col-md-6">
            <form>
              <p>聯絡資訊</p>
              <div className="mb-0">
                <label htmlFor="ContactMail" className="text-muted mb-0">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control "
                  id="ContactMail"
                  placeholder="123@gmail.com"
                  name="email"
                  {...register("email", {
                    required: { value: true, message: "請填寫喔!" },
                    pattern: {
                      value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                      message: "e-mail格式錯誤",
                    },
                  })}
                />
                <p className="errorAlert">{errors.email?.message}</p>
              </div>
              <div className="mb-2">
                <label htmlFor="ContactName" className="text-muted mb-0">
                  姓名
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="ContactName"
                  placeholder="ex:王小明"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="errorAlert">
                    請填寫
                    <i className="bi bi-hand-index-fill" />
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label htmlFor="ContactAddress" className="text-muted mb-0">
                  地址
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="ContactAddress"
                  placeholder="ex:台中市..."
                  {...register("address", { required: true })}
                />
                {errors.address && (
                  <p className="errorAlert">
                    請填寫
                    <i className="bi bi-hand-index-fill" />
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label htmlFor="ContactPhone" className="text-muted mb-0">
                  電話
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="ContactPhone"
                  placeholder="ex:0912345678"
                  {...register("tel", {
                    required: { value: true, message: "請填寫喔!" },
                    pattern: {
                      value: /^09\d{8}$/,
                      message: "請填寫手機號碼，09開頭10碼數字",
                    },
                  })}
                />
                {errors.tel && (
                  <p className="errorAlert">
                    {errors.tel?.message}
                    <i className="bi bi-hand-index-fill" />
                  </p>
                )}
              </div>
              <div className="mb-2">
                <p>付款方式</p>
                <div>
                  <input
                    onClick={() => {
                      setPayment("貨到付款");
                    }}
                    type="radio"
                    id="onDelivery"
                    value="onDelivery"
                    className="form-check-input"
                    {...register("pay", { required: true })}
                  />
                  <label htmlFor="onDelivery" className="ms-2 form-check-label">
                    貨到付款
                  </label>
                </div>
                <div>
                  <input
                    onClick={() => {
                      setPayment("Line Pay");
                    }}
                    type="radio"
                    id="linePay"
                    value="linePay"
                    className="form-check-input"
                    {...register("pay", { required: true })}
                  />
                  <label htmlFor="linePay" className="ms-2 form-check-label">
                    Line Pay
                  </label>
                </div>
                {errors.pay && (
                  <p className="errorAlert">
                    請選擇
                    <i className="bi bi-hand-index-fill" />
                  </p>
                )}
              </div>

              <div className="mb-2">
                <label htmlFor="ContactMessage" className="text-muted mb-0">
                  備註
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  id="ContactMessage"
                  placeholder="備註事項"
                  {...register("message")}
                />
              </div>
            </form>
          </motion.div>
          <div className="d-flex flex-column-reverse flex-md-row mt-4 justify-content-between align-items-md-center align-items-end w-100">
            <Link to={"/products"} className="text-dark mt-md-0 mt-3">
              <i className="bi bi-chevron-left" /> 回到產品頁面
            </Link>
            <Button
              text="送出訂單"
              myClass="py-3 px-7"
              click={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}
