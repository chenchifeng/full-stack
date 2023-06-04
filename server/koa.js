const koa = require('koa');
const router = require('koa-router')();
const app = new koa();
const Query = require('./queryLocal');

router.get('/api/query', async (ctx, next) => {
  const defaultBody = {
    data: [],
    code: 0,
    msg: '成功',
  };
  const type = isNaN(Number(ctx.query.type))
    ? undefined
    : Number(ctx.query.type);
  const courseList = await Query.query(type);
  ctx.body = {
    ...defaultBody,
    data: courseList,
  };
});

router.get('/api/search', async (ctx, next) => {
  const defaultBody = {
    data: [],
    code: 0,
    msg: '成功',
  };
  const title = ctx.query.title;
  const courseList = await Query.search(title);
  ctx.body = {
    ...defaultBody,
    data: courseList,
  };
});

// 处理跨域
app.use(async (ctx, next) => {
  // 设置允许跨域访问的源
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  // 设置允许跨域访问的方法
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  // 设置允许跨域访问的请求头
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // 如果是跨域请求的预检请求，直接返回成功响应
  if (ctx.method === 'OPTIONS') {
    ctx.body = '';
    ctx.status = 204;
  } else {
    await next();
  }
});

// 启动路由
app.use(router.routes());
// 设置响应头
app.use(router.allowedMethods());

// 监听端口
app.listen(3002);
