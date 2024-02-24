import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { MessageContext, handleSuccessMessage, handleErrorMessage } from "../store/messageStore"

export default function OrdersModal({ closeAddProduct, getOrders, tempOrder }) {
  const [, dispatch] = useContext(MessageContext)

  const [tempData, setTempData] = useState({
    is_paid: '',
    status: 0,
    ...tempOrder,
  })

  useEffect(() => {
    setTempData({
      ...tempOrder,
      is_paid: tempOrder.is_paid,
      status: tempOrder.status,
    });
  }, [tempOrder])

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (['is_paid'].includes(name)) {
      setTempData((pre) => {
        return { ...pre, [name]: checked }
      })
    } else {
      setTempData((pre) => {
        return { ...pre, [name]: value }
      })
    }
  }

  const submit = async () => {
    try {
      const res = await axios.put(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/order/${tempOrder.id}`,
        {
          data: {...tempData}
        }
      );
      handleSuccessMessage(dispatch, res);
      getOrders();
      closeAddProduct();
    }
    catch (error) {
      handleErrorMessage(dispatch, error);
      console.log(error)
    }
  }

  return (
    <div
      className='modal fade'
      id="orderModal"
      tabIndex='-1'
      aria-labelledby='exampleModalLabel'
      data-bs-backdrop="static"
      aria-hidden='true'
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h1 className='modal-title fs-5' id='exampleModalLabel'>
              {`編輯 ${tempOrder.id}`}
            </h1>
            <button
              type='button'
              className='btn-close'
              aria-label='Close'
              onClick={closeAddProduct}
            />
          </div>
          <div className='modal-body'>
            <div className='mb-3 row'>
              <span className='col-sm-2 col-form-label'>Email</span>
              <div className='col-sm-10'>
                <input
                  type='email'
                  readOnly
                  className='form-control-plaintext'
                  id='staticEmail'
                  defaultValue={tempOrder?.user?.email}
                />
              </div>
            </div>
            <div className='mb-3 row'>
              <span className='col-sm-2 col-form-label'>訂購者</span>
              <div className='col-sm-10'>
                <input
                  type='text'
                  readOnly
                  className='form-control-plaintext'
                  id='staticEmail'
                  defaultValue={tempOrder?.user?.name}
                />
              </div>
            </div>
            <div className='mb-3 row'>
              <span className='col-sm-2 col-form-label'>外送地址</span>
              <div className='col-sm-10'>
                <input
                  type='text'
                  readOnly
                  className='form-control-plaintext'
                  defaultValue={tempOrder?.user?.address}
                />
              </div>
            </div>
            <div className='mb-3 row'>
              <span className='col-sm-2 col-form-label'>留言</span>
              <div className='col-sm-10'>
                <textarea
                  name=''
                  id=''
                  cols='30'
                  readOnly
                  className='form-control-plaintext'
                  defaultValue={tempOrder.message}
                />
              </div>
            </div>
            {tempOrder.products && (
              <table className='table'>
                <thead>
                  <tr>
                    <th>品項名稱</th>
                    <th>數量</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(tempOrder.products).map((cart) => (
                    <tr key={cart.id}>
                      <td>{cart.product.title}</td>
                      <td>{cart.qty}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className='border-0 text-end'>總金額</td>
                    <td className='border-0'>${tempOrder.total}</td>
                  </tr>
                </tfoot>
              </table>
            )}

            <div>
              <h5 className='mt-4'>修改訂單狀態</h5>
              <div className='form-check mb-4'>
                <label className='form-check-label' htmlFor='is_paid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    name='is_paid'
                    id='is_paid'
                    checked={!!tempData.is_paid}
                    onChange={handleChange}
                  />
                  付款狀態 ({tempData.is_paid ? '已付款' : '未付款'})
                </label>
              </div>
              <div className='mb-4'>
                <span className='col-sm-2 col-form-label d-block'>
                  外送進度
                </span>
                <select
                  className='form-select'
                  name='status'
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
          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary' onClick={closeAddProduct}>
              關閉
            </button>
            <button type='button' className='btn btn-primary' onClick={submit}>
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>


  );
}