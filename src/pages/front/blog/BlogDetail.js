import { useState, useEffect, useCallback } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import Stack from "react-bootstrap/Stack";

import { motion, useAnimationControls } from "framer-motion";

import { messageAlert } from "../../../store/frontStore";
import Button from "../../../components/Button";

export default function Products() {
  const [articleIndex, setArticleIndex] = useState();

  const { id } = useParams();
  const controls = useAnimationControls();
  const { allArticle } = useOutletContext();

  const getBlog = useCallback(async () => {
    try {
      const index = allArticle.findIndex((item) => {
        return item.id === id;
      });
      setArticleIndex(index);
    } catch (error) {
      messageAlert("warning", `噢!網頁可能有點錯誤 代碼:${error}`);
    }
  }, [allArticle, id]);

  useEffect(() => {
    getBlog();
  }, [getBlog]);

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
  }, [controls]);

  //轉換日期
  function formatUnixTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // 轉換為毫秒
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份從0開始，需加1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  //下方上下篇文章
  const OtherArticle = ({ text, index }) => {
    if (index || index === 0) {
      return (
        <div className="col-md-6 mt-2 otherArticle">
          <div
            className="d-flex align-items-center justify-content-center gap-3"
            style={{ height: "200px" }}
          >
            <img
              className="object-fit-cover w-50 rounded-3"
              src={allArticle[index].img}
              alt={allArticle[index].title}
            />
            <p>{allArticle[index].title}</p>
          </div>
          <Button
            text={text}
            linkto={`/blogs/${allArticle[index].id}`}
            myClass="py-2 mt-3 w-50 mx-auto"
          />
        </div>
      );
    } else {
      return (
        <div className="col-md-6 mt-2 otherArticle">
          <div
            className="d-flex align-items-center justify-content-center gap-3"
            style={{ height: "200px" }}
          >
            <p>{text}</p>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <div>
        {allArticle[articleIndex] && (
          <motion.div animate={controls}>
            <div className="bg-transparent blog_article_detail card border-0 mb-4 text-decoration-none">
              <h4 className="my-3 fw-bold">{allArticle[articleIndex].title}</h4>
              <div className="cardDate rounded-4 py-2 px-3 fw-bold">
                {formatUnixTimestamp(allArticle[articleIndex].date)}
              </div>
              <img
                src={allArticle[articleIndex].img}
                className="card-img-top rounded-5 mb-2"
                alt={allArticle[articleIndex].title}
              />

              <div className="card-body myCardBody my-3">
                <p className="mb-3">{allArticle[articleIndex].content}</p>
                <div className="mt-5 d-flex">
                  <p className="d-flex align-items-center mb-0 pe-2">
                    此文章標籤:
                  </p>{" "}
                  <Stack direction="horizontal" gap={2} className="flex-wrap">
                    {allArticle[articleIndex].tag.map((item, idx) => {
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
              </div>

              <div className="d-flex flex-column flex-md-row">
                {articleIndex !== 0 ? (
                  <OtherArticle text="上一篇" index={articleIndex - 1} />
                ) : (
                  <OtherArticle text="這是最新文章" />
                )}
                {articleIndex !== allArticle.length - 1 ? (
                  <OtherArticle text="下一篇" index={articleIndex + 1} />
                ) : (
                  <OtherArticle text="這是最後一篇文章" />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
