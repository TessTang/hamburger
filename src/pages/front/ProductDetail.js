import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import {CartData} from "../../store/cartStore";

export default function ProductDetail() {
    const {id} = useParams();

    const {getCart} = useContext(CartData);
    const [product, setProduct] = useState({});
    const [otherProducts, setOtherProducts] = useState([]);
    const [quantity, setQuantity] = useState([]);

    const changeQty = (i, type) => {

        const index = quantity.findIndex((val) => { return val.product_id === i });
        if (type === 'plus') {
            setQuantity((pre) => pre.map((item, idx) => (idx === index ? { ...item, qty: item.qty + 1 } : item)))
        } else {
            quantity.find((val) => { return val.product_id === i }).qty === 1 ||
                setQuantity((pre) => pre.map((item, idx) => (idx === index ? { ...item, qty: item.qty - 1 } : item)))
        }
    }

    //隨機三樣推薦相同分類產品
    const filterOther = (array) => {
        if(array.length <= 3){
            return array
        } else {
            const other = []
            for (let i = 1; i <= 3; i++) {
                const randomIndex = Math.floor(Math.random() * array.length);
                other.push(array[randomIndex])
                array.splice(randomIndex, 1)
            }
            return other;
        }
    }

    //取得完整產品列表，抓取id品項且列出同分類
    useEffect(() => {
        const getProduct = async () => {
            try {
                const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
                const product = productRes.data.products.find((val) => { return val.id === id });
                const otherProductList = productRes.data.products.filter((val) => { return val.category === product.category && val.id !== id });
                const otherProduct = filterOther(otherProductList);
                setProduct(product);
                setOtherProducts(otherProduct);
                setQuantity([product, ...otherProduct].map(val => { return { product_id: val.id, qty: 1 } }))
            }
            catch (error) {
                console.log(error)
            }
        }
        getProduct();

    }, [id])

    const submit = async (id) => {
        try {
           const res =  await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`, {data: quantity.find((val) =>  val.product_id === id)});
           console.log('res', res)
           getCart();
        }
        catch (error) {
            console.log(error)
        }
    }

    return (<>
        <div className="container-fluid bg-secondary px-0 mt-2">
            <img className="img-fluid" src="https://nunforest.com/fast-foody/burger/upload/banners/ban2.jpg" alt="banners" />
        </div>
        <div className="container d-flex flex-column flex-sm-row align-items-center mt-4">
            <div className="col-sm-5 text-center">
                <img className="img-fluid object-fit-cover" style={{ width: '100%' }} src={product.imageUrl} alt={product.title} />
            </div>
            <div className="col-sm-7 mt-2 mt-sm-0 d-flex flex-column align-items-center">
                <div>
                    <h4 className="fw-bolder text-center">{product.title}</h4>
                    <span>{product.description}</span>
                </div>
                <p className="card-text mb-0 mt-3">NT${product.price} <span className="text-muted "><del>NT${product.origin_price}</del></span></p>
                <div className="d-flex align-items-center mt-3">
                    <div>數量:</div>
                    <div className="input-group ms-3" style={{ width: '150px' }}>
                        <div className="input-group-prepend">
                            <button type="button" className="h-100 btn btn-dark btn-sm" onClick={() => { changeQty(product.id, 'min') }}>
                                <i className="bi bi-dash"></i>
                            </button>
                        </div>
                        <input type="number" className="form-control form-control-sm text-center" value={quantity.find(val => val.product_id === product.id)?.qty || 1} readOnly />
                        <div className="input-group-prepend">
                            <button type="button" className="h-100 btn btn-dark btn-sm" onClick={() => { changeQty(product.id, 'plus') }}>
                                <i className="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <button type="button" className="btn btn-dark mt-4" style={{ width: '200px' }} onClick={()=>{submit(product.id)}}>ADD TO CART</button>
            </div>
        </div>
        <div className="my-5">
            <p className="bg-light text-center py-2">成分</p>
            <p className="ps-3" style={{ whiteSpace: "pre-line" }}>
                {product.content}
            </p>
        </div>
        <hr />
        <h4 className="text-center">其他可參考的品項</h4>
        <div className="d-flex flex-wrap justify-content-center">
            {otherProducts.map(product => {
                return <div key={product.id} className="card text-center m-3" style={{ maxWidth: "300px" }}>
                    <img className="card-img-top" src={product.imageUrl} alt={product?.title} />
                    <div className="card-body">
                        <div>
                            <Link to={`/product/${product.id}`}><p>{product.title}</p></Link>
                            <p>NT${product.price} <span className="text-muted"><del>NT${product.origin_price}</del></span></p>
                        </div>
                        <div className="d-flex align-items-center">
                            <div>數量:</div>
                            <div className="input-group ms-3" style={{ width: '150px' }}>
                                <div className="input-group-prepend">
                                    <button className="h-100 btn btn-dark btn-sm" onClick={() => { changeQty(product.id, 'min') }}>
                                        <i className="bi bi-dash"></i>
                                    </button>
                                </div>
                                <input type="number" className="form-control form-control-sm text-center" value={quantity.find(val => val.product_id === product.id)?.qty || 1} readOnly />
                                <div className="input-group-prepend">
                                    <button className="h-100 btn btn-dark btn-sm" onClick={() => { changeQty(product.id, 'plus') }}>
                                        <i className="bi bi-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="btn btn-dark mt-2" onClick={()=>{submit(product.id)}}>加入購物車</button>
                    </div>
                </div>
            })}


        </div>

    </>)
}