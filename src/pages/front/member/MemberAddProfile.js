import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { FrontData } from "../../../store/frontStore";
import { db } from "../../../utils/firebase";

export default function MemberAddProfile() {
  const { user, checkUserData } = useContext(FrontData);
  const [data, setData] = useState({
    displayName: user.user?.displayName,
    realName: user.user?.realName,
    phoneNumber: user.user?.phoneNumber,
    address: user.user?.address,
  });

  const handleData = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    try {
      await updateDoc(doc(db, "users", user.user.uid), data);
      checkUserData(user.user);
      navigate("/member/memberprofile");
    } catch (err) {
      console.error("匯入Error: ", err);
    }
  };

  return (
    <>
      {user.user?.realName === "" ? (
        <h3>新增會員資料</h3>
      ) : (
        <h3>變更會員資料</h3>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-3 h-100 d-flex flex-column gap-3 text-center"
      >
        <div className="bg-light d-flex align-items-center p-3">
          <label htmlFor="memberDisplayName" className="col-2">
            暱稱
          </label>
          <div className="d-flex align-items-center flex-wrap border col-10">
            <input
              {...register("displayName", { required: true })}
              name="displayName"
              value={data?.displayName}
              id="memberDisplayName"
              type="text"
              className="col-12 col-md-7 rounded-4 p-2"
              maxLength={10}
              onChange={handleData}
            />
            <div className="ps-2 fw-light">
              {errors.displayName && (
                <span className="errorAlert pe-2">請填寫喔</span>
              )}
              僅於網路顯示，最多十字
            </div>
          </div>
        </div>
        <div className="bg-light d-flex align-items-center p-3">
          <label htmlFor="memberRealName" className="col-2">
            姓名
          </label>
          <div className="d-flex align-items-center flex-wrap border col-10">
            <input
              {...register("realName", { required: true })}
              name="realName"
              value={data.realName}
              id="memberRealName"
              type="text"
              className="col-12 col-md-7 rounded-4 p-2"
              maxLength={10}
              onChange={handleData}
            />
            <div className="ps-2 fw-light">
              {errors.realName && (
                <span className="errorAlert pe-2">請填寫喔</span>
              )}
              預設外送用真名，最多十字
            </div>
          </div>
        </div>
        <div className="bg-light d-flex align-items-center p-3">
          <label htmlFor="memberAddress" className="col-2">
            地址
          </label>
          <div className="d-flex align-items-center flex-wrap border col-10">
            <input
              {...register("address", { required: true })}
              name="address"
              value={data.address}
              id="memberAddress"
              type="text"
              className="col-12 col-md-7 rounded-4 p-2"
              maxLength={10}
              onChange={handleData}
            />
            <div className="ps-2 fw-light">
              {errors.address && (
                <span className="errorAlert pe-2">請填寫喔</span>
              )}
              預設外送用地址
            </div>
          </div>
        </div>
        <div className="bg-light d-flex align-items-center p-3">
          <label htmlFor="memberDisplayName" className="col-2">
            電話
          </label>
          <div className="d-flex align-items-center flex-wrap border col-10">
            <input
              {...register("phoneNumber", { required: true })}
              name="phoneNumber"
              value={data.phoneNumber}
              id="memberDisplayName"
              type="tel"
              className="col-12 col-md-7 rounded-4 p-2"
              maxLength={10}
              onChange={handleData}
            />
            <div className="ps-2 fw-light">
              {errors.phoneNumber && (
                <span className="errorAlert pe-2">請填寫喔</span>
              )}
              預設外送用電話
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-dark py-3">
          儲存資料
        </button>
      </form>
    </>
  );
}
