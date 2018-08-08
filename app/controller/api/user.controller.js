// common
const shortid = require("shortid");
const axios = require("axios");
// util plugin
const validator = require("../../util/validator");
const parse = require("../../util/parse");
// model
let bus_user = require("../../plugin").busdb.model("bus_user");
let bus_counter = require("../../plugin").busdb.model("bus_counter");
const wmn = require("../../plugin").wechatMessage;

class Controller {
  async index(ctx, next) {
    ctx.body = {
      code: 200,
      data: "data"
    };
  }
  async getOpenId(ctx, next) {
    let body = validator(ctx, "code");
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    let code = body.code;
    let authorization_code = "authorization_code";
    let req_url = `https://api.weixin.qq.com/sns/jscode2session?appid=${
      config.wechatPay.appid
    }&secret=${
      config.wechatPay.appkey
    }&js_code=${code}&grant_type=${authorization_code}`;
    let res = await axios.get(req_url);
    ctx.body = {
      code: 200,
      data: res.data
    };
  }

  async saveFormId(ctx, next) {
    let body = validator(ctx, ["openId", "formId"]);
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    console.log(body);
    let res_data = await wmn.setFormId(body.openId, body.formId);
    ctx.body = {
      code: 200,
      data: res_data
    };
  }

  async login(ctx, next) {
    let body = validator(ctx, "openid");
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    let user = await bus_user.findOneAndUpdate(
      { openid: body.openid },
      { $set: body },
      { new: true, upsert: true }
    );
    ctx.body = {
      code: 200,
      data: user
    };
  }
}

let ins = new Controller();
module.exports = ins;
