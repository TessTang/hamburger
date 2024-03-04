import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {


    const [product, setProduct] = useState([]);

    //取得完整產品列表，並列出隨機三樣
    useEffect(() => {
        const getProduct = async () => {
            try {
                const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
                const other = []
                for (let i = 1; i <= 3; i++) {
                    const randomIndex = Math.floor(Math.random() * productRes.data.products.length);
                    other.push(productRes.data.products[randomIndex])
                    productRes.data.products.splice(randomIndex, 1)
                }
                setProduct(other);
            }
            catch (error) {
                console.log(error)
            }
        }
        getProduct();
    }, [])


    return (
        <>
            <div className="container-fluid d-flex flex-column bg-secondary justify-content-center align-items-center home_banner" style={{ backgroundImage: "url('https://nunforest.com/fast-foody/burger/upload/slider/1.jpg')", backgroundRepeat: 'no-repeat' }}>
                <div className="col-md-4 text-center bg-light bg-opacity-50 rounded-2 px-3 py-5">
                    <h2 className="fs-1 fw-bolder">Hamburger</h2>
                    <p className="text-muted mb-0 fs-5 mt-4"> 1984年，Hamburger帶著美式熱情基因而來，數十個年頭，一點一滴融入台灣在地文化。亙古不變的服務理念、與時俱進的服務精神，以「美食」、「數位」、「服務」的三大升級持續向前邁進！陪伴顧客走過每一段別具滋味的片刻時光，共享每一刻美好瞬間。這樣的滋味，真好！</p>
                    <Link to='/products' className="btn btn-dark mt-4 ">立即選購</Link>
                </div>
            </div>
            <div className="container">
                <h4 className="text-center mt-3 fw-semibold">猜你喜歡</h4>
                <div className="row mt-5">
                    {product?.map((item)=>{
                        return (  <Link to={`/product/${item.id}`} key={item.id} className="col-md-4 mt-md-4 text-decoration-none">
                        <div className="card border-0 mb-4 h-100 p-2 myHover">
                            <img
                                src={item.imageUrl}
                                className="card-img-top rounded-0"
                                alt={item.title}
                            />
                            <div className="card-body text-center">
                                <h4>{item.title}</h4>
                                <div className="d-flex justify-content-between">
                                    <p className="card-text text-muted mb-0">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>

                        )
                    })}
                </div>
            </div>
            <div className="container my-7">
            <h4 className="text-center my-4 fw-semibold">最新消息</h4>
                <div className="row myHover">
                    <div className="col-md-6">
                        <img src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="party" className="img-fluid" />
                    </div>
                    <div className="col-md-4 m-auto text-center">
                        <h4 className="mt-4">派對專案</h4>
                        <p className="text-muted">若預定15份以上餐點，提前2天來電洽詢即可享特惠!</p>
                    </div>
                </div>
                <div className="row flex-row-reverse justify-content-between mt-4 myHover">
                    <div className="col-md-6">
                        <img src="https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="discount" className="img-fluid" />
                    </div>
                    <div className="col-md-4 m-auto text-center">
                    <h4 className="mt-4">超值特惠</h4>
                        <p className="text-muted">只要輸入折扣碼code85，即享85折優惠!</p>
                        </div>
                </div>
            </div>
        </>
    )
}