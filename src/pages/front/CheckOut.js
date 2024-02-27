import { useContext, useState, } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { CartData } from "../../store/cartStore";
import axios from "axios";

export default function CheckOut() {
    const navigate = useNavigate();
    const { cart, numberComma, setCart } = useContext(CartData);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (order) => {
        const data = {
            "data": {
                "user": {
                    "name": order.name,
                    "email": order.email,
                    "tel": order.tel,
                    "address": order.address
                },
                "message": order.message
            }
        }

        axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/order`, data)
            .then(res => {
                console.log(res);
                setCart({})
                navigate(`/ordersuccess/${res.data.orderId}`)
            }
            )
            .catch(error =>
                console.log(error))

    };
    const [payment, setPayment] = useState('');


    return (<>
        <div className="container-fluid bg-secondary px-0 mt-2">
            <img className="img-fluid" src="https://nunforest.com/fast-foody/burger/upload/banners/ban2.jpg" alt="banners" />
        </div>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <h3 className="fw-bold mb-4 pt-3">確認訂單</h3>
                </div>
            </div>
            <div className="row flex-row-reverse justify-content-center pb-5">
                <div className="col-md-4">
                    <div className="border p-4 mb-4">
                        {cart.carts?.map((item) => {
                            return (
                                <div className="d-flex mt-2" key={item.id}>
                                    <img src={item.product.imageUrl} alt={item.product.title} className="me-2" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                                    <div className="w-100">
                                        <div className="d-flex justify-content-between">
                                            <p className="mb-0 fw-bold">{item.product.title}</p>
                                            <p className="mb-0">NT${numberComma(item.final_total)}</p>
                                        </div>
                                        <p className="mb-0 fw-bold">x{item.qty}</p>
                                    </div>
                                </div>
                            )
                        })}

                        <table className="table mt-4 border-top border-bottom text-muted">
                            <tbody>
                                <tr>
                                    <th scope="row" className="border-0 px-0 pt-4 font-weight-normal">Subtotal</th>
                                    <td className="text-end border-0 px-0 pt-4">NT${cart.final_total ? numberComma(cart.final_total) : '0'}</td>
                                </tr>
                                <tr>
                                    <th scope="row" className="border-0 px-0 pt-0 pb-4 font-weight-normal">Payment</th>
                                    <td className="text-end border-0 px-0 pt-0 pb-4">{payment}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-between mt-4">
                            <p className="mb-0 h4 fw-bold">Total</p>
                            <p className="mb-0 h4 fw-bold">NT${cart.final_total ? numberComma(cart.final_total) : '0'}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <form action="" onSubmit={handleSubmit(onSubmit)}>
                        <p>聯絡資訊</p>
                        <div className="mb-0">
                            <label htmlFor="ContactMail" className="text-muted mb-0">Email</label>
                            <input type="email"
                                className="form-control "
                                id="ContactMail"
                                aria-describedby="emailHelp"
                                placeholder="example@gmail.com"
                                {...register('email', { required: { value: true, message: '請填寫喔!' }, pattern: { value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, message: 'e-mail格式錯誤' } })}
                            />
                            <p className="errorAlert">{errors.email?.message}</p>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="ContactName" className="text-muted mb-0">姓名</label>
                            <input type="text"
                                className="form-control"
                                id="ContactName"
                                placeholder="ex:王小明"
                                {...register('name', { required: true })}
                            />
                            {errors.name && <p className="errorAlert">請填寫<i className="bi bi-hand-index-fill" /></p>}

                        </div>
                        <div className="mb-2">
                            <label htmlFor="ContactAddress" className="text-muted mb-0">地址</label>
                            <input type="text"
                                className="form-control"
                                id="ContactAddress"
                                placeholder="ex:台中市..."
                                {...register('address', { required: true })}
                            />
                            {errors.address && <p className="errorAlert">請填寫<i className="bi bi-hand-index-fill" /></p>}
                        </div>
                        <div className="mb-2">
                            <label htmlFor="ContactPhone" className="text-muted mb-0">電話</label>
                            <input type="tel"
                                className="form-control"
                                id="ContactPhone"
                                placeholder="ex:0912345678"
                                {...register('tel', { required: true })}
                            />
                            {errors.tel && <p className="errorAlert">請填寫<i className="bi bi-hand-index-fill" /></p>}
                        </div>
                        <div className="mb-2">
                            <p>付款方式</p>
                            <div>
                                <input onClick={() => { setPayment('貨到付款') }} type="radio" id="onDelivery" value="onDelivery" className="form-check-input"
                                    {...register("pay", { required: true })} />
                                <label htmlFor="onDelivery" className="ms-2 form-check-label">貨到付款</label>
                            </div>
                            <div>
                                <input onClick={() => { setPayment('Line Pay') }} type="radio" id="linePay" value="linePay" className="form-check-input"
                                    {...register("pay", { required: true })} />
                                <label htmlFor="linePay" className="ms-2 form-check-label">Line Pay</label>
                            </div>
                            {errors.pay && <p className="errorAlert">請選擇<i className="bi bi-hand-index-fill" /></p>}
                        </div>


                        <div className="mb-2">
                            <label htmlFor="ContactMessage" className="text-muted mb-0">備註</label>
                            <textarea className="form-control" rows="3" id="ContactMessage" placeholder="備註事項"
                                {...register("message")} />
                        </div>
                        <div className="d-flex flex-column-reverse flex-md-row mt-4 justify-content-between align-items-md-center align-items-end w-100">
                            <Link to={"/products"} className="text-dark mt-md-0 mt-3"><i className="bi bi-chevron-left"></i> 回到產品頁面</Link>
                            <button type="submit" className="btn btn-dark py-3 px-7">送出訂單</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
    )
}