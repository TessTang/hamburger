import axios from "axios";
import {linePayRequest} from "../store/frontStore"

export default function MemberOrderModal({
  tempOrder,
  closeOrderModal,
  changeDate,
}) {
 
const submitLine = ()=>{
  linePayRequest(tempOrder.order, tempOrder.id, tempOrder.user, 'http://localhost:3000/member/memberorders')
  
}

  return (
    <div
      className="modal fade"
      id="memberOrderModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      data-bs-backdrop="static"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              訂單資訊
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeOrderModal}
            />
          </div>
          <div className="modal-body">
            <div className="row p-2 border-bottom">
              <div className="col-2 border-end text-center">訂單號</div>
              <div className="col-10">{tempOrder.id}</div>
            </div>
            <div className="row p-2 border-bottom">
              <div className="col-2 border-end text-center">訂單日</div>
              <div className="col-10">{changeDate(tempOrder.create_at)}</div>
            </div>
            <div className="row p-2 border-bottom">
              <div className="col-2 border-end text-center">總金額</div>
              <div className="col-10">
                NTD$ {tempOrder.order?.final_total?.toLocaleString()}
              </div>
            </div>
            <div className="row p-2 border-bottom">
              <div className="col-2 border-end text-center">付款方式</div>
              <div className="col-10">
                 <span className="pe-1">{tempOrder.payBy === 'onDelivery'? "貨到付款":"LinePay"}</span>
                 {tempOrder.is_paid? 
                 <span className="text-success fw-bolder">已付款</span>
                 :<p>
                  <span className="text-danger fw-bolder">未付款</span>
                  {tempOrder.payBy==="linePay" &&<button className="btn btn-dark ms-3" onClick={submitLine}>我要付款</button>}
                  </p> 
                  }
                 
              </div>
            </div>
            <div className="row p-2 border-bottom">
              <div className="col-2 border-end text-center">訂購資訊</div>
              <div className="col-10">
                <p>姓名 : {tempOrder.orderContact?.name}</p>
                <p>地址 : {tempOrder.orderContact?.address}</p>
                <p>電話 : {tempOrder.orderContact?.tel}</p>
                <p>e-mail: {tempOrder.orderContact?.email}</p>
              </div>
            </div>
            <div className="row p-2 border-bottom">
              <div className="col-2 border-end text-center">訂購內容</div>
              <ul className="col-10 list-group">
                {tempOrder.order &&
                  tempOrder.order.carts.map((item) => {
                    return (
                      <li
                        className="list-group-item d-flex"
                        key={item.product.id}
                      >
                        <div className="col-5">{item.product.title}</div>
                        <div className="col-3">x {item.qty}</div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeOrderModal}
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
