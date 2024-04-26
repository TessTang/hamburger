import { useEffect, useState, useContext } from "react";

import { doc, setDoc, collection, updateDoc } from "firebase/firestore";

import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from "../../store/messageStore";
import { db } from "../../utils/firebase";

export default function BlogsModal({ closeAddBlog, getBlogs, type, tempBlog }) {
  const [, dispatch] = useContext(MessageContext);
  const [tempData, setTempData] = useState({
    title: "",
    category: "",
    content: "",
    date: "",
    img: 0,
    tag: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "tag") {
      setTempData((pre) => {
        return { ...pre, [name]: value.split(",") };
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
        const newBlog = doc(collection(db, "blogs"));
        await setDoc(newBlog, {
          ...tempData,
          id: newBlog.id,
        });
        handleSuccessMessage(dispatch, "新增成功");
      } catch (err) {
        handleErrorMessage(dispatch, "新增失敗");
      }
    } else if (type === "edit") {
      try {
        await updateDoc(doc(db, "blogs", tempData.id), tempData);
        handleSuccessMessage(dispatch, "更改成功");
      } catch (err) {
        handleErrorMessage(dispatch, "更改失敗");
      }
    }

    closeAddBlog();
    getBlogs();
  };

  useEffect(() => {
    if (type === "create") {
      setTempData({
        title: "",
        category: "",
        content: "",
        date: Math.floor(Date.now() / 1000),
        img: "",
        tag: [],
      });
    } else if (type === "edit") {
      setTempData(tempBlog);
    }
  }, [type, tempBlog]);

  return (
    <div
      className="modal fade"
      id="blogModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      data-bs-backdrop="static"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {type === "create" ? "建立新文章" : `編輯 ${tempData.title}`}
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeAddBlog}
            />
          </div>
          <div className="modal-body">
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
              <div className="form-group mb-2">
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
            </div>
            <div className="row">
              <div className="form-group mb-2">
                <label className="w-100" htmlFor="img">
                  圖片
                  <input
                    type="text"
                    id="img"
                    name="img"
                    placeholder="請輸入圖片網址"
                    className="form-control"
                    onChange={handleChange}
                    value={tempData.img}
                  />
                </label>
              </div>
            </div>

            <div className="form-group mb-2">
              <label className="w-100" htmlFor="content">
                文章內容
                <textarea
                  type="text"
                  id="content"
                  name="content"
                  placeholder="請輸入文章"
                  className="form-control"
                  onChange={handleChange}
                  value={tempData.content}
                />
              </label>
            </div>
            <div className="form-group mb-2">
              <label className="w-100" htmlFor="tag">
                標籤[中間加入 , 分割]
                <textarea
                  type="text"
                  id="tag"
                  name="tag"
                  placeholder="請輸入標籤 中間加入 , 分割"
                  className="form-control"
                  onChange={handleChange}
                  value={tempData.tag}
                />
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeAddBlog}
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
