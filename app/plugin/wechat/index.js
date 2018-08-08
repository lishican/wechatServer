const wechatPay = require("./lib/pay");
const wechatOauth = require("./lib/web_oauth");
const wechatMessage = require("./lib/notication");
// new wechatMessage({
//   appId: "231",
//   appSecret: "232",
//   redis: 12
// });
// new wechatOauth({
//   wechat: {
//     AppID: "wx895c5409e2e58550",
//     AppSecret: "668c1261324d7e1bb413c114cc2cbd1b",
//     token: "busapp"
//   },
//   redis: redis
// });
// new wechatPayPlugin({
//   appid: "config.wechatPay.appid",
//   appkey: "config.wechatPay.appkey",
//   mch_id:" config.wechatPay.mch_id",
//   key:" config.wechatPay.key",
//   notify_url: "https://game2.stackh.cn/apiv1/order/reactOrderNotify",
//   notify_refund_url: "https://game2.stackh.cn/apiv1//order/reactRefundNotify",
//   pfx: fs.readFileSync(
//     path.resolve(__dirname, "../../plugin/cert/apiclient_cert.p12")
//   )
// });
module.exports = {
  wechatOauth,
  wechatPay,
  wechatMessage
};
