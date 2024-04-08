import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import { motion, useAnimationControls } from "framer-motion";
import { FrontData } from "../../store/frontStore";
import { fadeIn } from "../../utils/variants";
import Pagenation from "../../components/Pagenation";
import Banner from "../../components/Banner";

export default function Products() {
  const [productCategory, setProductCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState([]);
  const { isLoading, allProducts } = useContext(FrontData);
  const [sort, setSort] = useState("");
  const controls = useAnimationControls();

  //一進入就抓取產品資料，更改產品分類重新抓取
  useEffect(() => {
    getPage();
  }, [productCategory, isLoading, sort]);

  //取得全部資料後將資料分頁
  const getPage = (page = 1) => {
    controls.stop();
    const productList =
      productCategory === "all"
        ? allProducts
        : allProducts.filter((item) => item.category === productCategory);
    const itemsPerPage = 10; // 每頁顯示的資料數量
    const totalPage = Math.ceil(productList.length / itemsPerPage);
    const getProductsForPage = (page) => {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      if (sort === "up") {
        return productList.slice(startIndex, endIndex).sort((a, b) => {
          return a.price - b.price;
        });
      } else if (sort === "down") {
        return productList.slice(startIndex, endIndex).sort((a, b) => {
          return b.price - a.price;
        });
      }
      return productList.slice(startIndex, endIndex);
    };

    setPagination({
      total_pages: totalPage,
      current_page: page,
      has_pre: page > 1,
      has_next: page < totalPage,
      category: "",
    });
    setProducts(getProductsForPage(page));
  };

  //framer motion

  useEffect(() => {
    controls.set((i) => ({
      opacity: 0,
      y: 75,
    }));
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15 },
    }));
  }, [controls, products]);

  //分類標籤元件
  const ListItem = ({ title, text, img }) => {
    return (
      <ListGroup.Item
        as="li"
        className={`${productCategory === `${title}` && "active"} myHover`}
        onClick={() => {
          setProductCategory(`${title}`);
        }}
      >
        <img src={img} className="productIcon" alt="product_icon" />
        {text}
      </ListGroup.Item>
    );
  };

  return (
    <>
      <Banner bgImg="https://nunforest.com/fast-foody/burger/upload/banners/ban2.jpg" />
      <div className="container mt-md-5 mt-3 mb-7">
        <div className="row">
          {/* left side */}
          <motion.div
            variants={fadeIn("right", 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="col-md-3"
          >
            <div className="accordion border border-bottom border-top-0 border-start-0 border-end-0 mb-3">
              <div className="card border-0 text-center">
                <div className="card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0">
                  <div className="d-flex justify-content-between align-items-center pe-1 mb-2">
                    <h4 className="mb-0 fw-bold">產品分類</h4>
                    <i className="bi bi-tag fs-4"></i>
                  </div>
                  <ListGroup as="ul" className="fs-4">
                    <ListItem
                      title="all"
                      text="全部品項"
                      img="https://cdn-icons-png.flaticon.com/128/1509/1509483.png"
                    />
                    <ListItem
                      title="hamburger"
                      text="漢堡"
                      img="https://cdn-icons-png.flaticon.com/128/2497/2497906.png"
                    />
                    <ListItem
                      title="chicken"
                      text="炸雞"
                      img="https://cdn-icons-png.flaticon.com/128/2497/2497905.png"
                    />
                    <ListItem
                      title="drink"
                      text="飲料"
                      img="https://cdn-icons-png.flaticon.com/128/2769/2769608.png"
                    />
                    <ListItem
                      title="dessert"
                      text="點心"
                      img="https://cdn-icons-png.flaticon.com/128/2497/2497904.png"
                    />
                  </ListGroup>
                </div>
              </div>
            </div>
          </motion.div>
          {/* right side */}
          <div className="col-md-9">
            <div className="product_sort d-flex">
              <span>價格排序</span>
              <ListGroup horizontal>
                <ListGroup.Item
                  className={`price_Sort ${sort === "up" && "active"}`}
                  onClick={() => {
                    setSort("up");
                  }}
                >
                  升序
                </ListGroup.Item>
                <ListGroup.Item
                  className={`price_Sort ${sort === "down" && "active"}`}
                  onClick={() => {
                    setSort("down");
                  }}
                >
                  降序
                </ListGroup.Item>
              </ListGroup>
            </div>
            <div className="row row-cols-xl-3">
              {products.length !== 0 &&
                products.map((product, idx) => {
                  return (
                    <motion.div
                      className="col-md-6 position-relative"
                      key={product.id}
                      custom={idx}
                      animate={controls}
                      whileHover="hover"
                    >
                      <Link
                        to={`/product/${product.id}`}
                        className="text-decoration-none card border-0 mb-4 position-relative myHover p-2"
                      >
                        <img
                          src={product.imageUrl}
                          className="card-img-top rounded-0"
                          alt={product.title}
                        />
                        <div className="card-body p-0 text-center">
                          <h4 className="mb-0 mt-3">{product.title}</h4>
                          <p className="card-text mb-0">NT${product.price}</p>
                          <p className="text-muted mt-3"></p>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
            </div>
            <Pagenation pagination={pagination} changePage={getPage} />
          </div>
        </div>
      </div>
    </>
  );
}
