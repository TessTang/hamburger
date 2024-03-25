import { createContext } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { doc, updateDoc } from "@firebase/firestore";
import { db } from "../utils/firebase";

export const FrontData = createContext({});

//sweet alert跳出
export const messageAlert = (type, text, time = 1000) => {
  if (type === "success") {
    Swal.fire({
      icon: "success",
      title: text,
      showConfirmButton: false,
      timer: time,
    });
  } else if (type === "error") {
    Swal.fire({
      icon: "error",
      title: text,
      showConfirmButton: false,
      timer: time,
    });
  } else if (type === "warning") {
    Swal.fire({
      icon: "warning",
      title: text,
      showConfirmButton: false,
      timer: time,
    });
  }
};

//若有COUPON時，為了LINEPAY的規則，將其中一個大於COUPON金額的PRODUCT變為數量1 價格原TOTAL-COUPON
export const linePayRequest = (data, id, user, url) => {
  (async () => {
    const changeLinePrice = () => {
      if (data.coupon?.deduct) {
        const changePrice = data.carts.findIndex((item) => {
          return item.total > data.coupon.deduct;
        });
        data.carts[changePrice].qty = 1;
        data.carts[changePrice].product.price =
          (data.carts[changePrice].total - data.coupon.deduct) 
      }
      return data.carts?.map((item) => {
        return {
          id: item.product.id,
          name: item.product.title,
          quantity: item.qty,
          price: item.product.price,
        };
      });
    };
    try {
      const getOrder = await axios.post(

        // `http://localhost:2407/createOrder/${id}`,
        `https://hamburger-node-js.onrender.com/createOrder/${id}`,
        {
          amount: data.final_total,
          currency: "TWD",
          orderId: id,
          packages: [
            {
              id: user,
              amount: data.final_total,
              products: changeLinePrice(),
            },
          ],
          redirectUrls: {
            confirmUrl: url,
            cancelUrl: url,
          },
        },
      );
      messageAlert("success", "稍等一下，正在為確認LinePay資訊", 10000);
      if (getOrder.data.returnCode === "0000") {
        messageAlert("success", "正在為您跳轉LinePay頁面", 1000);
        window.location.replace(getOrder.data.info.paymentUrl.web);
      } else {
        console.log(getOrder);
      }
    } catch (err) {
      console.log("err", err);
    }
  })();
};

export const checkLinePayPayment = (location, data, setDataOver) => {
  const searchParams = new URLSearchParams(location.search);
  const transactionId = searchParams.get("transactionId");
  const orderId = searchParams.get("orderId");
  (async () => {
    // const res = await axios.post("http://localhost:2407/linePay/confirm", {
    const res = await axios.post("https://hamburger-node-js.onrender.com/linePay/confirm", {
      amount: data.order.final_total,
      orderId: orderId,
      transactionId: transactionId,
    });
    if (res.data.returnCode === "0000") {
      const order = doc(db, "orders", orderId);
      await updateDoc(order, {
        paid_date: new Date().getTime(),
        is_paid: true,
      });
      setDataOver && setDataOver(true);
    }
  })();
};
