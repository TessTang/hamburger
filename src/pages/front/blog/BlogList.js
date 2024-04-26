import { useOutletContext } from "react-router-dom";

import { motion } from "framer-motion";

import Pagenation from "../../../components/Pagenation";
import Button from "../../../components/Button";

import { fadeIn } from "../../../utils/variants";

export default function Blog() {
  const { article, getPage, pagination } = useOutletContext();

  function formatUnixTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // 轉換為毫秒
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份從0開始，需加1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  return (
    <div>
      {article?.map((item) => {
        return (
          <motion.div
            key={item.id}
            variants={fadeIn("up", 0.09)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="blog_article_outer"
          >
            <div className="blog_article card">
              <img
                src={item.img}
                className="card-img-top rounded-5 mb-2"
                alt={item.title}
              />
              <div className="cardDate rounded-4 py-2 px-3 fw-bold">
                {formatUnixTimestamp(item.date)}
              </div>
              <div className="card-body p-0 text-center myCardBody mb-3">
                <h4 className="my-3 fw-bold">{item.title}</h4>
                <p className="mb-0">{item.content}</p>
              </div>
              <Button
                text="點我看"
                linkto={`/blogs/${item.id}`}
                myClass="py-2 w-50 mx-auto mt-2"
              />
            </div>
          </motion.div>
        );
      })}
      <Pagenation pagination={pagination} changePage={getPage} />
    </div>
  );
}
