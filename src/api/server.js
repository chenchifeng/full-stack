const DOMAIN_MAP = {
  development: 'http:/localhost:3002',
  production: '',
};

const ENV = process.env.NODE_ENV;

// export一个封装好的get方法用于发送get请求
export const get = function (url, params) {
  // 直接使用浏览器自带的fetch方法作为网络请求库
  const domain = new URL(`${DOMAIN_MAP[ENV]}${url}`);
  domain.search = new URLSearchParams(params).toString();
  return fetch(domain).then((res) => res.json());
};
