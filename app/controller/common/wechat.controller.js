const is = require("is-type-of");
const sha1 = require("sha1");
const randomize = require("randomatic");
const axios = require("axios");
const crypto = require("crypto");
const config = require("../../../config");
const redisClient = require("../../plugin").busRedis;
class wechatCtrl {
  async jsapi(ctx, next) {
    let signurl = ctx.request.body.signurl;
    let ticket = await redisClient.getAsync("wechat:jsticket");
    if (!ticket) {
      ctx.body = {
        code: 400,
        msg: "获取jsapi错误"
      };
      return;
    }
    var noncestr = randomize("*", 30);
    var timestamp = new Date("2017-10-10").valueOf();
    let url = signurl;
    let str =
      "jsapi_ticket=" +
      ticket +
      "&noncestr=" +
      noncestr +
      "&timestamp=" +
      timestamp +
      "&url=" +
      url;
    let signature = sha1(str);
    let jsapiInfo = {
      nonceStr: noncestr,
      timestamp: timestamp,
      appId: config.wechat.AppID,
      signature: signature
    };
    ctx.body = jsapiInfo;
  }
  async signature(ctx, next) {
    let signature = ctx.query.signature;
    let timestamp = ctx.query.timestamp;
    let nonce = ctx.query.nonce;
    let echostr = ctx.query.echostr;

    let array = [config.wechatWeb.token, timestamp, nonce];
    array.sort();
    let str = array.toString().replace(/,/g, "");
    let sha1Code = crypto.createHash("sha1");
    let code = sha1Code.update(str, "utf-8").digest("hex");
    if (code === signature) {
      ctx.body = echostr;
    } else {
      ctx.body = "error";
    }
  }
}
let ins = new wechatCtrl();
module.exports = ins;
