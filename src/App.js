import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/DashBoard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminOrders from "./pages/admin/AdminOrders";
import FrontLayout from "./pages/front/FrontLayout";
import Home from "./pages/front/Home";
import Products from "./pages/front/Products";
import ProductDetail from "./pages/front/ProductDetail";
import Cart from "./pages/front/Cart";
import CheckOut from "./pages/front/CheckOut";
import OrderSuccess from "./pages/front/OrderSuccess";
import Member from "./pages/front/member/Member";
import MemberProfile from "./pages/front/member/MemberProfile";
import MemberOrders from "./pages/front/member/MemberOrders";
import MemberAddProfile from "./pages/front/member/MemberAddProfile";
import NotFound from "./pages/front/NotFound";
import Blog from "./pages/front/blog/Blog";
import BlogDetail from "./pages/front/blog/BlogDetail";
import BlogList from "./pages/front/blog/BlogList";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/admin" element={<Dashboard />}>
          <Route index path="products" element={<AdminProducts />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
        <Route path="/" element={<FrontLayout />}>
          <Route index element={<Home />} />

          <Route path="blogs" element={<Blog />}>
            <Route index element={<BlogList />} />
            <Route path="tag/:tag" element={<BlogList />} />
            <Route path="category/:category" element={<BlogList />} />
            <Route path=":id" element={<BlogDetail />} />
          </Route>

          <Route path="products" element={<Products />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="ordersuccess/:id" element={<OrderSuccess />} />
          <Route path="checkout" element={<CheckOut />} />
          <Route path="login" element={<Login />} />
          <Route path="member" element={<Member />}>
            <Route path="memberprofile" element={<MemberProfile />} />
            <Route path="memberaddprofile" element={<MemberAddProfile />} />
            <Route path="memberorders" element={<MemberOrders />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
