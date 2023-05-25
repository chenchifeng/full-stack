import "./index.css";
import { Button, message } from "antd";

function Card() {
  const jumpCourse = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      message.info(
        "请等待更新购买链接，感谢支持。也可以在上边的优惠规则中添加微信询问链接"
      );
    }
  };
  return (
    <div
      className="card"
      onClick={() => {
        jumpCourse("");
      }}
    >
      <div>
        <img
          alt="img"
          className="background"
          src="https://static001.geekbang.org/resource/image/55/c8/5563a7294b2bfd563ae1227011d897c8.jpg"
        />
      </div>
      <div className="content">
        <div className="info">
          <div className="title">测试标题</div>
          <div className="author">作者</div>
          <div className="people">999 人已学习</div>
        </div>
        <div className="action">
          <div className="action-left">
            <div className="price">
              <div className="promotion">限时 : ¥99</div>
              <div className="origin">原价 : ¥199</div>
            </div>

            <div className="return">成功购买后可得红包¥18</div>
          </div>
          <div className="aciton-right">
            <Button className="button" shape="round" type="primary">
              立即购买
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;