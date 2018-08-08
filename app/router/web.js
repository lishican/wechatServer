const router = require("koa-router")()
const wechat_authorize = require("../middleware/oauth");

router.get(
  "/:page/:auth",
  wechat_authorize(),
  async (ctx, next) => {
    console.log(ctx.session)
    if (ctx.session.userInfo) {
      console.log(`${ctx.params.page}/index`)
      await ctx.render(`${ctx.params.page}/index`, {
        userinfo: ctx.session.userInfo,
        jsapi: ctx.session.jsapi
      });
    } else {
      await ctx.render(`${ctx.params.page}/index`);
    }
  }
);

module.exports = router;