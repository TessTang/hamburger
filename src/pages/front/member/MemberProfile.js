import { Link } from "react-router-dom";

export default function MemberProfile() {
    return (<>
        <div className="d-flex">
            <h3>會員資料</h3>
            <Link to='/member/memberaddprofile' className="ms-auto btn btn-dark">更改</Link>
        </div>
        <div className="h-100 d-flex flex-column justify-content-around">
            <div className="bg-light d-flex align-items-center p-3">
                <div className="col-2">暱稱</div>
                <div className="col-8 ps-2">11</div>
            </div>
            <div className="bg-light d-flex align-items-center p-3">
                <div className="col-2">姓名</div>
                <div className="col-8 ps-2">湯</div>
            </div>
            <div className="bg-light d-flex align-items-center p-3">
                <div className="col-2">E-mail</div>
                <div className="col-8 ps-2">123456@gmail.com</div>
            </div>
            <div className="bg-light d-flex align-items-center p-3">
                <div className="col-2">地址</div>
                <div className="col-8 ps-2">台中台中台中台中台中台中台中台中台中台中台中台中台中台中台中台中台中台中台中台中台中</div>
            </div>
            <div className="bg-light d-flex align-items-center p-3">
                <div className="col-2">電話</div>
                <div className="col-8 ps-2">09123456</div>
            </div>
        </div>
    </>
    )
}