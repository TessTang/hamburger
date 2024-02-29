import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../../../utils/firebase";
import { signOut } from "firebase/auth";
import { CartData } from "../../../store/frontStore";
import { useContext, useEffect } from "react";

export default function Member() {
    const navigate = useNavigate(null);
    const { user, setUser } = useContext(CartData);

    useEffect(() => {
        console.log(user)
        if (!user.user) {
            navigate('../')
        }
    }, [user])

    return (<>
        <div className="container-fluid bg-secondary px-0 mt-2">
            <img className="img-fluid" src={require('../../../assets/banner.jpg')} alt="banners" />
        </div>
        <div className="d-flex" style={{ minHeight: 'calc(100vh - 56px)' }}>
            <div className="bg-light" style={{ width: '200px' }}>
                <ul className="list-group list-group-flush">
                    <Link className="list-group-item list-group-item-action py-3" to="/member/memberaddprofile">
                        <i className="bi bi-cup-fill me-2" />
                        新增會員資料
                    </Link>
                    <Link className="list-group-item list-group-item-action py-3" to="/member/memberprofile">
                        <i className="bi bi-cup-fill me-2" />
                        會員資料
                    </Link>
                    <Link className="list-group-item list-group-item-action py-3" to="/member/memberorders">
                        <i className="bi bi-ticket-perforated-fill me-2" />
                        訂單資料
                    </Link>
                    <button className="btn btn-dark mt-5" onClick={() => { signOut(auth); setUser({}); navigate('../') }}>登出</button>

                </ul>
            </div>
            <div className="w-100 py-3">
                <Outlet />
            </div>
        </div>
    </>)
}