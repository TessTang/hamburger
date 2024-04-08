import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { FrontData } from "../../../store/frontStore";
import { db } from "../../../utils/firebase";
import Button from "../../../components/Button";

export default function MemberAddProfile() {
  const { user } = useContext(FrontData);
  const navigate = useNavigate(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // console.log(user)
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
      navigate("/member/memberprofile");
      window.location.reload();
    } catch (err) {
      console.error("匯入Error: ", err);
    }
  };

  const DataList = ({ text, data, children }) => {
    return (
      <div
        className="container d-flex align-items-center p-3"
        style={{ borderBottom: "3px solid black" }}
      >
        <label htmlFor="memberDisplayName" className="col-2">
          <Button
            text={text}
            myClass="py-2 rounded-3 text-dark"
            bg="light"
          ></Button>
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
        <h3>新增會員資料</h3>
      ) : (
        <h3>變更會員資料</h3>
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
            {...register("phoneNumber", { required: true })}
            name="phoneNumber"
            id="memberDisplayName"
            type="tel"
            className="col-12 col-md-7 rounded-4 p-2"
            maxLength={10}
          />
          <div className="ps-2 fw-light">
            {errors.phoneNumber && (
              <span className="errorAlert pe-2">請填寫喔</span>
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
