import { FrontData } from "../../store/frontStore";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import { messageAlert } from "../../store/frontStore";

export default function Cart() {

    const { cart, getCart, user } = useContext(FrontData);
    const [message, setMessage] = useState({ 'type': '', 'message': '' })
    const navigate = useNavigate(null);


    //增減數量
    const changeQty = (item, type) => {
        const thisItem = cart.carts.findIndex(product => product.product.id === item.product.id);
        if (type === 'plus') {
            putQty({
                ...cart,
                carts: cart.carts.map((item, index)=>{ 
                    if( index === thisItem){
                        return {
                            ...cart.carts[thisItem],
                            qty: cart.carts[thisItem].qty + 1,
                            total: cart.carts[thisItem].total += item.product.price
                        }
                    }
                    return item;
                    }),
                total: cart.total += item.product.price,
                final_total: cart.final_total += item.product.price
            })
        } else  {
            if(item.qty !== 1){
                putQty({
                    ...cart,
                    carts: cart.carts.map((item, index)=>{ 
                        if( index === thisItem){
                            return {
                                ...cart.carts[thisItem],
                                qty: cart.carts[thisItem].qty - 1,
                                total: cart.carts[thisItem].total - item.product.price
                            }
                        }
                        return item;
                        }),
                    total: cart.total - item.product.price,
                    final_total: cart.final_total - item.product.price
                })
            }
        }
    }

useEffect(()=>{
    if (cart.length === 0) {
        messageAlert('warning','購物車是空的喔!')
        navigate('../products')
    }
})

    //更改數量
    const putQty = async (data) => {
        try {
            await updateDoc(doc(db, "carts", user.user.uid),data)
            getCart();
        }
        catch (error) {
            console.log(error)
        }
    };

    //刪除
    const deleteCart = async (id) => {
        const thisItem = cart.carts.findIndex(product => product.product.id === id);
        try {
            await updateDoc(doc(db, "carts", user.user.uid),{
                ...cart,
                carts: cart.carts.filter((item, index)=> index !== thisItem),
                total: cart.carts.map((item)=>item.total).reduce((a, b)=>a+b)- cart.carts[thisItem].total,
                final_total:cart.carts.map((item)=>item.total).reduce((a, b)=>a+b)- cart.carts[thisItem].total - (cart.coupon?.deduct? cart.coupon.deduct:0)
            })
            getCart();
        }
        catch (error) {
            console.log(error)
        }
    }

    const [data, setData] = useState({})

    const submitCoupon = async () => {
        try {
            const couponData = await getDoc(doc(db, "coupons", data.code));
            if(couponData.exists()){
                if(couponData.data().due_date > data.date.getTime()){
                    try {
                        await updateDoc(doc(db, "carts", user.user.uid),{
                            ...cart,
                            coupon:couponData.data(),
                            final_total:cart.carts.map((item)=>item.total).reduce((a, b)=>a+b) - couponData.data().deduct
                        })
                        getCart();
                        setMessage({ 'type': 'success', 'message': '已套用優惠券' });
                    }
                    catch (error) {
                        console.log(error)
                    }
                }else{
                    setMessage({ 'type': 'error', 'message': '優惠券已過期' });
                }              
            } else {
                setMessage({ 'type': 'error', 'message': '優惠券不存在' })
            }
        } catch (error) {
            setMessage({ 'type': 'error', 'message': error.response.data.message })
            console.log(error)
        }
    }

    return (<>
        <div className="container-fluid bg-secondary px-0 mt-2">
            <img className="img-fluid" src="https://nunforest.com/fast-foody/burger/upload/banners/ban2.jpg" alt="banners" />
        </div>
        <div className="container full-height">
            <div className="mt-3">
                <h3 className="mt-3 mb-4">購物車</h3>
                <div className="row">
                    <div className="col-md-8">
                        <table className="table text-center">
                            <thead>
                                <tr className="text-center">
                                    <th scope="col" className="border-0 ps-0">品項</th>
                                    <th scope="col" className="border-0">數量</th>
                                    <th scope="col" className="border-0">金額</th>
                                    <th scope="col" className="border-0"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.carts?.map((item) => {
                                    return <tr className="border-bottom border-top" key={item.product.id}>
                                        <th scope="row" className="border-0 px-0 font-weight-normal py-4 d-flex flex-column flex-md-row column-gap-2">
                                            <img className="col-md-5" src={item.product.imageUrl} alt={item.product.title} style={{ width: '90px', height: '72px', objectFit: 'cover', margin: '0 auto' }} />
                                            <p className="col-md-7 mb-0 fw-bold">{item.product.title}</p>
                                        </th>
                                        <td className="border-0 align-middle" style={{ maxWidth: '160px' }}>
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <button className="btn btn-outline-dark border-0 py-2" type="button" onClick={() => { changeQty(item, 'min') }}>
                                                        <i className="bi bi-dash"></i>
                                                    </button>
                                                </div>
                                                <input type="text" className="form-control border-0 text-center my-auto shadow-none p-0"
                                                    value={item.qty} readOnly />
                                                <div className="input-group-append">
                                                    <button className="btn btn-outline-dark border-0 py-2" type="button" onClick={() => { changeQty(item, 'plus') }}>
                                                        <i className="bi bi-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border-0 align-middle"><p className="mb-0 ms-auto">NT${item.total.toLocaleString()}</p></td>
                                        <td className="border-0 align-middle position-relative">
                                            <button type="button" className="cartDeleteBtn btn btn-dark" onClick={() => { deleteCart(item.product.id) }}>
                                                <i className="bi bi bi-x-lg" />
                                            </button>
                                        </td>
                                    </tr>
                                })

                                }
                            </tbody>
                        </table>
                        <div className="input-group w-50 mb-3">
                            <input onChange={(e)=>{setData({date:new Date(), code:e.target.value})}} type="text" className="form-control rounded-0 border-bottom border-top-0 border-start-0 border-end-0 shadow-none" placeholder="優惠券" />
                            <div className="input-group-append">
                                <button onClick={submitCoupon} className="btn btn-dark" type="button"><i className="bi bi-send" /></button>
                            </div>
                        </div>
                        <p className={`errorAlert ${message.type === 'error' ? 'd-block' : 'd-none'}`}>{message.message}</p>
                    </div>
                    <div className="col-md-4">
                        <div className="border p-4 mb-4">
                            <h4 className="fw-bold">訂單資訊</h4>
                            <table className="table text-muted border-bottom">
                                <tbody>
                                    <tr>
                                        <th scope="row" className="border-0 px-0 pt-4 font-weight-normal">小計</th>
                                        <td className="text-end border-0 px-0 pt-4">NT${cart.total?.toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" className="border-0 px-0 pt-0 pb-4 font-weight-normal">
                                            {cart.total>cart.final_total ?`已套用優惠券[${cart.coupon.title}]`:'優惠券' }
                                            </th>
                                        <td className="text-end border-0 px-0 pt-0 pb-4">NT${cart.total - Math.ceil(cart.final_total)}</td>
                                    </tr>                                   
                                </tbody>
                            </table>
                            <div className="d-flex justify-content-between mt-4">
                                <p className="mb-0 h4 fw-bold">總金額</p>
                                <p className="mb-0 h4 fw-bold">NT${cart.final_total ? cart.final_total.toLocaleString() : 0}</p>
                            </div>
                            <Link to={'/checkout'} className="btn btn-dark w-100 mt-4">確認訂單</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}