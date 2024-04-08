import { useContext, useEffect } from "react";
import { FrontData } from "../../../store/frontStore";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";

export default function MemberProfile() {
  const { user } = useContext(FrontData);
  const navigate = useNavigate(null);

  //若會員資料還沒有填寫過，就先進新增資料頁面
  useEffect(() => {
    if (user.user?.realName === "") {
      navigate("/member/memberaddprofile");
    }
  }, [user]);

  const DataList = ({ text, data }) => {
    return (
      <div
        className="d-flex mb-2 align-items-center py-3"
        style={{ borderBottom: "3px solid black" }}
      >
        <Button
          text={text}
          myClass="col-3 col-md-2 py-3 rounded-3 text-dark cursor-default"
          bg="light"
        />
        <div className="col-8 ps-3 py-3">{data}</div>
      </div>
    );
  };

  return (
    <>
      <div className="d-flex">
        <h3 className="fs-3 fw-bolder">會員資料</h3>
        <Button
          text="更改"
          myClass="ms-auto me-3"
          bg="dark"
          linkto="/member/memberaddprofile"
        />
      </div>
      <div className="container mt-3 d-flex flex-column justify-content-around">
        <DataList text="暱稱" data={user.user?.displayName} />
        <DataList text="姓名" data={user.user?.realName} />
        <DataList text="E-mail" data={user.user?.email} />
        <DataList text="地址" data={user.user?.address} />
        <DataList text="電話" data={user.user?.phoneNumber} />
      </div>
    </>
  );
}
