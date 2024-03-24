import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FrontData } from "../../store/frontStore";
import { ScrollTriggerProvider } from './ScrollTriggerProvider';
import Screen from './Screen';

export default function Home() {
  const { allProducts } = useContext(FrontData);
  const [product, setProduct] = useState([]);


  //取得完整產品列表，並列出隨機三樣
  useEffect(() => {
    const getProduct = async () => {
      try {
        const recomendProduct = [...allProducts];
        const other = [];
        for (let i = 1; i <= 3; i++) {
          const randomIndex = Math.floor(
            Math.random() * recomendProduct.length,
          );
          other.push(recomendProduct[randomIndex]);
          recomendProduct.splice(randomIndex, 1);
        }
        setProduct(other);
      } catch (error) {
        console.log(error);
      }
    };
    if (allProducts.length > 0) {
      getProduct();
    }
  }, [allProducts]);

  return (
    <>
      {/* 首頁第一區塊 */}
      <ScrollTriggerProvider>
        <Screen />
      </ScrollTriggerProvider>

      {/* 隨機推薦三款產品 */}
      <div className="container">
        <h4 className="text-center mt-3 fw-semibold">猜你喜歡</h4>
        <div className="row mt-5">
          {product.map((item) => {
            return (
              <Link
                to={`/product/${item.id}`}
                key={item.id}
                className="col-md-4 mt-md-4 text-decoration-none"
              >
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
            );
          })}
        </div>
      </div>
      {/* 最新消息區塊 */}
      <div className="container my-7">
        <h4 className="text-center my-4 fw-semibold">最新消息</h4>
        <div className="row myHover">
          <div className="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="party"
              className="img-fluid"
            />
          </div>
          <div className="col-md-4 m-auto text-center">
            <h4 className="mt-4">派對專案</h4>
            <p className="text-muted">
              若預定15份以上餐點，提前2天來電洽詢即可享特惠!
            </p>
          </div>
        </div>
        <div className="row flex-row-reverse justify-content-between mt-4 myHover">
          <div className="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="discount"
              className="img-fluid"
            />
          </div>
          <div className="col-md-4 m-auto text-center">
            <h4 className="mt-4">超值特惠-Hamberger送您吃!</h4>
            <p className="text-muted">只要輸入hamburger100，即享100元優惠!(消費需高於NTD$300)</p>
          </div>
        </div>
      </div>
    </>
  );
}
