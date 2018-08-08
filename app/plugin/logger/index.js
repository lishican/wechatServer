const assert = require("assert");
const registerModel = require("./models");
class Logger {
  constructor(options) {
    assert(options.mc, "需要传入mongodb实例");
    this.mc = options.mc;
    let models = registerModel(this.mc);

    this.errorModel = models.errorModel;
    this.requesetModel = models.requesetModel;
    this.recordModel = models.recordModel;
  }
  filterUrl(url) {
    if (process.env.NODE_ENV != "production") {
      return false;
    }
    let controllers = ["apiv1", "backend", "common", "im", "quiz", "web"];
    let isMatch = controllers.filter(v => {
      let reg = new RegExp(v + "/");
      if (reg.test(url)) {
        return true;
      } else {
        return false;
      }
    });
    return isMatch.length > 0 ? true : false;
  }
  parseCtx(ctx, useTime) {
    let obj = {};
    obj.ip = ctx.request.header["x-real_ip"] || ctx.ip;
    obj.url = ctx.request.href;
    obj.method = ctx.method;
    obj.protocol = ctx.protocol;
    obj.query = JSON.stringify(ctx.query);
    obj.body = JSON.stringify(ctx.request.body);
    obj.response = JSON.stringify(ctx.response.body);
    obj.contentType =
      JSON.stringify(ctx.request.header["content-type"]) || null;
    obj.status = ctx.response.status;
    obj.userAgent = ctx.request.header["user-agent"] || null;
    obj.headers = JSON.stringify(ctx.request.headers);
    obj.useTime = useTime + "ms";
    console.log(obj);
    return obj;
  }
  record(options) {
    let that = this;
    return async function record(ctx, next) {
      let startTime = new Date().valueOf();
      try {
        await next();
        let useTime = new Date().valueOf() - startTime;
        let requestLog = that.parseCtx(ctx, useTime);
        that.requesetModel.create(requestLog);
      } catch (error) {
        let useTime = new Date().valueOf() - startTime;
        let errorInfo = that.parseCtx(ctx, useTime);
        errorInfo.name = error.name;
        errorInfo.message = error.message;
        errorInfo.stack = JSON.stringify(error.stack);
        that.errorModel.create(errorInfo);
        ctx.throw(error);
      }
    };
  }
}

module.exports = Logger;
