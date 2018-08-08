const jwt = require("jsonwebtoken");
const config = require("../../config");
const redisClient = require("../plugin").busRedis;
// 权限控制
module.exports = opts => {
  return async function admin_jwt(ctx, next) {
    let token = ctx.headers.token;
    if (!token) {
      return (ctx.body = {
        code: 401,
        msg: "token失效"
      });
    } else {
      // /backend/schedule/findbyid
      console.log(ctx.path);
      try {
        let j_token = jwt.verify(token, config.app.secret);
        let isExpire = await redisClient.getAsync("token#" + j_token.user_id);
        ctx.user_id = j_token.user_id;

        if (!isExpire) {
          return (ctx.body = {
            code: 401,
            msg: "token已过期"
          });
        }
        if (isExpire != token) {
          return (ctx.body = {
            code: 401,
            msg: "token验证错误"
          });
        }
        redisClient.set("token#" + j_token.user_id, token, "EX", 60 * 60 * 24);
        await next();
      } catch (error) {
        console.log(error.name);
        if (error.name == "JsonWebTokenError") {
          return (ctx.body = {
            code: 401,
            msg: error.message
          });
        } else {
          ctx.throw(error);
        }
      }
    }
  };
};
