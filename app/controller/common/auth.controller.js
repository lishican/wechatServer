const is = require("is-type-of");
const redisClient = require("../../plugin").busRedis;
const validator = require("../../util/validator");
const adminModel = require("../../plugin").busdb.model("common_admin");
const jwt = require("jsonwebtoken");
const config = require("../../../config");
const randomize = require("randomatic");
const authRole = require("../../service/commnon/auth.service");
// adminModel.create({
//   username: "admin",
//   password: "admin123",
//   auth: [101]
// });
class Controller {
  async osinfo(ctx, next) {
    ctx.body = {
      code: 200,
      data: {
        platform: os.platform(),
        cpunum: os.cpus().length,
        freemem: (os.freemem() / 1024 / 1024 / 1024).toFixed(2),
        totalmem: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2),
        node: process.versions.node,
        v8: process.versions.v8
      }
    };
  }
  async loginOut(ctx, next) {
    console.log(ctx.user_id);
    redisClient.del("token#" + ctx.user_id);
    ctx.body = {
      code: 200,
      msg: "loginout success"
    };
  }
  async login(ctx, next) {
    let body = validator(ctx, ["username", "password"]);
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }

    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let admin = await adminModel.findOne({ username: username });
    if (admin && admin.verifyPass(password)) {
      let token = jwt.sign(
        {
          user_id: admin._id,
          random: randomize("*", 10)
        },
        config.app.secret
      );
      redisClient.set("token#" + admin._id, token, "EX", 60 * 60 * 24);
      ctx.body = {
        code: 200,
        msg: "login success",
        data: {
          token: token,
          roles: admin.auth.map(v => authRole[v])
        }
      };
    } else {
      ctx.body = {
        code: 400,
        msg: "账号密码错误"
      };
    }
  }
}
module.exports = new Controller();
