import { CartData } from "../../store/cartStore";
import { useContext} from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Cart() {

    const { cart, getCart, numberComma } = useContext(CartData);

    //增減數量
    const changeQty = (item, type) => {
        if (type === 'plus') {
            putQty(item.id, {
                'data':
                {
                    'product_id': item.product_id,
                    'qty': item.qty + 1
                }
            })
        } else {
            putQty(item.id, {
                'data':
                {
                    'product_id': item.product_id,
                    'qty': item.qty - 1
                }
            })
        }
    }

    //更改數量
    const putQty = async (id,data) => {
            try {
               await axios.put(`/v2/api/${process.env.REACT_APP_API_PATH}/cart/${id}`, data);
               getCart();
            }
            catch (error) {
                console.log(error)
            }
        };

    //刪除
    const deleteCart = async(id) =>{
        try {
            await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/cart/${id}`);
            getCart();
         }
         catch (error) {
             console.log(error)
         }

    }

    return (<>

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
                                {cart?.carts?.map((item) => {
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
                                        <td className="border-0 align-middle"><p className="mb-0 ms-auto">NT${numberComma(item.total)}</p></td>
                                        <td className="border-0 align-middle position-relative">
                                            <button type="button" className="cartDeleteBtn btn btn-dark" onClick={()=>{deleteCart(item.id)}}>
                                                <i className="bi bi bi-x-lg" />
                                            </button></td>
                                    </tr>
                                })

                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-4">
                        <div className="border p-4 mb-4">
                            <h4 className="fw-bold mb-4">訂單資訊</h4>

                            <div className="d-flex justify-content-between mt-4">
                                <p className="mb-0 h4 fw-bold">Total</p>
                                <p className="mb-0 h4 fw-bold">NT${cart.final_total? numberComma(cart.final_total):0}</p>
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