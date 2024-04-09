import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBurger,
  faPlateWheat,
  faMotorcycle,
} from "@fortawesome/free-solid-svg-icons";
import { FrontData } from "../../store/frontStore";
import { ScrollTriggerProvider } from "../../components/ScrollTriggerProvider";
import {
  fadeIn,
  marqueeVariants,
  hoverScale,
  likeProduct_h4,
  likeProduct_icon,
  likeProduct_content,
  likeProduct_fire,
} from "../../utils/variants";
import Screen from "../../components/Screen";
import Button from "../../components/Button";

export default function Home() {
  const { allProducts } = useContext(FrontData);
  const [product, setProduct] = useState([]);

  //Title
  const SectionTitle = ({ text }) => {
    return (
      <motion.h2
        variants={fadeIn("up", 0.1)}
        initial="hidden"
        whileInView="show"
        className="mt-5 mb-3 myTitle"
      >
        {text}
        <span className="wave" />
      </motion.h2>
    );
  };
  //關於我Icon
  const AboutIcon = ({ icon, text, custom }) => {
    return (
      <motion.div
        variants={fadeIn("down", custom * 0.2)}
        whileHover="hover"
        className="col iconCard"
      >
        <div className="iconCard_Top px-3 py-4">
          <motion.div variants={hoverScale(1.5)} className="rounded-circle" />
          <FontAwesomeIcon icon={icon} className="iconCard_icon text-primary" />
        </div>
        <Button text={text} myClass="iconContent cursor-default" />
      </motion.div>
    );
  };

  //限時活動
  const Timer = ({ duration }) => {
    const [time, setTime] = useState(duration);
    useEffect(() => {
      setTimeout(() => {
        setTime(time - 1000);
      }, 1000);
    }, [time]);

    const getFormattedTime = (milliseconds) => {
      let seconds = parseInt((milliseconds / 1000) % 60);
      let minutes = parseInt((milliseconds / (1000 * 60)) % 60);
      let hours = parseInt((milliseconds / (1000 * 60 * 60)) % 24);
      let days = parseInt(milliseconds / (1000 * 60 * 60 * 24));
      return [
        { title: "Day", time: days },
        { title: "Hour", time: hours },
        { title: "Min", time: minutes },
        { title: "Sec", time: seconds },
      ];
    };
    return getFormattedTime(time).map((item) => {
      return (
        <div className="fs-1 calendar" key={item.title}>
          <p className="calendar_title">{item.title}</p>
          <p className="text-danger calendar_time">{item.time}</p>
        </div>
      );
    });
  };

  //取得完整產品列表，並列出隨機三樣
  useEffect(() => {
    const getProduct = async () => {
      try {
        const recomendProduct = [...allProducts];
        const other = [];
        for (let i = 1; i <= 3; i++) {
          const randomIndex = Math.floor(
            Math.random() * recomendProduct.length,
          );
          other.push(recomendProduct[randomIndex]);
          recomendProduct.splice(randomIndex, 1);
        }
        setProduct(other);
      } catch (error) {
        console.log(error);
      }
    };
    if (allProducts.length > 0) {
      getProduct();
    }
  }, [allProducts]);

  return (
    <>
      {/* <HomeBanner /> */}
      {/* 首頁第一區塊 */}
      <ScrollTriggerProvider>
        <Screen />
      </ScrollTriggerProvider>

      {/* 隨機推薦三款產品 */}

      <div className="container overflow-hidden">
        <SectionTitle text="猜你喜歡" />
        <div className="row my-2">
          {product.map((item, idx) => {
            return (
              <Link
                to={`/product/${item.id}`}
                key={item.id}
                className="col-md-4 mt-2 text-decoration-none"
              >
                <motion.div
                  variants={fadeIn("left", idx * 0.15)}
                  initial="hidden"
                  whileInView="show"
                  whileHover="hover"
                  className="card mb-4 h-100 myCard"
                >
                  <div className="overflow-hidden card-img-top_outer">
                    <img
                      src={item.imageUrl}
                      className="card-img-top rounded-0"
                      alt={item.title}
                    />
                  </div>

                  <motion.div
                    variants={likeProduct_content}
                    className="text-center"
                  >
                    <motion.h4 variants={likeProduct_h4}>
                      {item.title}
                      <motion.div
                        variants={likeProduct_icon}
                        className="d-inline-block ps-2"
                      >
                        <i className="bi bi-stars"></i>
                      </motion.div>
                    </motion.h4>
                    <div className="d-flex justify-content-between mt-1 myCardBody">
                      <p className="text-muted mb-0 p-3">{item.description}</p>
                    </div>
                    <motion.div
                      variants={likeProduct_fire}
                      className="productFire"
                    >
                      <img
                        src="https://themeholy.com/wordpress/pizzan/wp-content/themes/pizzan/assets/img/fire.png"
                        alt="fire_deco"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 關於我們 */}
      <div className="container full-height overflow-hidden">
        <SectionTitle text="關於我們" />
        <motion.div
          initial="hidden"
          whileInView="show"
          className="d-flex flex-column flex-xl-row justify-content-between gap-3"
        >
          <motion.div
            variants={fadeIn("right", 0.3)}
            whileHover="hover"
            className="home_aboutus_left position-relative col-xl-6"
          >
            <div className="home_aboutus_leftIMG">
              <motion.img
                variants={hoverScale(0.9)}
                src="https://demo2.wpopal.com/fazfood/wp-content/uploads/2023/10/h3_img.png"
                alt="hamburger"
              />
            </div>
            <div className="home_aboutus_leftBG">
              <h2>
                Hamburger <br />
                Hamburger
                <br />
                Hamburger
                <br />
                Hamburger
                <br />
                Hamburger
              </h2>
            </div>
          </motion.div>
          <motion.div
            variants={fadeIn("left", 0.3)}
            className="home_aboutus_right text-center"
          >
            <h3 className="fs-3 mt-4">對美食充滿熱情的漢堡店</h3>
            <p className="fs-4 my-5">
              每個漢堡都是精心製作，充滿幸福感。我們始於對美食的熱愛和速食的追求。不論您在工作間隙享用還是在家用餐，我們都提供最美味的漢堡和最貼心的服務。
            </p>
            <div className="row row-cols-1 row-cols-md-3 flex-grow-1">
              <AboutIcon
                custom="1"
                icon={faBurger}
                text={`嶄新視野中的\n 正確飲食！`}
              />
              <AboutIcon
                custom="2"
                icon={faPlateWheat}
                text={`使用天然\n 最優質的產品`}
              />
              <AboutIcon
                custom="3"
                icon={faMotorcycle}
                text={`最快速送達\n 您的家門`}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 促銷 */}
      <motion.div
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        whileInView="show"
        className="mh-100 mt-3 d-flex flex-column flex-xl-row promotion"
      >
        <motion.div
          variants={fadeIn("up", 0.8)}
          className="promotion_left col-12 col-xl-8"
        >
          <motion.img
            animate={{
              rotate: [-10, 10, -10],
              transition: {
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
              },
            }}
            className="promotion_leftDeco"
            src="https://cdn-icons-png.flaticon.com/256/478/478008.png"
            alt=""
          />
          <h3 className="text-warning promotion_lefth3">限時!!雙重美味</h3>

          <h4 className="fs-2 fs-bold">魚x雞雙享堡</h4>
          <p>
            夏日限定！多汁雞排與清爽鱈魚排的完美組合，一口咬下，感受兩種口感的絕妙融合！
          </p>
          <div>
            販售結束倒數計時
            <p>只到4/29!</p>
            <div className="d-flex mx-auto justify-content-around pt-5 clander_outer">
              <Timer
                duration={
                  new Date("2024-04-30T00:00:00").getTime() -
                  new Date().getTime()
                }
              ></Timer>
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={fadeIn("down", 0.8)}
          whileHover="hover"
          className="promotion_right"
        >
          <motion.img
            variants={hoverScale(1.1)}
            src="https://demo2.wpopal.com/fazfood/wp-content/uploads/2023/10/revslider_h2-buger.png"
            alt="promotionHam"
          />
        </motion.div>
      </motion.div>
      {/* 最新消息區塊 */}
      <motion.div
        initial="hidden"
        whileInView="show"
        className="home_activity_Outer"
      >
        <motion.img
          variants={fadeIn("right", 0.2)}
          className="deco"
          src="https://modinatheme.com/html/foodking-html/assets/img/shape/drinks.png"
          alt="coke"
        />
        <div className="container my-7">
          <SectionTitle text="最新消息" />
          <div className="d-flex flex-column flex-xl-row justify-content-between gap-3">
            <motion.div
              variants={fadeIn("up", 0.2)}
              initial="hidden"
              whileInView="show"
              whileHover="hover"
              className="home_activity d-flex"
              style={{
                backgroundImage:
                  "url('https://modinatheme.com/html/foodking-html/assets/img/banner/offer-bg.png')",
              }}
            >
              <div className="offer-content">
                <h5 className="mb-5">crispy, every bite taste</h5>
                <h3>
                  SUPER <br />
                  DELICIOUS
                </h3>
              </div>
              <div className="foodImg">
                <div className="burger-text">
                  <img
                    src="https://modinatheme.com/html/foodking-html/assets/img/shape/burger-text.png"
                    alt="shape-img"
                  />
                </div>
                <motion.img
                  variants={hoverScale(1.2)}
                  src="https://modinatheme.com/html/foodking-html/assets/img/food/main-food.png"
                  alt="food-img"
                />{" "}
              </div>
            </motion.div>
            <motion.div
              variants={fadeIn("up", 0.2)}
              initial="hidden"
              whileInView="show"
              whileHover="hover"
              className="home_activity d-flex"
              style={{
                backgroundImage:
                  "url('https://modinatheme.com/html/foodking-html/assets/img/banner/burger-bg.png')",
              }}
            >
              <div className="offer-content">
                <h5 className="mb-5">Make your day!消費高於NTD$300享優惠</h5>
                <h3>
                  折扣碼「hamburger100」 <br />
                  輸入享100元優惠!
                </h3>
              </div>
              <div className="foodImg">
                <div className="burger-text">
                  <img
                    src="https://modinatheme.com/html/foodking-html/assets/img/shape/burger-text.png"
                    alt="shape-img"
                  />
                </div>
                <motion.img
                  variants={hoverScale(1.2)}
                  src="https://modinatheme.com/html/foodking-html/assets/img/food/burger-2.png"
                  alt="hamberger-img"
                />{" "}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* 迅速送達 */}
      <motion.div
        variants={fadeIn("right", 0.2)}
        initial="hidden"
        whileInView="show"
        className="full-height home_deliver"
      >
        <div className="d-flex flex-column justify-content-between">
          <div className="overflow-hidden home_aboutus_right text-center text-light pt-5">
            <h3 className="fs-3 mt-4 fs-bolder">您最愛的餐點，馬上就到了！</h3>
            <p className="fs-4 m-5 fst-italic">
              我們不僅提供各種款式的漢堡選擇，以滿足各種口味和喜好，還提供品質保證外送服務，讓您輕鬆享用美味佳餚！
            </p>
          </div>
          <div className="deliver_down">
            <div className="driver">
              <img
                src="https://demo2.wpopal.com/fazfood/wp-content/uploads/2023/10/h2_delivery.png"
                alt="driverImg"
              />
            </div>
            <div className="d-flex backRoadImg">
              <motion.div
                className="d-flex justify-content-between"
                variants={marqueeVariants}
                animate="animate"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/353/353343.png"
                  alt="house"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/256/2156/2156890.png"
                  alt="house"
                />
                <img
                  src="https://cdn-icons-png.freepik.com/512/619/619155.png"
                  alt="house"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2282/2282383.png"
                  alt="traffic_light"
                />
                <img
                  src="https://cdn.icon-icons.com/icons2/3761/PNG/512/modern_house_building_home_icon_231035.png"
                  alt="house"
                />
              </motion.div>
              <motion.div
                className="d-flex justify-content-between"
                variants={marqueeVariants}
                animate="animate"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/353/353343.png"
                  alt="house"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/256/2156/2156890.png"
                  alt="house"
                />
                <img
                  src="https://cdn-icons-png.freepik.com/512/619/619155.png"
                  alt="house"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2282/2282383.png"
                  alt="traffic_light"
                />
                <img
                  src="https://cdn.icon-icons.com/icons2/3761/PNG/512/modern_house_building_home_icon_231035.png"
                  alt="house"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
