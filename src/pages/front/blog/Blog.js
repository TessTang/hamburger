import { useState, useEffect, useRef, useCallback } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";

import { useAnimationControls, useScroll, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";

import Banner from "../../../components/Banner";

import { messageAlert } from "../../../store/frontStore";
import { db } from "../../../utils/firebase";
import { fadeIn } from "../../../utils/variants";

const itemsPerPage = 10;

export default function Blog() {
  const [article, setArticle] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [allArticle, setAllArticle] = useState([]);

  const controls = useAnimationControls();
  const { tag, category, id } = useParams();

  const getBlog = async () => {
    try {
      const queryProducts = await getDocs(collection(db, "blogs"));
      const productsArray = queryProducts.docs
        .map((doc) => ({
          ...doc.data(),
        }))
        .sort((a, b) => {
          return b.date - a.date;
        });
      setAllArticle(productsArray);
    } catch (error) {
      messageAlert("warning", `噢!網頁有地方出錯了${error}`);
    }
  };

  //取得全部資料後將資料分頁
  const getPage = useCallback(
    (page = 1) => {
      controls.stop();
      let productList = [];
      if (tag) {
        productList = allArticle.filter((item) => item.tag.includes(tag));
      } else if (category) {
        productList =
          category === "all"
            ? allArticle
            : allArticle.filter((item) => item.category === category);
      } else {
        productList = allArticle;
      }
      const totalPage = Math.ceil(productList.length / itemsPerPage);
      const getProductsForPage = (page) => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return productList.slice(startIndex, endIndex);
      };

      setPagination({
        total_pages: totalPage,
        current_page: page,
        has_pre: page > 1,
        has_next: page < totalPage,
        category: "",
      });
      setArticle(getProductsForPage(page));
    },
    [allArticle, category, tag, controls],
  );

  //分類list item
  const ListItem = ({ title, text, img, myClass }) => {
    return (
      <Link
        to={`/blogs/category/${title}`}
        className="text-reset text-decoration-none"
      >
        <ListGroup.Item
          as="li"
          className={`${category === `${title}` && "active"} myHover ${myClass}`}
        >
          {" "}
          {img && <img src={img} className="productIcon" alt="product_icon" />}
          {text}
        </ListGroup.Item>
      </Link>
    );
  };

  //動畫區start
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], [0, scrollY - 300]);
  const x1 = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 1],
    [0, 60, 10, 80, 0],
  );
  const rotate1 = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 1],
    [0, 40, -20, 40, 0],
  );
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, 360]);

  //動畫區end

  useEffect(() => {
    getBlog();
  }, []);

  //0.1秒後抓取視窗高度
  useEffect(() => {
    setTimeout(() => {
      setScrollY(ref.current.scrollHeight);
    }, 100);
  }, [article, tag, category, id]);

  //抓取產品資料
  useEffect(() => {
    if (allArticle.length !== 0) {
      getPage();
    }
  }, [allArticle, getPage]);

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
  }, [controls, article]);

  return (
    <>
      <Banner bgImg="banner02.jpg">
        <h3 className="blog_bannerText">
          專欄{" "}
          <span>
            {tag ? `標籤: ${tag}` : category ? `分類: ${category}` : ""}
          </span>
        </h3>
      </Banner>
      <div ref={ref} className="container mt-md-5 mt-3 mb-7">
        <div className="row">
          {/* left side */}
          <div
            className={`col-md-9 col-md-6  order-md-1 ${id ? "order-1" : "order-2"}`}
          >
            <Outlet context={{ article, getPage, pagination, allArticle }} />
          </div>
          {/* right side */}
          <div className="col-md-3 order-1 order-md-1">
            <div className="accordion border border-bottom border-top-0 border-start-0 border-end-0 mb-3">
              <div className="card border-0 text-center">
                {/* 文章分類 */}
                <motion.div
                  variants={fadeIn("left", 0.09)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="card-header px-0 bg-white"
                >
                  <div className="d-flex justify-content-between align-items-center pe-1 mb-2">
                    <h4 className="mb-0 fw-bold">文章分類</h4>
                  </div>
                  <ListGroup as="ul" className="fs-5">
                    <ListItem
                      title="all"
                      text="全部"
                      img={require("../../../assets/blog/category_all.png")}
                    />
                    <ListItem
                      title="foods"
                      text="食物"
                      img={require("../../../assets/blog/category_foods.png")}
                    />
                    <ListItem
                      title="activity"
                      text="活動"
                      img={require("../../../assets/blog/category_activity.png")}
                    />
                    <ListItem
                      title="news"
                      text="店鋪信息"
                      img={require("../../../assets/blog/category_news.png")}
                    />
                  </ListGroup>
                </motion.div>
              </div>
              {/* 標籤分類 */}
              <motion.div
                variants={fadeIn("left", 0.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="card border-0 text-center"
              >
                <div className="card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0">
                  <div className="d-flex justify-content-between align-items-center pe-1 mb-2">
                    <h4 className="mb-0 fw-bold">標籤</h4>
                    <i className="bi bi-tag fs-4" />
                  </div>
                  <Stack direction="horizontal" gap={2} className="flex-wrap">
                    {[
                      ...new Set(
                        allArticle
                          .map((item) => {
                            return item.tag;
                          })
                          .flat(),
                      ),
                    ].map((item, idx) => {
                      return (
                        <Link
                          className="rounded-pill bg-success text-light p-2 text-decoration-none"
                          to={`/blogs/tag/${item}`}
                          key={idx}
                        >
                          {item}
                        </Link>
                      );
                    })}
                  </Stack>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        style={{ rotate: rotate1, x: x1, y: y1 }}
        className="position-absolute blog_deco"
      >
        <img
          src="https://modinatheme.com/html/foodking-html/assets/img/shape/vegetable.png"
          alt="blog_deco"
        />
      </motion.div>
      <motion.div
        style={{ rotate: rotate2, y: y1 }}
        className="position-absolute blog_deco"
      >
        <img
          src="https://modinatheme.com/html/foodking-html/assets/img/shape/burger-shape-2.png"
          alt="blog_deco"
        />
      </motion.div>
    </>
  );
}
