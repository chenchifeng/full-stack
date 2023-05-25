import "./index.css";
import { useState } from "react";
import Card from "../Card";

const list = ["最新", "最热", "活动"];
function Course() {
  const [focusIndex, setFocusIndex] = useState(0);
  const handleClick = async (index) => {
    setFocusIndex(index);
  };

  return (
    <div>
      <div className="header-tags">
        {/* 列表渲染 */}
        {list.map((item, index) => (
          <div
            className={index === focusIndex ? "item item-focus" : "item"}
            onClick={() => handleClick(index)}
            key={index}
          >
            {item}
          </div>
        ))}
      </div>
      <Card />
    </div>
  );
}

export default Course;