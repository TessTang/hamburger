import { useState, useEffect, useContext} from "react";
import { Link } from "react-router-dom";
import Pagenation from "../../components/Pagenation";
import { FrontData } from "../../store/frontStore";
import ListGroup from 'react-bootstrap/ListGroup';

export default function Products() {

    const [productCategory, setProductCategory] = useState("all")
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState([]);
    const { isLoading, allProducts } = useContext(FrontData);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 3
            }
        }
    }

    const item = {
        hidden: { opacity: 0 },
        show: { opacity: 1 }
    }

    useEffect(() => {
        getPage()
    }, [productCategory, isLoading])

    const getPage = (page = 1)=>{
        const productList = productCategory === 'all' ? allProducts: allProducts.filter(item=>item.category === productCategory)
        const itemsPerPage = 10; // 每頁顯示的資料數量
        const totalPage = Math.ceil(productList.length / itemsPerPage);
        const getProductsForPage = (page) => {
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
           return productList.slice(startIndex, endIndex)
        }

        setPagination({
            "total_pages": totalPage,
            "current_page": page,
            "has_pre": page > 1,
            "has_next": page < totalPage,
            "category": ""
          })
        setProducts(getProductsForPage(page));
    }

    return (<>
        <div className="container-fluid bg-secondary px-0 mt-2">
            <img className="img-fluid" src="https://nunforest.com/fast-foody/burger/upload/banners/ban2.jpg" alt="banners" />
        </div>
        <div className="container mt-md-5 mt-3 mb-7">
            <div className="row">
                <div className="col-md-3">
                    <div className="accordion border border-bottom border-top-0 border-start-0 border-end-0 mb-3" >
                        <div className="card border-0 text-center">
                            <div className="card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0">
                                <div className="d-flex justify-content-between align-items-center pe-1 mb-2">
                                    <h4 className="mb-0 fw-bold">
                                        產品分類
                                    </h4>
                                    <i className="bi bi-tag fs-4"></i>
                                </div>
                                <ListGroup as="ul" className="fs-4">
                                    <ListGroup.Item as="li"
                                        className={`${productCategory === 'all' && 'active'} myHover`}
                                        onClick={() => { setProductCategory('all') }}>
                                        全部品項
                                    </ListGroup.Item>
                                    <ListGroup.Item as="li"
                                        className={`${productCategory === 'hamburger' && 'active'} myHover`}
                                        onClick={() => { setProductCategory('hamburger') }}>
                                        漢堡
                                    </ListGroup.Item>
                                    <ListGroup.Item as="li"
                                        className={`${productCategory === 'chicken' && 'active'} myHover`}
                                        onClick={() => { setProductCategory('chicken') }}>
                                        炸雞
                                    </ListGroup.Item>
                                    <ListGroup.Item as="li"
                                        className={`${productCategory === 'drink' && 'active'} myHover`}
                                        onClick={() => { setProductCategory('drink') }}>
                                        飲料
                                    </ListGroup.Item>
                                    <ListGroup.Item as="li"
                                        className={`${productCategory === 'dessert' && 'active'} myHover`}
                                        onClick={() => { setProductCategory('dessert') }}>
                                        點心
                                    </ListGroup.Item>
                                </ListGroup>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-9">
                    <div variants={container}
                        initial="hidden"
                        animate="show" className="row row-cols-xl-3">
                        {products.map((product) => {
                            return <div className="col-md-6" key={product.id} variants={item}>
                                <Link to={`/product/${product.id}`} className="productsList card border-0 mb-4 position-relative position-relative myHover p-2">
                                    <img src={product.imageUrl} className="card-img-top rounded-0" alt={product.title} />
                                    <div className="card-body p-0 text-center">
                                        <h4 className="mb-0 mt-3">{product.title}</h4>
                                        <p className="card-text mb-0">NT${product.price}</p>
                                        <p className="text-muted mt-3"></p>
                                    </div>
                                </Link>
                            </div>
                        })}

                    </div>
                    <Pagenation pagination={pagination} changePage={getPage} />
                </div>
            </div>
        </div>

    </>)
}