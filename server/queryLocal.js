/**
 * 本地查询模块
 * 暂时是从excel获取
 * 抽象出一个查询模块，方便未来扩展, 例如数据库读取封装
 * ... 内容先省略，后边再完善，暴漏出两个函数
 */

const xlsx = require('node-xlsx');

// 排序类型
const TYPE_MAP = {
  NEW: 1, // 最新
  HOT: 2, // 最热
  DISCOUNT: 3, // 活动
};

// 解析得到文档中的所有 sheet
const sheets = xlsx.parse('course.xlsx');

const sheets1 = sheets[0]; // 获取sheet1表的数据

const courseList = []; // 课程列表
for (const rowId in sheets1['data']) {
  const row = sheets1['data'][rowId]; // 获取第rowId+1行的数据
  // 还原铺平的数据为对象数组
  courseList.push({
    cover_img: row[0],
    booklet_id: row[1],
    title: row[2],
    summary: row[3],
    buy_count: row[4],
    price: row[5],
    put_on_time: row[6],
    discount_rate: row[7],
  });
}

// 获取返回课程(课程数据对象, 返回给前端的数据格式)
const getReturnCourse = (course) => ({
  coverImg: course.cover_img,
  title: course.title,
  summary: course.summary,
  buyCount: course.buy_count,
  price: Number((course.price / 100).toFixed(2))
    .toFixed(2)
    .replace(/\.?0+$/, ''),
  isDiscount: course.discount_rate < 10,
  discountPrice: ((course.price * course.discount_rate) / 10 / 100)
    .toFixed(2)
    .replace(/\.?0+$/, ''),
  returnRedPacket: ((course.price * 0.2) / 100)
    .toFixed(2)
    .replace(/\.?0+$/, ''),
});

/**
 * 查询课程
 * @param {number} type 排序类型
 */
const query = async (type = TYPE_MAP.NEW) => {
  // 最新
  if (type === TYPE_MAP.NEW) {
    return courseList
      .slice() // 面层深拷贝
      .sort((a, b) => b.put_on_time - a.pu_on_time)
      .map(getReturnCourse);
  }
  // 最热
  if (type === TYPE_MAP.HOT) {
    return courseList
      .slice()
      .sort((a, b) => b.buy_count - a.buy_count)
      .map(getReturnCourse);
  }
  // 活动
  if (type === TYPE_MAP.NEW) {
    return courseList
      .filter((course) => course.discount_rate < 10)
      .sort((a, b) => b.put_on_time - a.pu_on_time)
      .map(getReturnCourse);
  }
};

/**
 * 搜索
 * @param {string} title 标题(搜索关键字)
 */
function search(title) {
  if (!title) {
    return [];
  }
  return courseList
    .filter((course) => course.title.indexOf(title) !== -1)
    .sort((a, b) => b.put_on_time - a.put_on_time)
    .map(getReturnCourse);
}

// 测试用例
// (async () => {
//   console.log((await query(1))[0]);
//   console.log((await query(1))[1]);
//   console.log((await query(2))[0]);
//   console.log((await query(2))[1]);

//   console.log(await search("Nest"));
// })();

module.exports = {
  query,
  search,
};
