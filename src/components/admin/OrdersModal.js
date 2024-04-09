import { useEffect, useState, useContext } from "react";
import { doc, updateDoc } from "firebase/firestore";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from "../../store/messageStore";
import { db } from "../../utils/firebase";

export default function OrdersModal({ closeAddProduct, getOrders, tempOrder }) {
  const [, dispatch] = useContext(MessageContext);

  const [tempData, setTempData] = useState({
    is_paid: "",
    status: 0,
    ...tempOrder,
  });

  useEffect(() => {
    setTempData({
      ...tempOrder,
      is_paid: tempOrder.is_paid,
      status: tempOrder.status,
    });
  }, [tempOrder]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (["is_paid"].includes(name)) {
      setTempData((pre) => {
        return { ...pre, [name]: checked };
      });
    } else {
      setTempData((pre) => {
        return { ...pre, [name]: Number(value) };
      });
    }
  };

  const submit = async () => {
    try {
      await updateDoc(doc(db, "orders", tempData.id), {
        ...tempData,
        paid_date: new Date().getTime(),
      });
      handleSuccessMessage(dispatch, "更改成功");
      getOrders();
      closeAddProduct();
    } catch (error) {
      handleErrorMessage(dispatch, "更改失敗");
      console.log(error);
    }
  };

  return (
    <div
      className="modal fade"
      id="orderModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      data-bs-backdrop="static"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {`編輯 ${tempOrder.id}`}
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeAddProduct}
            />
          </div>
          <div className="modal-body">
            <div className="mb-3 row">
              <span className="col-sm-2 col-form-label">Email</span>
              <div className="col-sm-10">
                <input
                  type="email"
                  readOnly
                  className="form-control-plaintext"
                  id="staticEmail"
                  defaultValue={tempOrder?.orderContact?.email}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <span className="col-sm-2 col-form-label">訂購者</span>
              <div className="col-sm-10">
                <input
                  type="text"
                  readOnly
                  className="form-control-plaintext"
                  id="staticEmail"
                  defaultValue={tempOrder?.orderContact?.name}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <span className="col-sm-2 col-form-label">外送地址</span>
              <div className="col-sm-10">
                <input
                  type="text"
                  readOnly
                  className="form-control-plaintext"
                  defaultValue={tempOrder?.orderContact?.address}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <span className="col-sm-2 col-form-label">留言</span>
              <div className="col-sm-10">
                <textarea
                  cols="30"
                  readOnly
                  className="form-control-plaintext"
                  defaultValue={tempOrder.message}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <span className="col-sm-2 col-form-label">付款方式</span>
              <div className="col-sm-10">
                <textarea
                  readOnly
                  className="form-control-plaintext"
                  defaultValue={tempOrder.payBy}
                />
              </div>
            </div>
            {tempOrder.order && (
              <table className="table">
                <thead>
                  <tr>
                    <th>品項名稱</th>
                    <th>數量</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(tempOrder.order.carts).map((item) => (
                    <tr key={item.product.id}>
                      <td>{item.product.title}</td>
                      <td>{item.qty}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="border-0 text-end">總金額</td>
                    <td className="border-0">
                      ${tempOrder.order.final_total.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}

            <div>
              <h5 className="mt-4">修改訂單狀態</h5>
              <div className="form-check mb-4">
                <label className="form-check-label" htmlFor="is_paid">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="is_paid"
                    id="is_paid"
                    disabled={tempOrder.is_paid}
                    checked={!!tempData.is_paid}
                    onChange={handleChange}
                  />
                  付款狀態 (
                  {tempData.is_paid
                    ? `${new Date(
                        tempData.paid_date || new Date().getTime(),
                      ).toLocaleString("zh-TW", {
                        hour: "2-digit",
                        minute: "2-digit",
                        month: "narrow",
                        day: "2-digit",
                        hour12: false,
                      })}已付款`
                    : "未付款"}
                  )
                </label>
              </div>
              <div className="mb-4">
                <span className="col-sm-2 col-form-label d-block">
                  外送進度
                </span>
                <select
                  className="form-select"
                  name="status"
                  value={tempData.status}
                  onChange={handleChange}
                >
                  <option value={0}>未確認</option>
                  <option value={1}>已確認</option>
                  <option value={2}>外送中</option>
                  <option value={3}>已送達</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeAddProduct}
            >
              關閉
            </button>
            <button type="button" className="btn btn-primary" onClick={submit}>
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
