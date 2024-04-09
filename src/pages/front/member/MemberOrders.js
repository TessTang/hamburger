import { useContext, useState, useRef, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useLocation } from "react-router";
import { Modal } from "bootstrap";
import {
  getDocs,
  doc,
  collection,
  where,
  query,
  getDoc,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { FrontData } from "../../../store/frontStore";
import { checkLinePayPayment } from "../../../store/frontStore";
import MemberOrderModal from "../../../components/MemberOrderModal";
import Button from "../../../components/Button";

export default function MemberOrders() {
  const { user } = useContext(FrontData);
  const [userOrder, setUserOrder] = useState([]);
  const [dataOver, setDataOver] = useState(false);
  const [tempOrder, setTempOrder] = useState({});
  const memberOrderModal = useRef(null);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  //將資料庫日期格式轉換
  const changeDate = (time) => {
    const date = new Date(time);
    // 格式化日期
    const year = date.getFullYear(); // 取得年份
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 取得月份，並補齊為兩位數
    const day = String(date.getDate()).padStart(2, "0"); // 取得日期，並補齊為兩位數

    // 產生最終格式的日期字串
    const formattedDate = `${year}/${month}/${day}`;

    return formattedDate;
  };

  //打開訂單資料modal，傳送對應order資料
  const openOrderModal = (order) => {
    setTempOrder(order);
    memberOrderModal.current.show();
  };

  //關閉資料modal
  const closeOrderModal = () => {
    setTempOrder({});
    memberOrderModal.current.hide();
  };

  //將資料以30個為一組搜尋
  function chunkArray(array, size) {
    const chunkedArr = [];
    let index = 0;
    while (index < array.length) {
      chunkedArr.push(array.slice(index, index + size));
      index += size;
    }
    return chunkedArr;
  }

  //若以linepay後網址進入的就用linepay網址資訊查詢是否付款成功
  //進入確認螢幕大小，若螢幕太小就將不必要的格子隱藏
  useEffect(() => {
    if (location.search) {
      const searchParams = new URLSearchParams(location.search);
      const orderId = searchParams.get("orderId");
      (async () => {
        const docSnap = await getDoc(doc(db, "orders", orderId));
        checkLinePayPayment(location, docSnap.data(), setDataOver);
      })();
    }
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [location]);

  //拿取會員對應訂單資料
  useEffect(() => {
    memberOrderModal.current = new Modal("#memberOrderModal");
    if (user.user) {
      const idIndexMap = new Map();
      user.user?.orders.forEach((id, index) => {
        idIndexMap.set(id, index);
      });

      const getOrder = async () => {
        try {
          const orders = [];
          const chunks = chunkArray(user.user.orders, 30);
          for (const chunk of chunks) {
            const querySnapshot = await getDocs(
              query(collection(db, "orders"), where("id", "in", chunk)),
            );

            querySnapshot.docs.forEach((doc) => {
              const orderData = doc.data();
              const index = idIndexMap.get(orderData.id);
              if (index !== undefined) {
                orders[index] = orderData;
              }
            });
          }
          setUserOrder(orders.reverse());
        } catch (error) {
          console.log(error);
        }
      };
      getOrder();
    }
  }, [user, dataOver]);

  return (
    <>
      <h3>
        <i className="bi bi-journal-check" />
        訂單資料
        <i className="bi bi-journal-check" />
      </h3>
      <MemberOrderModal
        closeOrderModal={closeOrderModal}
        tempOrder={tempOrder}
        changeDate={changeDate}
      />
      <div className="px-3">
        {user.user?.orders.length ? (
          <Table striped bordered hover variant="info">
            <thead>
              <tr>
                <th>#</th>
                <th>訂單號</th>
                {!isMobile && <th>訂單日</th>}
                {!isMobile && <th>訂單狀態</th>}
                {!isMobile && <th>付款狀態</th>}
                {!isMobile && <th>訂單金額</th>}
                <th>查看詳情</th>
              </tr>
            </thead>
            <tbody>
              {userOrder.map((item, idx) => {
                return (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>{item.id}</td>
                    {!isMobile && <td>{changeDate(item.create_at)}</td>}
                    {!isMobile && (
                      <td>
                        {(() => {
                          switch (item.status) {
                            case 0:
                              return "未確認";
                            case 1:
                              return "已確認";
                            case 2:
                              return "外送中";
                            case 3:
                              return "已送達";
                            default:
                              return "";
                          }
                        })()}
                      </td>
                    )}
                    {!isMobile && (
                      <td>
                        {item.is_paid ? (
                          <span className="text-success fw-bolder">已付款</span>
                        ) : (
                          <span className="text-danger fw-bolder">未付款</span>
                        )}
                      </td>
                    )}
                    {!isMobile && (
                      <td>{item.order.final_total?.toLocaleString()}</td>
                    )}
                    <td>
                      <Button
                        text="查看"
                        myClass="text-dark mx-auto"
                        click={() => {
                          openOrderModal(item);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <div>尚未有訂單</div>
        )}
      </div>
    </>
  );
}
