import { Table } from "react-bootstrap";
import { FrontData } from "../../../store/frontStore";
import { useContext, useState, useRef, useEffect, useMemo } from "react";
import MemberOrderModal from "../../../components/MemberOrderModal";
import { Modal } from "bootstrap";
import { getDocs,doc, collection,where,query } from "firebase/firestore";
import { db } from "../../../utils/firebase";


export default function MemberOrders() {

  const { user } = useContext(FrontData);
  const [userOrder, setUserOrder] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const changeDate = (time) => {
    const date = new Date(time); 

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
    const idIndexMap = new Map();
    user.user.orders.forEach((id, index) => {
        idIndexMap.set(id, index);
    });
    
      const getOrder = async () => {
        try {
          const querySnapshot = await getDocs(query(collection(db, 'orders'), where('id', 'in', user.user.orders)));
          const orders = [];
          querySnapshot.docs.forEach((doc) => {
              const orderData = doc.data();
              const index = idIndexMap.get(orderData.id);
              if (index !== undefined) {
                  orders[index] = orderData;
              }
          });
          setUserOrder(orders)
        }
        catch (error) {
          console.log(error)
        }
      }
      getOrder()

  }, [user])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (<>
    <h3>訂單資料</h3>
    <MemberOrderModal closeOrderModal={closeOrderModal}
      tempOrder={tempOrder} changeDate={changeDate}/>
    {user.user?.orders.length ?
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>訂單號</th>
            {!isMobile &&  <th>訂單日</th>}
            {!isMobile &&  <th>訂單金額</th>}
            <th>查看詳情</th>
          </tr>
        </thead>
        <tbody>
          {userOrder.map((item, idx) => {
            return <tr key={item.id}>
              <td>{idx + 1}</td>
              <td>{item.id}</td>
              {!isMobile &&  <td>{changeDate(item.create_at)}</td>}
              {!isMobile &&  <td>{item.order.final_total.toLocaleString()}</td>}
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