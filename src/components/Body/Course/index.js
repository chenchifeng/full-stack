import './index.css';
import Card from '../Card';
import { Spin } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { queryCourse, searchCourse } from '../../../api';

const list = ['最新', '最热', '活动'];

// 前端伪分页
let allCourses = null;
let offset = 0;
const limit = 20;

// Course组件
// 接受参数props.searchKey
function Course({ searchKey }) {
  // 响应式变量,相当于vue的data
  const [focusIndex, setFocusIndex] = useState(0);
  const [courseList, setCourseList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loaderRef = useRef(null);

  // 类型点击事件
  const handleClick = async (index) => {
    setFocusIndex(index);
    refreshData(index + 1);
  };

  // 刷新数据
  const refreshData = async (type = 1) => {
    setIsLoading(true);
    const res = await queryCourse({ type });
    setIsLoading(false);
    allCourses = res.data;
    offset = 0;
    setCourseList(allCourses.slice(0, limit));
    offset = offset + limit;
  };

  // 搜索数据
  const searchData = async (title) => {
    if (!title) return;
    setIsLoading(true);
    const res = await searchCourse({ title });
    setIsLoading(false);
    const allCourses = res.data;
    offset = 0;
    setCourseList(allCourses.slice(0, limit));
    offset = offset + limit;
  };

  // /**
  //  * 副作用钩子
  //  * 第1个参数是副作用函数,也就是执行体/回调
  //  * 弟2个参数是依赖项,[]的话这个副作用就相当于vue的mounted
  //  * 这里意思就是进来的时候就获取数据
  //  */
  // useEffect(() => {
  //   // 初始化数据
  //   refreshData();
  // }, []);

  useEffect(() => {
    if (searchKey) {
      searchData(searchKey);
      return;
    }
    setFocusIndex(0);
    refreshData();
  }, [searchKey]); // 依赖项, 当searchKey变化时会重新执行副作用

  // 利用IntersectionObserver观察下面创建并且绑定的那个div(loaderRef)是否进入视口来实现判断是否触底
  // 实现触底加载更多
  useEffect(() => {
    // 定义变量保存loaderRef.current,避免在清理副作用的时候受到oaderRef.current变化的影响
    const loaderRefCurrent = loaderRef.current;
    // IntersectionObserver 是一个浏览器原生的 API，可以用于观察元素是否进入或离开视口。
    // 在这段代码中，它的配置选项 rootMargin 设置为 '0px 0px 100% 0px'
    // 意味着当 loaderRef.current 元素进入视口底部 100% 的时候，就会触发回调函数 moreData()。
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          moreData();
        }
      },
      { rootMargin: '0px 0px 100% 0px' },
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      // 清理副作用函数
      // 组件卸载前取消IntersectionObserver监听,避免内存泄漏
      if (loaderRefCurrent) {
        observer.unobserve(loaderRefCurrent);
      }
    };
  }, []); // 这里不应该把loaderRef.current作为依赖项,如果将 useRef 钩子与跳过渲染的 useEffect 结合使用,则它可能成为自定义钩子的陷阱。

  /**
   * 加载更多数据
   * 伪分页
   * 实际上的分页应该是把新的数据拼在后面
   * 这里的分页是直接把已经全部获取到的数据,进行新的截取赋值
   */
  const moreData = () => {
    console.log('获取更多数据');
    if (!allCourses || offset >= allCourses.length) {
      return;
    }
    setCourseList(allCourses.slice(0, offset + limit));
    offset = offset + limit;
  };

  return (
    <div>
      <div className='header-tags'>
        {/* 列表渲染 */}
        {!searchKey &&
          list.map((item, index) => (
            <div
              className={index === focusIndex ? 'item item-focus' : 'item'}
              onClick={() => handleClick(index)}
              key={index}
            >
              {item}
            </div>
          ))}
      </div>
      <Spin spinning={isLoading}>
        <div className='courses'>
          {/* 列表渲染课程数据 */}
          {courseList.map((item) => (
            <Card className='card' key={item.title} course={item} />
          ))}
        </div>
      </Spin>
      {/*  */}
      <div ref={loaderRef} />
    </div>
  );
}

export default Course;
