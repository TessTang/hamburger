import { Table } from "react-bootstrap";
import { FrontData } from "../../../store/frontStore";
import { useContext, useState, useRef, useEffect } from "react";
import MemberOrderModal from "../../../components/MemberOrderModal";
import { Modal } from "bootstrap";


export default function MemberOrders() {

  const { user, numberComma } = useContext(FrontData);

  const changeDate = (item) => {
    const unixTimestamp = item.create_at;
    const date = new Date(unixTimestamp * 1000); // 需要乘以 1000，因為 JavaScript 中的時間戳是以毫秒為單位的

    // 格式化日期
    const year = date.getFullYear(); // 取得年份
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 取得月份，並補齊為兩位數
    const day = String(date.getDate()).padStart(2, '0'); // 取得日期，並補齊為兩位數

    // 產生最終格式的日期字串
    const formattedDate = `${year}/${month}/${day}`;

    return formattedDate;
  }

  const openOrderModal = (order) => {
    setTempOrder(order);
    memberOrderModal.current.show()
  }

  const closeOrderModal = () => {
    setTempOrder({});
    memberOrderModal.current.hide()
  }

  const [tempOrder, setTempOrder] = useState({});
  const memberOrderModal = useRef(null);

  useEffect(() => {
    memberOrderModal.current = new Modal('#memberOrderModal');
  }, [])


  return (<>
    <h3>訂單資料</h3>
    <MemberOrderModal closeOrderModal={closeOrderModal}
      tempOrder={tempOrder} />
    {user.user?.orders.length ?
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>訂單號</th>
            <th>訂單日</th>
            <th>訂單金額</th>
            <th>查看詳情</th>
          </tr>
        </thead>
        <tbody>
          {user.user?.orders.map((item, idx) => {
            return <tr key={item.id}>
              <td>{idx + 1}</td>
              <td>{item.id}</td>
              <td>{changeDate(item)}</td>
              <td>{numberComma(item.total)}</td>
              <td>
                <button
                  type='button'
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    openOrderModal(item);
                  }}
                >
                  查看
                </button>
              </td>
            </tr>
          })}
        </tbody>
      </Table>
      :
      <div>尚未有訂單</div>
    }
  </>
  )
}