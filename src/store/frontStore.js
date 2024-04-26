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
//購物車sweet alert跳出
export const delectMessageAlert = (text) => {
  Swal.fire({
    title: `確定刪除${text}?`,
    showCancelButton: true,
    confirmButtonText: "確認刪除",
    confirmButtonColor: "#e91717",
    cancelButtonText: `取消`,
  }).then((result) => {
    return result;
  });
};

export const linePayRequest = (data, id, user, url) => {
  (async () => {
    const changeLinePrice = () => {
      if (data.coupon?.deduct) {
        const changePrice = data.carts.findIndex((item) => {
          return item.total > data.coupon.deduct;
        });
        data.carts[changePrice].product.price =
          (data.carts[changePrice].total - data.coupon.deduct) /
          data.carts[changePrice].qty;
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
      if (getOrder.data.returnCode === "0000") {
        window.location.replace(getOrder.data.info.paymentUrl.web);
        messageAlert("success", "正在為您跳轉LinePay頁面", 10000);
      }
    } catch (error) {
      messageAlert("warning", `噢!有地方出錯了${error}`);
    }
  })();
};

export const checkLinePayPayment = (location, data, setDataOver) => {
  const searchParams = new URLSearchParams(location.search);
  const transactionId = searchParams.get("transactionId");
  const orderId = searchParams.get("orderId");
  (async () => {
    const res = await axios.post(
      "https://hamburger-node-js.onrender.com/linePay/confirm",
      {
        amount: data.order.final_total,
        orderId: orderId,
        transactionId: transactionId,
      },
    );
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
