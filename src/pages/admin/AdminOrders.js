import { useEffect, useRef, useState } from "react";
import axios from "axios";
import OrdersModal from "../../components/OrdersModal";
import Pagenation from "../../components/Pagenation";
import { Modal } from "bootstrap";

export default function AdminProducts() {
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState([]);
    const [tempOrder, setTempOrder] = useState({});
    console.log(orders)
    const orderModal = useRef(null);
    // const deleteModal = useRef(null);

    useEffect(() => {
        orderModal.current = new Modal('#orderModal');
        // deleteModal.current = new Modal('#deleteModal');

        getOrders()
    }, [])

    const getOrders = async (page = 1) => {
        try {
            const orderRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/orders?page=${page}`);
            // console.log('get', orderRes);
            setOrders(orderRes.data.orders);
            setPagination(orderRes.data.pagination)
        }
        catch (error) {
            console.log(error)
        }
    }

    //creat and edit product
    const openOrderModal = (order) => {
        setTempOrder(order);
        orderModal.current.show()
    }

    const closeAddOrder = () => {
        setTempOrder({});
        orderModal.current.hide()
    }

    //delete product

    // const openDeleteProduct = (tempProduct) => {
    //     setOrder(tempProduct);
    //     deleteModal.current.show()
    // }

    // const closeDeleteProduct = () => {
    //     deleteModal.current.hide()
    // }

    // const deleteProducts = async () => {
    //     try {
    //         await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/
    //         ${tempOrder.id}`);
    //         getOrders();
    //         closeDeleteProduct();
    //     }
    //     catch (error) {
    //         console.log(error)
    //     }
    // }

    return (<div className="p-3">
        <OrdersModal closeAddProduct={closeAddOrder} getOrders={getOrders}
        tempOrder={tempOrder} />
        {/* <DeleteModal close={closeDeleteProduct} text={tempOrder.title} handleDelete={deleteProducts} /> */}
        <h3>訂單列表</h3>
        <hr />
        <table className="table">
            <thead>
                <tr>
                    <th scope='col'>訂單 id</th>
                    <th scope='col'>購買用戶</th>
                    <th scope='col'>訂單金額</th>
                    <th scope='col'>付款狀態</th>
                    <th scope='col'>付款日期</th>
                    <th scope='col'>留言訊息</th>
                    <th scope='col'>編輯</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) => {
                    return (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.user.name}</td>
                            <td>{order.total}</td>
                            <td>{order.is_paid ? (
                                <span className='text-success fw-bold'>付款完成</span>
                            ) : (
                                '未付款'
                            )}</td>
                            <td> {order.paid_date
                                ? new Date(order.paid_date * 1000).toLocaleString('zh-TW', { hour12: false })
                                : '未付款'}
                                <button onClick={
                                    ()=>{
                                        axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/pay/${order.id}`)
                                        .then((res)=>console.log(res))
                                        .catch((err)=>console.log(err))
                                    }
                                }>123</button>
                                </td>
                                
                            <td>{order.message}</td>
                            <td>
                                <button
                                    type='button'
                                    className='btn btn-primary btn-sm'
                                    onClick={() => {
                                        openOrderModal(order);
                                    }}
                                >
                                    查看
                                </button>
                            </td>
                        </tr>
                    )
                })}


            </tbody>
        </table>
        <Pagenation pagination={pagination} changePage={getOrders} />
    </div>)
}