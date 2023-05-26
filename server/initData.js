const fetch = require('node-fetch'); // fetch,请求接口
const xlsx = require('node-xlsx'); // xlsx, 操作excel
const fs = require('fs'); // fs,操作文件

// 延迟函数
async function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
}

// 课程列表
const courseList = [];

async function fetchData() {
  try {
    // 主要就是当前页和分页大小两个参数要修改
    const body = {
      category_id: '0', // 分类(例如后端就是"6809637769959178254")
      sort: 10, // 排序(例如价格排序就是8,9)
      is_vip: 0, // 是否会员
      cursor: '0', // 游标(第几条数据开始获取,相当于页码的作用)
      limit: 20, // 分页大小
    };
    let hasMore = true; // 是否还有更多数据
    while (hasMore) {
      const response = await fetch(
        'https://api.juejin.cn/booklet_api/v1/booklet/listbycategory?aid=2608&uuid=7221370402085013050&spider=0',
        {
          headers: {
            accept: '*/*',
            'accept-language': 'zh-CN,zh;q=0.9',
            'content-type': 'application/json',
            'sec-ch-ua': '";Not A Brand";v="99", "Chromium";v="94"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'x-secsdk-csrf-token':
              '000100000001310ce19c2ea7ec4768c08080d46ed826f5a86a6790e41a41982d27a295dda7c717629313f407c462',
            cookie:
              '__tea_cookie_tokens_2608=%257B%2522web_id%2522%253A%25227221370402085013050%2522%252C%2522user_unique_id%2522%253A%25227221370402085013050%2522%252C%2522timestamp%2522%253A1681356327570%257D; passport_csrf_token=b6513b1feb511246700cc3d88c444df5; passport_csrf_token_default=b6513b1feb511246700cc3d88c444df5; n_mh=VNq34z2ZD7NDXjcXD_1n5Md_yI6WB2VzWNVE4h4Vyto; store-region=cn-gd; store-region-src=uid; _tea_utm_cache_2608={%22utm_source%22:%22znx%22%2C%22utm_medium%22:%22system%22%2C%22utm_campaign%22:%22j3y4%22}; csrf_session_id=c56d5a14b5af0f44856496b191275753; sid_guard=bfdadd3876fc6c5c360ff2bd78f17188%7C1685070922%7C21600%7CFri%2C+26-May-2023+09%3A15%3A22+GMT; uid_tt=4f6f0a7d78c61aed3f7ead8e376d4446; uid_tt_ss=4f6f0a7d78c61aed3f7ead8e376d4446; sid_tt=bfdadd3876fc6c5c360ff2bd78f17188; sessionid=bfdadd3876fc6c5c360ff2bd78f17188; sessionid_ss=bfdadd3876fc6c5c360ff2bd78f17188; sid_ucp_v1=1.0.0-KDJhZmE1MWZhZmQ0ZmFhODlkMGFhYmQ4ZmY4YTZjYjc0OTkxZGY5NzEKCRDKyMCjBhiwFBoCbGYiIGJmZGFkZDM4NzZmYzZjNWMzNjBmZjJiZDc4ZjE3MTg4; ssid_ucp_v1=1.0.0-KDJhZmE1MWZhZmQ0ZmFhODlkMGFhYmQ4ZmY4YTZjYjc0OTkxZGY5NzEKCRDKyMCjBhiwFBoCbGYiIGJmZGFkZDM4NzZmYzZjNWMzNjBmZjJiZDc4ZjE3MTg4; msToken=JMkK9NOhsyqw1C1LvgB3xPDNR9nbH-Nnq1742gTlNOkyW_90LkewEPa6EjOOMFebMHVc1nUA2qnEsaW0PGMggSus5_mn_idqsoIkFTKE-Y4=',
          },
          referrer: 'https://juejin.cn/',
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: JSON.stringify(body),
          method: 'POST',
          mode: 'cors',
        },
      );
      console.log('cursor:', body.cursor);
      const res = await response.json();
      hasMore = res.has_more;
      body.cursor = res.cursor;

      for (let info of res.data) {
        // 背景图：base_info.cover_img
        // 课程号：base_info.booklet_id
        // 标题：base_info.title
        // 描述：base_info.summary
        // 数量：base_info.buy_count
        // 打折：event_discount.discount_rate
        // 原价：base_info.price
        // 上架时间：base_info.put_on_time
        // 返现红包：原价*20%
        const course = {
          cover_img: info.base_info.cover_img,
          booklet_id: info.base_info.booklet_id,
          title: info.base_info.title,
          summary: info.base_info.summary,
          buy_count: info.base_info.buy_count,
          price: info.base_info.price,
          put_on_time: info.base_info.put_on_time,
        };
        // 是否有打折
        if (info.event_discount && info.event_discount.discount_rate) {
          course.discount_rate = info.event_discount.discount_rate;
        } else {
          course.discount_rate = 10; // 没有打折就是 10
        }
        courseList.push(course);
      }
      // 延迟3秒,避免被禁
      await sleep(3000);
    }

    console.log('课程数:', courseList.length);
    // 铺平数据方便存入excel
    const courseListData = courseList.map((item) => [
      item.cover_img,
      item.booklet_id,
      item.title,
      item.summary,
      item.buy_count,
      item.price,
      item.put_on_time,
    ]);
    console.log('开始写入文件:');

    // 创建excel数据
    const excel = [
      {
        name: 'sheet1',
        data: courseListData,
      },
    ];
    const buffer = xlsx.build(excel); // 把excel数据转成excel文件二进制缓存数据(用于写入文件)

    // 写入文件
    fs.writeFile('course.xlsx', buffer, function (err) {
      if (err) {
        console.log('Write failed: ' + err);
        return;
      }

      console.log('Write completed.');
    });
  } catch (error) {
    console.error(error);
  }
}

fetchData();
