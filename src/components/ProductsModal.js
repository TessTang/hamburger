import { useEffect, useState, useContext } from "react";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from "../store/messageStore";
import { doc, setDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

export default function ProductsModal({
  closeAddProduct,
  getProducts,
  type,
  tempProduct,
}) {
  const [, dispatch] = useContext(MessageContext);

  const [tempData, setTempData] = useState({
    title: "",
    category: "dessert",
    origin_price: 80,
    price: 40,
    unit: "個",
    description: "",
    content: "",
    is_enabled: 0,
    imageUrl: "",
  });

  useEffect(() => {
    if (type === "create") {
      setTempData({
        title: "",
        category: "dessert",
        origin_price: 80,
        price: 40,
        unit: "個",
        description: "",
        content: "",
        is_enabled: 0,
        imageUrl: "",
      });
    } else if (type === "edit") {
      setTempData(tempProduct);
    }
  }, [type, tempProduct]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (["origin_price", "price"].includes(name)) {
      setTempData((pre) => {
        return { ...pre, [name]: Number(value) };
      });
    } else if (name === "is_enabled") {
      setTempData((pre) => {
        return { ...pre, [name]: +checked };
      });
    } else {
      setTempData((pre) => {
        return { ...pre, [name]: value };
      });
    }
  };

  //create=>寫入資料庫 edit=>update資料庫
  const submit = async () => {
    if (type === "create") {
      try {
        const newProduct = doc(collection(db, "products"));
        await setDoc(newProduct, {
          ...tempData,
          id: newProduct.id,
        });
        handleSuccessMessage(dispatch, "新增成功");
      } catch (err) {
        handleErrorMessage(dispatch, "新增失敗");
      }
    } else if (type === "edit") {
      try {
        await updateDoc(doc(db, "products", tempData.id), tempData);
        handleSuccessMessage(dispatch, "更改成功");
      } catch (err) {
        handleErrorMessage(dispatch, "更改失敗");
      }
    }

    closeAddProduct();
    getProducts();
  };

  return (
    <div
      className="modal fade"
      id="productModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      data-bs-backdrop="static"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {type === "create" ? "建立新商品" : `編輯 ${tempData.title}`}
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeAddProduct}
            />
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-sm-4">
                <div className="form-group mb-2">
                  <label className="w-100" htmlFor="image">
                    輸入圖片網址
                    <input
                      type="text"
                      name="imageUrl"
                      id="image"
                      placeholder="請輸入圖片連結"
                      className="form-control"
                      onChange={handleChange}
                      value={tempData.imageUrl}
                    />
                  </label>
                </div>
                <div className="form-group mb-2">
                  <label className="w-100" htmlFor="customFile">
                    或 上傳圖片
                    <input
                      type="file"
                      id="customFile"
                      className="form-control"
                    />
                  </label>
                </div>
                <img src="" alt="" className="img-fluid" />
              </div>
              <div className="col-sm-8">
                <div className="form-group mb-2">
                  <label className="w-100" htmlFor="title">
                    標題
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="請輸入標題"
                      className="form-control"
                      onChange={handleChange}
                      value={tempData.title}
                    />
                  </label>
                </div>
                <div className="row">
                  <div className="form-group mb-2 col-md-6">
                    <label className="w-100" htmlFor="category">
                      分類
                      <input
                        type="text"
                        id="category"
                        name="category"
                        placeholder="請輸入分類"
                        className="form-control"
                        onChange={handleChange}
                        value={tempData.category}
                      />
                    </label>
                  </div>
                  <div className="form-group mb-2 col-md-6">
                    <label className="w-100" htmlFor="unit">
                      單位
                      <input
                        type="unit"
                        id="unit"
                        name="unit"
                        placeholder="請輸入單位"
                        className="form-control"
                        onChange={handleChange}
                        value={tempData.unit}
                      />
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group mb-2 col-md-6">
                    <label className="w-100" htmlFor="origin_price">
                      原價
                      <input
                        type="number"
                        id="origin_price"
                        name="origin_price"
                        placeholder="請輸入原價"
                        className="form-control"
                        onChange={handleChange}
                        value={tempData.origin_price}
                      />
                    </label>
                  </div>
                  <div className="form-group mb-2 col-md-6">
                    <label className="w-100" htmlFor="price">
                      售價
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="請輸入售價"
                        className="form-control"
                        onChange={handleChange}
                        value={tempData.price}
                      />
                    </label>
                  </div>
                </div>
                <hr />
                <div className="form-group mb-2">
                  <label className="w-100" htmlFor="description">
                    產品描述
                    <textarea
                      type="text"
                      id="description"
                      name="description"
                      placeholder="請輸入產品描述"
                      className="form-control"
                      onChange={handleChange}
                      value={tempData.description}
                    />
                  </label>
                </div>
                <div className="form-group mb-2">
                  <label className="w-100" htmlFor="content">
                    說明內容
                    <textarea
                      type="text"
                      id="content"
                      name="content"
                      placeholder="請輸入產品說明內容"
                      className="form-control"
                      onChange={handleChange}
                      value={tempData.content}
                    />
                  </label>
                </div>
                <div className="form-group mb-2">
                  <div className="form-check">
                    <label
                      className="w-100 form-check-label"
                      htmlFor="is_enabled"
                    >
                      是否啟用
                      <input
                        type="checkbox"
                        id="is_enabled"
                        name="is_enabled"
                        placeholder="請輸入產品說明內容"
                        className="form-check-input"
                        onChange={handleChange}
                        checked={!!tempData.is_enabled}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeAddProduct}
            >
              關閉
            </button>
            <button type="button" className="btn btn-primary" onClick={submit}>
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
