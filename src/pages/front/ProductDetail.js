import { useEffect, useState, useContext, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFeatherPointed,
  faBoltLightning,
} from "@fortawesome/free-solid-svg-icons";
import { FrontData, messageAlert } from "../../store/frontStore";
import { db } from "../../utils/firebase";
import Banner from "../../components/Banner";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/variants";
import Button from "../../components/Button";

export default function ProductDetail() {
  const { id } = useParams();
  const { getCart, allProducts, user, cart } = useContext(FrontData);
  const [product, setProduct] = useState({});
  const [otherProducts, setOtherProducts] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const navigate = useNavigate(null);

  //偵測頁面上所有產品更動數量
  const changeQty = useCallback(
    (i, type) => {
      const index = quantity.findIndex((val) => {
        return val.product_id === i;
      });
      if (type === "plus") {
        setQuantity((pre) =>
          pre.map((item, idx) =>
            idx === index ? { ...item, qty: item.qty + 1 } : item,
          ),
        );
      } else {
        quantity.find((val) => {
          return val.product_id === i;
        }).qty === 1 ||
          setQuantity((pre) =>
            pre.map((item, idx) =>
              idx === index ? { ...item, qty: item.qty - 1 } : item,
            ),
          );
      }
    },
    [quantity],
  );

  //隨機三樣推薦相同分類產品
  const filterOther = useCallback((array) => {
    if (array.length <= 3) {
      return array;
    } else {
      const other = [];
      for (let i = 1; i <= 3; i++) {
        const randomIndex = Math.floor(Math.random() * array.length);
        other.push(array[randomIndex]);
        array.splice(randomIndex, 1);
      }
      return other;
    }
  }, []);

  //取得完整產品列表，抓取id品項且列出同分類

  useEffect(() => {
    const itemProduct = allProducts.find((val) => val.id === id);
    const otherProductList = filterOther(
      allProducts.filter((val) => {
        return val.category === itemProduct.category && val.id !== id;
      }),
    );
    setProduct(itemProduct);
    setOtherProducts(otherProductList);
    if (!itemProduct) return;
    setQuantity(
      [itemProduct, ...otherProductList].map((val) => {
        return { product_id: val.id, qty: 1 };
      }),
    );
  }, [id, allProducts]);

  //加入購物車
  //1.若尚未有購物車就建立一筆購物車資料
  //2.若有購物車且內無此產品就加入此資料
  //3.若有購物車且已有產品就更新數量
  const submit = async (id) => {
    const itemPrice =
      quantity.find((val) => {
        return val.product_id === id;
      }).qty *
      allProducts.find((val) => {
        return val.id === id;
      }).price;
    const itemQty = quantity.find((val) => {
      return val.product_id === id;
    }).qty;
    if (!user.user) {
      navigate("../login");
      return;
    } else {
      try {
        if (cart.length === 0) {
          await setDoc(doc(db, "carts", user.user.uid), {
            carts: [
              {
                product: allProducts.find((val) => {
                  return val.id === id;
                }),
                qty: itemQty,
                total: itemPrice,
              },
            ],
            total: itemPrice,
            final_total: itemPrice,
          });
        } else {
          const cartDoc = await getDoc(doc(db, "carts", user.user.uid));
          const hadProduct = cartDoc
            .data()
            .carts.findIndex((item) => item.product.id === id);
          let aa = structuredClone(cartDoc.data());
          if (hadProduct >= 0) {
            await updateDoc(doc(db, "carts", user.user.uid), {
              carts: aa.carts.map((item, index) => {
                if (index === hadProduct) {
                  return {
                    ...aa.carts[hadProduct],
                    qty: (cartDoc.data().carts[hadProduct].qty += itemQty),
                    total: (cartDoc.data().carts[hadProduct].total +=
                      itemPrice),
                  };
                }
                return item;
              }),
              total: (cartDoc.data().total += itemPrice),
              final_total: (cartDoc.data().final_total += itemPrice),
            });
          } else {
            await updateDoc(doc(db, "carts", user.user.uid), {
              carts: [
                ...aa.carts,
                {
                  product: allProducts.find((val) => {
                    return val.id === id;
                  }),
                  qty: itemQty,
                  total: itemPrice,
                },
              ],
              total: (cartDoc.data().total += itemPrice),
              final_total: (cartDoc.data().final_total += itemPrice),
            });
          }
        }
        getCart();
        messageAlert("success", "新增成功");
      } catch (err) {
        messageAlert("error", "新增失敗");
        console.log(err);
      }
    }
  };

  return (
    <>
      {product && (
        <>
          <Banner bgImg="https://nunforest.com/fast-foody/burger/upload/banners/ban2.jpg" />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="container d-flex flex-column flex-sm-row align-items-center mt-4"
          >
            <motion.div
              variants={fadeIn("up", 0.15)}
              className="col-sm-5 text-center"
            >
              <img
                className="img-fluid object-fit-cover"
                style={{ width: "100%" }}
                src={product.imageUrl}
                alt={product.title}
              />
            </motion.div>
            <motion.div
              variants={fadeIn("up", 0.25)}
              className="col-sm-7 mt-2 mt-sm-0 d-flex flex-column align-items-center"
            >
              <div>
                <h4 className="fw-bolder text-center">
                  <FontAwesomeIcon
                    className="detailDeco_feather"
                    icon={faFeatherPointed}
                  />
                  {product.title}
                  <FontAwesomeIcon
                    className="detailDeco_feather"
                    icon={faFeatherPointed}
                    flip="horizontal"
                  />
                </h4>
                <span>{product.description}</span>
              </div>
              <p className="card-text mb-0 mt-3">
                NT${product.price}{" "}
                <span className="text-muted">
                  <del>NT${product.origin_price}</del>
                </span>
              </p>
              <div className="d-flex align-items-center mt-3">
                <div>數量:</div>
                <div className="input-group ms-3" style={{ width: "150px" }}>
                  <div className="input-group-prepend">
                    <button
                      type="button"
                      className="h-100 btn btn-dark btn-sm"
                      onClick={() => {
                        changeQty(product.id, "min");
                      }}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                  </div>
                  <input
                    type="number"
                    className="form-control form-control-sm text-center"
                    value={
                      quantity.find((val) => val.product_id === product.id)
                        ?.qty || 1
                    }
                    readOnly
                  />
                  <div className="input-group-prepend">
                    <button
                      type="button"
                      className="h-100 btn btn-dark btn-sm"
                      onClick={() => {
                        changeQty(product.id, "plus");
                      }}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="position-relative">
                <Button
                  text="加入購物車"
                  bg="dark"
                  myClass="w-200 mt-4"
                  click={() => {
                    submit(product.id);
                  }}
                />
                <FontAwesomeIcon
                  className="detailDeco_lighting"
                  icon={faBoltLightning}
                />
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            variants={fadeIn("up", 0.15)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="my-5"
          >
            <p className="bg-dark text-center text-white py-2">成分</p>
            <p className="ps-3" style={{ whiteSpace: "pre-line" }}>
              {product.content}
            </p>
          </motion.div>
          <hr />
          <h4 className="text-center">其他可參考的品項</h4>
          <div className="d-flex flex-wrap justify-content-center">
            {otherProducts.map((product, idx) => {
              return (
                <motion.div
                  key={product.id}
                  className="productsList myHover card text-center m-3 p-1"
                  style={{ maxWidth: "300px" }}
                  variants={fadeIn("up", 0.25)}
                  initial="hidden"
                  whileInView="show"
                  whileHover="hover"
                  viewport={{ once: true }}
                >
                  <div className="card-body">
                    <Link
                      to={`/product/${product.id}`}
                      className="productsList text-decoration-none"
                    >
                      <div className="position-relative">
                        <motion.img
                          variants={{
                            hover: {
                              top: 0,
                              left: 0,
                            },
                          }}
                          className="recomend_deco"
                          style={{ transform: "scaleX(-1)" }}
                          src="https://demo2.pavothemes.com/poco/wp-content/uploads/2020/08/h1_thunder-1.png"
                          alt=""
                        />
                        <motion.img
                          variants={{
                            hover: {
                              top: 0,
                              right: 0,
                            },
                          }}
                          className="recomend_decoRight"
                          src="https://demo2.pavothemes.com/poco/wp-content/uploads/2020/08/h1_thunder-1.png"
                          alt=""
                        />
                        <img
                          className="card-img-top"
                          src={product.imageUrl}
                          alt={product?.title}
                        />
                      </div>
                      <p className="fs-4">{product.title}</p>
                      <p>
                        NT${product.price}{" "}
                        <span className="text-muted">
                          <del>NT${product.origin_price}</del>
                        </span>
                      </p>
                    </Link>
                    <div className="d-flex align-items-center">
                      <div>數量:</div>
                      <div
                        className="input-group ms-3"
                        style={{ width: "150px" }}
                      >
                        <div className="input-group-prepend">
                          <button
                            className="h-100 btn btn-dark btn-sm"
                            onClick={() => {
                              changeQty(product.id, "min");
                            }}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                        </div>
                        <input
                          type="number"
                          className="form-control form-control-sm text-center"
                          value={
                            quantity.find(
                              (val) => val.product_id === product.id,
                            )?.qty || 1
                          }
                          readOnly
                        />
                        <div className="input-group-prepend">
                          <button
                            className="h-100 btn btn-dark btn-sm"
                            onClick={() => {
                              changeQty(product.id, "plus");
                            }}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <Button
                      text="加入購物車"
                      bg="dark"
                      myClass="mt-2 mx-auto"
                      click={() => {
                        submit(product.id);
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
