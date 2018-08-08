module.exports = {
  name: "bus admin",
  version: "1.0",
  auth: "黎世灿",
  mongo: {
    uri: "127.0.0.1",
    port: "27017",
    dbName: "",
    username: "",
    password: ""
  },
  redis: {
    uri: "redis://127.0.0.1",
    username: "",
    port: "",
    password: "",
    db: 5
  },
  session: {
    secrets: "bus-secret",
    cookie: { maxAge: 60000 * 5 }
  },
  // 公众号网页授权
  wechatWeb: {
    AppID: "",
    AppSecret: "",
    token: ""
  },
  // 支付测试配置
  wechatPayDev: {
    appid: "",
    appkey: "",
    mch_id: "",
    key: "",
    test_openid: ""
  },
  // 小程序支付
  wechatPay: {
    appid: "",
    appkey: "",
    mch_id: "",
    key: ""
  },
  qiniu: {
    ak: "",
    sk: "",
    bucket: "",
    domin: ""
  },
  app: {
    port: "3580",
    secret: "knwo"
  }
};
