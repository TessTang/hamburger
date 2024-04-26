import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { doc, updateDoc } from "firebase/firestore";

import Button from "../../../components/Button";

import { FrontData, messageAlert } from "../../../store/frontStore";
import { db } from "../../../utils/firebase";

export default function MemberAddProfile() {
  const { user, checkUserData } = useContext(FrontData);
  const navigate = useNavigate(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    setValue("displayName", user.user?.displayName);
    setValue("realName", user.user?.realName);
    setValue("address", user.user?.address);
    setValue("phoneNumber", user.user?.phoneNumber);
  }, [user]);

  //送出後將資料寫入資料庫，並轉回profile頁面
  const onSubmit = async (data) => {
    try {
      await updateDoc(doc(db, "users", user.user.uid), data);
      checkUserData(user.user);
      navigate("/member/memberprofile");
    } catch (error) {
      messageAlert("warning", `噢!資料匯入過程中有誤，代碼:${error}`);
    }
  };

  const DataList = ({ text, children }) => {
    return (
      <div
        className="container d-flex align-items-center p-3"
        style={{ borderBottom: "3px solid black" }}
      >
        <label htmlFor="memberDisplayName" className="col-2">
          <Button
            text={text}
            myClass="py-2 rounded-3 text-dark cursor-default"
            bg="light"
          />
        </label>
        <div className="d-flex align-items-center flex-wrap col-10">
          {children}
        </div>
      </div>
    );
  };

  return (
    <>
      {user.user?.realName === "" ? (
        <h3>
          <i className="bi bi-person-gear" />
          新增會員資料
          <i className="bi bi-person-gear" />
        </h3>
      ) : (
        <h3>
          <i className="bi bi-person-gear" />
          變更會員資料
          <i className="bi bi-person-gear" />
        </h3>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-3 h-100 d-flex flex-column gap-3 text-center"
      >
        <DataList text="暱稱">
          <input
            {...register("displayName", { required: true })}
            name="displayName"
            id="memberDisplayName"
            type="text"
            className="col-12 col-md-7 rounded-4 p-2"
            maxLength={10}
          />
          <div className="ps-2 fw-light">
            {errors.displayName && (
              <span className="errorAlert pe-2">請填寫喔</span>
            )}
            僅於網路顯示，最多十字
          </div>
        </DataList>
        <DataList text="姓名">
          <input
            {...register("realName", { required: true })}
            name="realName"
            id="memberRealName"
            type="text"
            className="col-12 col-md-7 rounded-4 p-2"
            maxLength={10}
          />
          <div className="ps-2 fw-light">
            {errors.realName && (
              <span className="errorAlert pe-2">請填寫喔</span>
            )}
            預設外送用真名，最多十字
          </div>
        </DataList>
        <DataList text="地址">
          <input
            {...register("address", { required: true })}
            name="address"
            id="memberAddress"
            type="text"
            className="col-12 col-md-7 rounded-4 p-2"
            maxLength={10}
          />
          <div className="ps-2 fw-light">
            {errors.address && (
              <span className="errorAlert pe-2">請填寫喔</span>
            )}
            預設外送用地址
          </div>
        </DataList>
        <DataList text="電話">
          <input
            {...register("phoneNumber", {
              required: { value: true, message: "請填寫喔!" },
              pattern: {
                value: /^09\d{8}$/,
                message: "請填寫手機號碼，09開頭10碼數字",
              },
            })}
            name="phoneNumber"
            id="memberDisplayName"
            type="tel"
            className="col-12 col-md-7 rounded-4 p-2"
            maxLength={10}
          />
          <div className="ps-2 fw-light">
            {errors.phoneNumber && (
              <span className="errorAlert pe-2">
                {" "}
                {errors.phoneNumber?.message}
              </span>
            )}
            預設外送用電話
          </div>
        </DataList>

        <Button
          text="儲存資料"
          bg="dark"
          myClass="w-50 mx-auto py-3"
          click={handleSubmit(onSubmit)}
        />
      </form>
    </>
  );
}
