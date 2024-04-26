import { useEffect, useRef, useState, useCallback } from "react";

import { Modal } from "bootstrap";
import { doc, getDocs, collection, deleteDoc } from "firebase/firestore";

import BlogsModal from "../../components/admin/BlogsModal";
import DeleteModal from "../../components/DeleteModal";
import Pagenation from "../../components/Pagenation";

import { db } from "../../utils/firebase";

const itemsPerPage = 10;

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [type, setType] = useState("create");
  const [tempBlog, setTempBlog] = useState({});

  const blogModal = useRef(null);
  const deleteModal = useRef(null);

  //1.拿到全部的資料
  //2.轉換成pagenation與每頁對應資料  換頁時get對應頁面的funciton
  const getBlogs = async (page = 1) => {
    try {
      const queryBlogs = await getDocs(collection(db, "blogs"));
      const blogsArray = queryBlogs.docs
        .map((doc) => ({
          ...doc.data(),
        }))
        .sort((a, b) => {
          return b.date - a.date;
        });

      setAllBlogs(blogsArray);
    } catch (error) {
      alert(error);
    }
  };

  const getPage = useCallback(
    (page = 1) => {
      const totalPage = Math.ceil(allBlogs.length / itemsPerPage);
      const getBlogsForPage = (page) => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return allBlogs.slice(startIndex, endIndex);
      };

      setPagination({
        total_pages: totalPage,
        current_page: page,
        has_pre: page > 1,
        has_next: page < totalPage,
        category: "",
      });
      setBlogs(getBlogsForPage(page));
    },
    [allBlogs],
  );

  //creat and edit Blog
  const openAddBlog = (type, tempBlog) => {
    setType(type);
    setTempBlog(tempBlog);
    blogModal.current.show();
  };

  const closeAddBlog = () => {
    blogModal.current.hide();
  };

  //delete Blog
  const openDeleteBlog = (tempBlog) => {
    setTempBlog(tempBlog);
    deleteModal.current.show();
  };

  const closeDeleteBlog = () => {
    deleteModal.current.hide();
  };

  const deleteBlogs = async () => {
    try {
      await deleteDoc(doc(db, "blogs", tempBlog.id));
      getBlogs();
      closeDeleteBlog();
    } catch (error) {
      alert(error);
    }
  };

  //設定時間格式
  function formatUnixTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // 轉換為毫秒
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份從0開始，需加1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  //進入頁面獲取blogs資訊
  useEffect(() => {
    blogModal.current = new Modal("#blogModal");
    deleteModal.current = new Modal("#deleteModal");
    getBlogs();
  }, []);

  //得到blogs後進行分頁動作
  useEffect(() => {
    if (allBlogs.length !== 0) {
      getPage();
    }
  }, [allBlogs, getPage]);

  return (
    <div className="p-3">
      <BlogsModal
        closeAddBlog={closeAddBlog}
        getBlogs={getBlogs}
        type={type}
        tempBlog={tempBlog}
      />
      <DeleteModal
        close={closeDeleteBlog}
        text={tempBlog.title}
        handleDelete={deleteBlogs}
      />
      <h3>專欄列表</h3>
      <hr />
      <div className="text-end">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            openAddBlog("create", {});
          }}
        >
          建立新文章
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">分類</th>
            <th scope="col">名稱</th>
            <th scope="col">日期</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((article) => {
            return (
              <tr key={article.id}>
                <td>{article.category}</td>
                <td>{article.title}</td>
                <td>{formatUnixTimestamp(article.date)}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      openAddBlog("edit", article);
                    }}
                  >
                    編輯
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={() => {
                      openDeleteBlog(article);
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

      <Pagenation pagination={pagination} changePage={getPage} />
    </div>
  );
}
