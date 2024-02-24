import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Pagenation from "../../components/Pagenation";
import { CartData } from "../../store/cartStore";

export default function Products() {

    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState([]);
    const { setIsLoading} = useContext(CartData);

    useEffect(() => {
        getProducts()
    }, [])

    const getProducts = async (page = 1) => {
        try {
            setIsLoading(true);
            const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products?page=${page}`);
            console.log('get', productRes);
            setProducts(productRes.data.products);
            setPagination(productRes.data.pagination)
            setIsLoading(false);
        }
        catch (error) {
            console.log(error)
        }
    }

    return (<>

        <div className="container mt-md-5 mt-3 mb-7">
            <div className="row">
                <div className="col-md-3">
                    <div className="accordion border border-bottom border-top-0 border-start-0 border-end-0 mb-3" id="accordionExample">
                        <div className="card border-0">
                            <div className="card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0" id="headingOne" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                                <div className="d-flex justify-content-between align-items-center pe-1">
                                    <h4 className="mb-0">
                                        Lorem ipsum
                                    </h4>
                                    <i className="fas fa-chevron-down"></i>
                                </div>
                            </div>
                            <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div className="card-body py-0">
                                    <ul className="list-unstyled">
                                        <li><a href="#" className="py-2 d-block text-muted">Lorem ipsum</a></li>
                                        <li><a href="#" className="py-2 d-block text-muted">Lorem ipsum</a></li>
                                        <li><a href="#" className="py-2 d-block text-muted">Lorem ipsum</a></li>
                                        <li><a href="#" className="py-2 d-block text-muted">Lorem ipsum</a></li>
                                        <li><a href="#" className="py-2 d-block text-muted">Lorem ipsum</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="card border-0">
                            <div className="card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0" id="headingTwo" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                                <div className="d-flex justify-content-between align-items-center pe-1">
                                    <h4 className="mb-0">
                                        Lorem ipsum
                                    </h4>
                                    <i className="fas fa-chevron-down"></i>
                                </div>
                            </div>
                            <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                <div className="card-body py-0">
                                    <ul className="list-unstyled">
                                        <li><a href="#" className="py-2 d-block text-muted">Lorem ipsum</a></li>
                                        <li><a href="#" className="py-2 d-block text-muted">Lorem ipsum</a></li>
                                        <li><a href="#" className="py-2 d-block text-muted">Lorem ipsum</a></li>
                                        <li><a href="#" className="py-2 d-block text-muted">Lorem ipsum</a></li>
                                        <li><a href="#" className="py-2 d-block text-muted">Lorem ipsum</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="card border-0">
                            <div className="card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0" id="headingThree" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                                <div className="d-flex justify-content-between align-items-center pe-1">
                                    <h4 className="mb-0">
                                        Lorem ipsum
                                    </h4>
                                    <i className="fas fa-chevron-down"></i>
                                </div>
                            </div>
                            <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                <div className="card-body py-0">
                                    <ul className="list-unstyled">
                                        <li><a href="#" className="py-2 d-block text-muted">Lorem ipsum</a></li>
                                        <li><a href="#" className="py-2 d-block text-muted">Lorem ipsum</a></li>
                                        <li><a href="#" className="py-2 d-block text-muted">Lorem ipsum</a></li>
                                        <li><a href="#" className="py-2 d-block text-muted">Lorem ipsum</a></li>
                                        <li><a href="#" className="py-2 d-block text-muted">Lorem ipsum</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="row">

                        {products.map((product) => {
                            return <div className="col-md-6" key={product.id}>
                                <div className="card border-0 mb-4 position-relative position-relative">
                                    <img src={product.imageUrl} className="card-img-top rounded-0" alt="..." />
                                    <div className="card-body p-0 text-center">
                                        <h4 className="mb-0 mt-3"><Link to={`/product/${product.id}`}>{product.title}</Link></h4>
                                        <p className="card-text mb-0">NT${product.price}</p>
                                        <p className="text-muted mt-3"></p>
                                    </div>
                                </div>
                            </div>
                        })}

                    </div>
                    <Pagenation pagination={pagination} changePage={getProducts}/>
                </div>
            </div>
        </div>
        <div className="bg-light py-4">
            <div className="container">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center align-items-start">
                    <p className="mb-0 fw-bold">Lorem ipsum dolor sit amet.</p>
                    <div className="input-group w-md-50 mt-md-0 mt-3">
                        <input type="text" className="form-control rounded-0" placeholder="" />
                        <div className="input-group-append">
                            <button className="btn btn-dark rounded-0" type="button" id="search">
                                Lorem ipsum
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}