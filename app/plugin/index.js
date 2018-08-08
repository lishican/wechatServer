const fs = require("fs");
const path = require("path");
const config = require("../../config");

const mongodb = require("./mongod");
const redis = require("./redis");
const wechat = require("./wechat");
const Qiniu = require("./qiniu");
const Logger = require("./logger");

// mongodb
const busdb = mongodb.createConnection({
  username: config.mongo.username,
  password: config.mongo.password,
  host: config.mongo.host,
  db: config.mongo.dbName,
  port: 27017,
  poolSize: 10
});

new mongodb.loader({
  path: path.resolve(__dirname, "../model/"),
  condb: busdb
});

// redis
const busRedis = redis.createConnection({
  uri: config.redis.uri,
  username: "",
  port: config.redis.port,
  password: config.redis.password,
  db: config.redis.db
});

// logger
const logger = new Logger({ mc: busdb });

// qiniu
const qiniu = new Qiniu(config.qiniu);

// 微信
const wechatOuth = new wechat.wechatOauth({
  wechat: config.wechatWeb,
  redis: busRedis
});
const wechatMessage = new wechat.wechatMessage({
  appId: config.wechatPay.appid,
  appSecret: config.wechatPay.appkey,
  redis: busRedis
});
const wechatPay = new wechat.wechatPay({
  appid: config.wechatPay.appid,
  appkey: config.wechatPay.appkey,
  mch_id: config.wechatPay.mch_id,
  key: config.wechatPay.key,
  notify_url: "",
  notify_refund_url: ""
  // pfx: fs.readFileSync(path.resolve(__dirname, "./cert/apiclient_cert.p12"))
});

module.exports = {
  busdb,
  busRedis,
  qiniu,
  logger,
  wechatOuth,
  wechatMessage,
  wechatPay
};
