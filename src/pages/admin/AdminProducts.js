import { useCallback, useEffect, useRef, useState } from "react";

import { Modal } from "bootstrap";
import { doc, getDocs, collection, deleteDoc } from "firebase/firestore";

import ProductsModal from "../../components/admin/ProductsModal";
import DeleteModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";

import { db } from "../../utils/firebase";

const itemsPerPage = 10;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [type, setType] = useState("create");
  const [tempProduct, setTempProduct] = useState({});

  const productModal = useRef(null);
  const deleteModal = useRef(null);

  //1.拿到全部的資料
  //2.轉換成可以轉換Pagination與每頁對應資料  換頁時get對應頁面的funciton

  const getProducts = async (page = 1) => {
    try {
      const queryProducts = await getDocs(collection(db, "products"));
      const productsArray = queryProducts.docs.map((doc) => ({
        ...doc.data(),
      }));
      setAllProducts(productsArray);
    } catch (error) {
      alert(error);
    }
  };

  const getPage = useCallback(
    (page = 1) => {
      const totalPage = Math.ceil(allProducts.length / itemsPerPage);
      const getProductsForPage = (page) => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return allProducts.slice(startIndex, endIndex);
      };

      setPagination({
        total_pages: totalPage,
        current_page: page,
        has_pre: page > 1,
        has_next: page < totalPage,
        category: "",
      });
      setProducts(getProductsForPage(page));
    },
    [allProducts],
  );

  //creat and edit product
  const openAddProduct = (type, tempProduct) => {
    setType(type);
    setTempProduct(tempProduct);
    productModal.current.show();
  };

  const closeAddProduct = () => {
    productModal.current.hide();
  };

  //delete product

  const openDeleteProduct = (tempProduct) => {
    setTempProduct(tempProduct);
    deleteModal.current.show();
  };

  const closeDeleteProduct = () => {
    deleteModal.current.hide();
  };

  const deleteProducts = async () => {
    try {
      await deleteDoc(doc(db, "products", tempProduct.id));
      getProducts();
      closeDeleteProduct();
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    productModal.current = new Modal("#productModal");
    deleteModal.current = new Modal("#deleteModal");
    getProducts();
  }, []);

  useEffect(() => {
    if (allProducts.length !== 0) {
      getPage();
    }
  }, [allProducts, getPage]);

  return (
    <div className="p-3">
      <ProductsModal
        closeAddProduct={closeAddProduct}
        getProducts={getProducts}
        type={type}
        tempProduct={tempProduct}
      />
      <DeleteModal
        close={closeDeleteProduct}
        text={tempProduct.title}
        handleDelete={deleteProducts}
      />
      <h3>產品列表</h3>
      <hr />
      <div className="text-end">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            openAddProduct("create", {});
          }}
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
                <td>{product.is_enabled ? "啟用" : "未啟用"}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      openAddProduct("edit", product);
                    }}
                  >
                    編輯
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={() => {
                      openDeleteProduct(product);
                    }}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination pagination={pagination} changePage={getPage} />
    </div>
  );
}
