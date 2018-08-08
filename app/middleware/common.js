const path = require("path");
const views = require("koa-views");
const json = require("koa-json");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const compress = require("koa-compress");
const cors = require("kcors");
const compose = require("koa-compose");
const serve = require("koa-static");
const session = require("koa-generic-session");
const RedisStore = require("koa-redis");
const xmlParser = require("koa-xml-body");
const config = require("../../config");
const recordLogger = require("../plugin").logger;
module.exports = app => {
  app.keys = [config.session.secrets];
  return compose([
    cors({
      credentials: true
    }),
    xmlParser({
      limit: 120 * 1024 * 1024
    }),
    bodyparser({
      enableTypes: ["json", "form", "text"],
      jsonLimit: 120 * 1024 * 1024,
      textLimit: 120 * 1024 * 1024,
      formLimit: 120 * 1024 * 1024
    }),
    recordLogger.record({
      name: 1,
      userInfo: 23
    }),
    json(),
    logger(),
    compress({
      filter: function(content_type) {
        return /text/i.test(content_type);
      },
      threshold: 2048,
      flush: require("zlib").Z_SYNC_FLUSH
    }),
    session({
      key: "bus.sid",
      store: RedisStore({
        host: config.redis.host,
        port: config.redis.port,
        auth_pass: config.redis.password || ""
      }),
      cookie: config.session.cookie
    }),
    serve(path.resolve(__dirname, "../web")),
    views(path.resolve(__dirname, "../web"), {
      map: {
        html: "ejs"
      }
    })
  ]);
};
