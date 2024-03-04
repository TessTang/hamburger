import { useContext } from "react";
import { FrontData } from '../../../store/frontStore';
import { Link } from "react-router-dom";

export default function MemberProfile() {

    const { user } = useContext(FrontData);

    return (<>
        <div className="d-flex">
            <h3>會員資料</h3>
            <Link to='/member/memberaddprofile' className="ms-auto btn btn-dark">更改</Link>
        </div>
        <div className="mt-3 gap-3 d-flex flex-column justify-content-around">
            <div className="bg-light d-flex align-items-center p-3">
                <div className="col-2">暱稱</div>
                <div className="col-8 ps-2">{user.user?.displayName}</div>
            </div>
            <div className="bg-light d-flex align-items-center p-3">
                <div className="col-2">姓名</div>
                <div className="col-8 ps-2">{user.user?.realName}</div>
            </div>
            <div className="bg-light d-flex align-items-center p-3">
                <div className="col-2">E-mail</div>
                <div className="col-8 ps-2">{user.user?.email}</div>
            </div>
            <div className="bg-light d-flex align-items-center p-3">
                <div className="col-2">地址</div>
                <div className="col-8 ps-2">{user.user?.address}</div>
            </div>
            <div className="bg-light d-flex align-items-center p-3">
                <div className="col-2">電話</div>
                <div className="col-8 ps-2">{user.user?.phoneNumber}</div>
            </div>
        </div>
    </>
    )
}