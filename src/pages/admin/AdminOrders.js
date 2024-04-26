import { useCallback, useEffect, useRef, useState } from "react";

import { Modal } from "bootstrap";
import { getDocs, collection } from "firebase/firestore";

import OrdersModal from "../../components/admin/OrdersModal";
import Pagenation from "../../components/Pagenation";
import { db } from "../../utils/firebase";

const itemsPerPage = 10;

export default function AdminProducts() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [tempOrder, setTempOrder] = useState({});
  const [allOrders, setAllOrders] = useState([]);

  const orderModal = useRef(null);

  const getOrders = async (page = 1) => {
    try {
      const queryOrders = await getDocs(collection(db, "orders"));
      const ordersArray = queryOrders.docs.map((doc) => ({
        ...doc.data(),
      }));
      setAllOrders(ordersArray);
    } catch (error) {
      alert(error);
    }
  };

  const getPage = useCallback(
    (page = 1) => {
      const totalPage = Math.ceil(allOrders.length / itemsPerPage);
      const getProductsForPage = (page) => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return allOrders.slice(startIndex, endIndex);
      };

      setPagination({
        total_pages: totalPage,
        current_page: page,
        has_pre: page > 1,
        has_next: page < totalPage,
        category: "",
      });
      setOrders(getProductsForPage(page));
    },
    [allOrders],
  );

  //creat and edit product
  const openOrderModal = (order) => {
    setTempOrder(order);
    orderModal.current.show();
  };

  const closeAddOrder = () => {
    setTempOrder({});
    orderModal.current.hide();
  };

  useEffect(() => {
    orderModal.current = new Modal("#orderModal");
    getOrders();
  }, []);

  useEffect(() => {
    if (allOrders.length !== 0) {
      getPage();
    }
  }, [allOrders, getPage]);

  return (
    <div className="p-3">
      <OrdersModal
        closeAddProduct={closeAddOrder}
        getOrders={getOrders}
        tempOrder={tempOrder}
      />
      <h3>訂單列表</h3>
      <hr />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">訂單 id</th>
            <th scope="col">訂單狀態</th>
            <th scope="col">付款</th>
            <th scope="col">留言訊息</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  {(() => {
                    switch (order.status) {
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
                <td>
                  {order.paid_date ? (
                    <span className="text-success fw-bold">
                      {new Date(order.paid_date).toLocaleString("zh-TW", {
                        hour: "2-digit",
                        minute: "2-digit",
                        month: "narrow",
                        day: "2-digit",
                        hour12: false,
                      })}
                    </span>
                  ) : (
                    "未付款"
                  )}
                </td>

                <td>{order.message}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      openOrderModal(order);
                    }}
                  >
                    查看
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagenation pagination={pagination} changePage={getPage} />
    </div>
  );
}
