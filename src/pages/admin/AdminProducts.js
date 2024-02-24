import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ProductsModal from "../../components/ProductsModal";
import DeleteModal from "../../components/DeleteModal";
import Pagenation from "../../components/Pagenation";
import { Modal } from "bootstrap";

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState([]);
    const [type, setType] = useState('create');
    const [tempProduct, setTempProduct] = useState({});

    const productModal = useRef(null);
    const deleteModal = useRef(null);

    useEffect(() => {
        productModal.current = new Modal('#productModal');
        deleteModal.current = new Modal('#deleteModal');

        getProducts()
    }, [])

    const getProducts = async (page = 1) => {
        try {
            const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/products?page=${page}`);
            console.log('get',productRes);
            setProducts(productRes.data.products);
            setPagination(productRes.data.pagination)
        }
        catch (error) {
            console.log(error)
        }
    }

    //creat and edit product
    const openAddProduct = (type, tempProduct) => {
        setType(type);
        setTempProduct(tempProduct);
        productModal.current.show()
    }

    const closeAddProduct = () => {
        productModal.current.hide()
    }

    //delete product

    const openDeleteProduct = (tempProduct) => {
        setTempProduct(tempProduct);
        deleteModal.current.show()
    }

    const closeDeleteProduct = () => {
        deleteModal.current.hide()
    }

    const deleteProducts = async () => {
        try {
            console.log(products, tempProduct)
            await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${tempProduct.id}`);
            getProducts();
            closeDeleteProduct();
        }
        catch (error) {
            console.log(error)
        }
    }

    return (<div className="p-3">
        <ProductsModal closeAddProduct={closeAddProduct} getProducts={getProducts} 
        type={type} tempProduct={tempProduct}   />
       <DeleteModal close={closeDeleteProduct} text={tempProduct.title} handleDelete={deleteProducts}/>
        <h3>產品列表</h3>
        <hr />
        <div className="text-end">
            <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={()=>{openAddProduct('create', {})}}
            >
                建立新商品
            </button>
        </div>
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">分類</th>
                    <th scope="col">名稱</th>
                    <th scope="col">售價</th>
                    <th scope="col">啟用狀態</th>
                    <th scope="col">編輯</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => {
                    return (
                        <tr key={product.id}>
                            <td>{product.category}</td>
                            <td>{product.title}</td>
                            <td>{product.price}</td>
                            <td>{product.is_enabled ? '啟用' : '未啟用'}</td>
                            <td>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={()=>{openAddProduct('edit', product)}}
                                >
                                    編輯
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm ms-2"
                                    onClick={()=>{openDeleteProduct(product)}}
                                >
                                    刪除
                                </button>
                            </td>
                        </tr>
                    )
                })}


            </tbody>
        </table>

      <Pagenation pagination={pagination} changePage={getProducts}/>
    </div>)
}