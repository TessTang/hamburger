import { useEffect, useRef, useState } from "react";
import axios from "axios";
import CouponsModal from "../../components/CouponsModal";
import DeleteModal from "../../components/DeleteModal";
import Pagenation from "../../components/Pagenation";
import { Modal } from "bootstrap";
import { db } from "../../utils/firebase";
import { doc, getDocs, collection, deleteDoc } from "firebase/firestore";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [allCoupons, setAllCoupons] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [type, setType] = useState("create");
  const [tempCoupon, setTempCoupon] = useState({});

  const couponModal = useRef(null);
  const deleteModal = useRef(null);

  useEffect(() => {
    couponModal.current = new Modal("#couponModal");
    deleteModal.current = new Modal("#deleteModal");

    getCoupons();
  }, []);

  useEffect(() => {
    getPage();
  }, [allCoupons]);

  const getCoupons = async (page = 1) => {
    try {
      const queryProducts = await getDocs(collection(db, "coupons"));
      const productsArray = queryProducts.docs.map((doc) => ({
        ...doc.data(),
      }));
      setAllCoupons(productsArray);
    } catch (error) {
      console.log(error);
    }
  };

  const getPage = (page = 1) => {
    const itemsPerPage = 10; // 每頁顯示的資料數量
    const totalPage = Math.ceil(allCoupons.length / itemsPerPage);
    const getCouponsForPage = (page) => {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return allCoupons.slice(startIndex, endIndex);
    };

    setPagination({
      total_pages: totalPage,
      current_page: page,
      has_pre: page > 1,
      has_next: page < totalPage,
      category: "",
    });
    setCoupons(getCouponsForPage(page));
  };

  //creat and edit coupon
  const openAddCoupon = (type, tempCoupon) => {
    setType(type);
    setTempCoupon(tempCoupon);
    couponModal.current.show();
  };

  const closeAddCoupon = () => {
    couponModal.current.hide();
  };

  //delete coupon

  const openDeleteCoupon = (tempCoupon) => {
    setTempCoupon(tempCoupon);

    deleteModal.current.show();
  };

  const closeDeleteCoupon = () => {
    deleteModal.current.hide();
  };

  const deleteCoupons = async () => {
    try {
      await deleteDoc(doc(db, "coupons", tempCoupon.code));
      getCoupons();
      closeDeleteCoupon();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-3">
      <CouponsModal
        closeAddCoupon={closeAddCoupon}
        getCoupons={getCoupons}
        type={type}
        tempCoupon={tempCoupon}
      />
      <DeleteModal
        close={closeDeleteCoupon}
        text={tempCoupon.title}
        handleDelete={deleteCoupons}
      />
      <h3>優惠券列表</h3>
      <hr />
      <div className="text-end">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            openAddCoupon("create", {});
          }}
        >
          建立優惠券
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">標題</th>
            <th scope="col">折扣(元)</th>
            <th scope="col">到期日</th>
            <th scope="col">優惠碼</th>
            <th scope="col">啟用狀態</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => {
            return (
              <tr key={coupon.code}>
                <td>{coupon.title}</td>
                <td>{coupon.deduct}</td>
                <td>{`${new Date(coupon.due_date).getFullYear()}/${(new Date(coupon.due_date).getMonth() + 1).toString().padStart(2, "0")}/${new Date(coupon.due_date).getDate().toString().padStart(2, "0")}`}</td>
                <td>{coupon.code}</td>
                <td>{coupon.is_enabled ? "啟用" : "未啟用"}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      openAddCoupon("edit", coupon);
                    }}
                  >
                    編輯
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={() => {
                      openDeleteCoupon(coupon);
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

      <Pagenation pagination={pagination} changePage={getCoupons} />
    </div>
  );
}
