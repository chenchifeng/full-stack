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

// 启动路由
app.use(router.routes());
// 设置响应头
app.use(router.allowedMethods());

// 监听端口
app.listen(3002);
