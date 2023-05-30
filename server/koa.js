const koa = require("koa");
const router = require("koa-router")();
const app = new koa();

router.post("/api/query", async (ctx, next) => {
  const defaultBody = {
    data: [],
    code: 0,
    msg: "成功",
  };
  ctx.body = {
    ...defaultBody,
  };
});

// 启动路由
app.use(router.routes());
// 设置响应头
app.use(router.allowedMethods());

// 监听端口
app.listen(3002);