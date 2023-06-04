import './index.css';
import Card from '../Card';
import { useState, useEffect } from 'react';
import { queryCourse } from '../../../api';

const list = ['最新', '最热', '活动'];

function Course() {
  // 响应式变量,相当于vue的data
  const [focusIndex, setFocusIndex] = useState(0);
  const [courseList, setCourseList] = useState([]);

  // 类型点击事件
  const handleClick = async (index) => {
    setFocusIndex(index);
    refreshData(index + 1);
  };

  // 刷新数据
  const refreshData = async (type = 1) => {
    const res = await queryCourse({ type });
    const allCourses = res.data;
    setCourseList(allCourses.slice(0, 10));
  };

  /**
   * 副作用钩子
   * 第1个参数是副作用函数,也就是执行体/回调
   * 弟2个参数是依赖项,[]的话这个副作用就相当于vue的mounted
   * 这里意思就是进来的时候就获取数据
   */
  useEffect(() => {
    // 初始化数据
    refreshData();
  }, []);

  return (
    <div>
      <div className='header-tags'>
        {/* 列表渲染 */}
        {list.map((item, index) => (
          <div
            className={index === focusIndex ? 'item item-focus' : 'item'}
            onClick={() => handleClick(index)}
            key={index}
          >
            {item}
          </div>
        ))}
      </div>
      <div className='courses'>
        {/* 列表渲染课程数据 */}
        {courseList.map((item) => (
          <Card className='card' key={item.title} course={item} />
        ))}
      </div>
    </div>
  );
}

export default Course;
