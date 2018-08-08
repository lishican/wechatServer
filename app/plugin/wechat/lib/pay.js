// 微信支付模块

const randomize = require("randomatic");
const request = require("request-promise");
const crypto = require("crypto");
const queryString = require("query-string");
const xml2js = require("xml2js");
/* https://www.npmjs.com/package/request */
/* https://www.npmjs.com/package/xml2js */
/* https://www.npmjs.com/package/randomatic */

/**
 *微信小程序支付sdk
 *
 * @class wechatPayService
 */
class wechatPayService {
  /**
   *Creates an instance of wechatPayService.
   * @param {*} appid 小程序id
   * @param {*} appkey 小程序秘钥
   * @param {*} mch_id 商户号
   * @param {*} product_id:, 商户号
   * @param {*} notify_url 通知回调地址
   * @param {*} key 商户秘钥
   * @param {*} pfx 证书
   * @param {*} opt
   * @memberof wechatPayService
   */
  constructor(opt) {
    this.opt = opt;
  }
  stringifyParam(param) {
    return queryString.stringify(param, { encode: false });
  }
  /**下订单
   * @param {any} openid  用户id
   * @param {any} body 名称
   * @param {any} out_trade_no 订单id
   * @param {any} product_id 商品id
   * @param {any} total_fee 总价格 分
   * @param {any} spbill_create_ip  请求ip
   * @memberof wechatPayService
   */
  async doOrder(param) {
    try {
      let nonce_str = randomize("abcdefghijklmnopqrstuvwxyz123456789", 30);
      let pre_pay_param = {
        appid: this.opt.appid,
        mch_id: this.opt.mch_id,
        nonce_str: nonce_str,
        body: param.body, //商品简单描述，该字段请按照规范传递，具体请见参数规定
        out_trade_no: param.out_trade_no,
        total_fee: param.total_fee, //单位为分
        spbill_create_ip: param.spbill_create_ip, //支付用户的ip
        notify_url: this.opt.notify_url, //通知地址
        trade_type: "JSAPI", //交易类型
        product_id: param.product_id, //商品id
        openid: param.openid
      };
      let sign = this.doSign(pre_pay_param);
      let pay_param = { ...pre_pay_param, sign };
      let xml = this.stringifyPayXml(pay_param);
      let pay_xml = await request({
        url: "https://api.mch.weixin.qq.com/pay/unifiedorder",
        method: "POST",
        body: xml
      });
      let orderinfo = await this.xmlParse(pay_xml);
      if (orderinfo.xml.return_code == "FAIL") {
        throw new Error(orderinfo.xml.return_msg);
      } else {
        if (orderinfo.xml.prepay_id) {
          let pay_param_boss = this.doWechatPay(orderinfo.xml.prepay_id);
          return pay_param_boss;
        } else {
          throw new Error("prepay_id 获取失败");
        }
      }
    } catch (error) {
      throw error;
    }
  }
  xmlParse(xml) {
    return new Promise((resolve, reject) => {
      xml2js.parseString(xml, { trim: true, explicitArray: false }, function(
        err,
        data
      ) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  /**
   * prepay_id
   *
   * @param {any} prepay_id prepay_id=wx2017033010242291fcfe0db70013231072
   * @memberof wechatPayService
   */
  doWechatPay(prepay_id) {
    let nonceStr = randomize("abcdefghijklmnopqrstuvwxyz123456789", 30);
    let timeStamp = new Date().valueOf() + "";
    let pay_sign_param = {
      appId: this.opt.appid,
      nonceStr: nonceStr,
      package: "prepay_id=" + prepay_id,
      signType: "MD5",
      timeStamp: timeStamp,
      key: this.opt.key
    };
    // sig 验证 支付参数验证有坑，key是在最后的
    let str_param = `appId=${pay_sign_param.appId}&nonceStr=${
      pay_sign_param.nonceStr
    }&package=${pay_sign_param.package}&signType=${
      pay_sign_param.signType
    }&timeStamp=${pay_sign_param.timeStamp}&key=${pay_sign_param.key}`;
    let paySign = crypto
      .createHash("md5")
      .update(str_param, "utf8")
      .digest("hex")
      .toUpperCase();
    return {
      paySign: paySign,
      signType: "MD5",
      package: "prepay_id=" + prepay_id,
      timeStamp: timeStamp,
      nonceStr: nonceStr
    };
  }
  // 签名验证
  doSign(params) {
    let str = this.stringifyParam(params);
    str = str + "&key=" + this.opt.key;
    let sign = crypto
      .createHash("md5")
      .update(str, "utf8")
      .digest("hex");
    return sign.toUpperCase();
  }
  stringifyPayXml(body) {
    let template = `<xml>
    <appid>${body.appid}</appid>
    <mch_id>${body.mch_id}</mch_id>
    <nonce_str>${body.nonce_str}</nonce_str>
    <body>${body.body}</body>
    <out_trade_no>${body.out_trade_no}</out_trade_no>
    <total_fee>${body.total_fee}</total_fee>
    <spbill_create_ip>${body.spbill_create_ip}</spbill_create_ip>
    <notify_url>${body.notify_url}</notify_url>
    <trade_type>${body.trade_type}</trade_type>
    <product_id>${body.product_id}</product_id>
    <openid>${body.openid}</openid>
    <sign>${body.sign}</sign>
    </xml>`;
    return template;
  }
  /**
   *
   *退款接口
   * @param {*} orderId
   * @param {*} refund_fee
   * @param {*} total_fee
   * @param {*} refund_desc
   * @param {*} transaction_id
   * @returns
   * @memberof wechatPayService
   */
  async doRefund(param) {
    try {
      let nonce_str = randomize("abcdefghijklmnopqrstuvwxyz123456789", 30);
      let out_refund_no = randomize("abcdefghijklmnopqrstuvwxyz123456789", 30);
      let pre_param = {
        appid: this.opt.appid,
        mch_id: this.opt.mch_id,
        nonce_str: nonce_str,
        out_refund_no: out_refund_no,
        out_trade_no: param.orderId,
        refund_fee: param.refund_fee,
        total_fee: param.total_fee,
        refund_desc: param.refund_desc,
        transaction_id: param.transaction_id,
        notify_url: this.opt.notify_refund_url
      };

      let sign = this.doSign(pre_param);
      pre_param.sign = sign;

      let xml = this.stringifyRefundXml(pre_param);

      let refund_response_xml = await request({
        url: "https://api.mch.weixin.qq.com/secapi/pay/refund",
        method: "POST",
        body: xml,
        agentOptions: {
          pfx: this.opt.pfx,
          passphrase: this.opt.mch_id
        }
      });
      let refund_response = await this.xmlParse(refund_response_xml);
      return refund_response.xml.err_code_des || refund_response.xml.return_msg;
    } catch (error) {
      throw new Error("refund fail" + error.message);
    }
  }
  // 退款的xml格式
  stringifyRefundXml(body) {
    let template = `<xml>
    <appid>${body.appid}</appid>
    <mch_id>${body.mch_id}</mch_id>
    <nonce_str>${body.nonce_str}</nonce_str> 
    <out_refund_no>${body.out_refund_no}</out_refund_no>
    <out_trade_no>${body.out_trade_no}</out_trade_no>
    <refund_fee>${body.refund_fee}</refund_fee>
    <total_fee>${body.total_fee}</total_fee>
    <refund_desc>${body.refund_desc}</refund_desc>
    <transaction_id>${body.transaction_id}</transaction_id>
    <notify_url>${body.notify_url}</notify_url>
    <sign>${body.sign}</sign>
    </xml>`;
    return template;
  }
}
module.exports = wechatPayService;

/*
支付参数
小程序ID	appid	是	String(32)	wxd678efh567hg6787	微信分配的小程序ID
商户号	mch_id	是	String(32)	1230000109	微信支付分配的商户号
设备号	device_info	否	String(32)	013467007045764	自定义参数，可以为终端设备号(门店号或收银设备ID)，PC网页或公众号内支付可以传"WEB"
随机字符串	nonce_str	是	String(32)	5K8264ILTKCH16CQ2502SI8ZNMTM67VS	随机字符串，长度要求在32位以内。推荐随机数生成算法
签名	sign	是	String(32)	C380BEC2BFD727A4B6845133519F3AD6	通过签名算法计算得出的签名值，详见签名生成算法
签名类型	sign_type	否	String(32)	MD5	签名类型，默认为MD5，支持HMAC-SHA256和MD5。
商品描述	body	是	String(128)	腾讯充值中心-QQ会员充值	
商品简单描述，该字段请按照规范传递，具体请见参数规定
商品详情	detail	否	String(6000)	 	商品详细描述，对于使用单品优惠的商户，改字段必须按照规范上传，详见“单品优惠参数说明”
附加数据	attach	否	String(127)	深圳分店	附加数据，在查询API和支付通知中原样返回，可作为自定义参数使用。
商户订单号	out_trade_no	是	String(32)	20150806125346	商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*且在同一个商户号下唯一。详见商户订单号
标价币种	fee_type	否	String(16)	CNY	符合ISO 4217标准的三位字母代码，默认人民币：CNY，详细列表请参见货币类型
标价金额	total_fee	是	Int	88	订单总金额，单位为分，详见支付金额
终端IP	spbill_create_ip	是	String(16)	123.12.12.123	APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。
交易起始时间	time_start	否	String(14)	20091225091010	订单生成时间，格式为yyyyMMddHHmmss，如2009年12月25日9点10分10秒表示为20091225091010。其他详见时间规则
交易结束时间	time_expire	否	String(14)	20091227091010	
订单失效时间，格式为yyyyMMddHHmmss，如2009年12月27日9点10分10秒表示为20091227091010。订单失效时间是针对订单号而言的，由于在请求支付的时候有一个必传参数prepay_id只有两小时的有效期，所以在重入时间超过2小时的时候需要重新请求下单接口获取新的prepay_id。其他详见时间规则
建议：最短失效时间间隔大于1分钟
订单优惠标记	goods_tag	否	String(32)	WXG	订单优惠标记，使用代金券或立减优惠功能时需要的参数，说明详见代金券或立减优惠
通知地址	notify_url	是	String(256)	http://www.weixin.qq.com/wxpay/pay.php	异步接收微信支付结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数。
交易类型	trade_type	是	String(16)	JSAPI	小程序取值如下：JSAPI，详细说明见参数规定
商品ID	product_id	否	String(32)	12235413214070356458058	trade_type=NATIVE时（即扫码支付），此参数必传。此参数为二维码中包含的商品ID，商户自行定义。
指定支付方式	limit_pay	否	String(32)	no_credit	上传此参数no_credit--可限制用户不能使用信用卡支付
用户标识	openid	否	String(128)	oUpF8uMuAJO_M2pxb1Q9zNjWeS6o	trade_type=JSAPI，此参数必传，用户在商户appid下的唯一标识。openid如何获取，可参考【获取openid】。

*/
// 退款申请
/* 小程序ID	appid	是	String(32)	wx8888888888888888	微信分配的小程序ID
商户号	mch_id	是	String(32)	1900000109	微信支付分配的商户号
随机字符串	nonce_str	是	String(32)	5K8264ILTKCH16CQ2502SI8ZNMTM67VS	随机字符串，不长于32位。推荐随机数生成算法
签名	sign	是	String(32)	C380BEC2BFD727A4B6845133519F3AD6	签名，详见签名生成算法
签名类型	sign_type	否	String(32)	HMAC-SHA256	签名类型，目前支持HMAC-SHA256和MD5，默认为MD5
微信订单号	transaction_id	二选一	String(32)	1217752501201407033233368018	微信生成的订单号，在支付通知中有返回
商户订单号	out_trade_no	String(32)	1217752501201407033233368018	商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*@ ，且在同一个商户号下唯一。
商户退款单号	out_refund_no	是	String(64)	1217752501201407033233368018	商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_-|*@ ，同一退款单号多次请求只退一笔。
订单金额	total_fee	是	Int	100	订单总金额，单位为分，只能为整数，详见支付金额
退款金额	refund_fee	是	Int	100	退款总金额，订单总金额，单位为分，只能为整数，详见支付金额
货币种类	refund_fee_type	否	String(8)	CNY	货币类型，符合ISO 4217标准的三位字母代码，默认人民币：CNY，其他值列表详见货币类型
退款原因	refund_desc	否	String(80)	商品已售完	若商户传入，会在下发给用户的退款消息中体现退款原因
退款资金来源	refund_account	否	String(30)	REFUND_SOURCE_RECHARGE_FUNDS	
仅针对老资金流商户使用

REFUND_SOURCE_UNSETTLED_FUNDS---未结算资金退款（默认使用未结算资金退款）

REFUND_SOURCE_RECHARGE_FUNDS---可用余额退款

退款结果通知url	notify_url	否	String(256)	https://weixin.qq.com/notify/	
异步接收微信支付退款结果通知的回调地址，通知URL必须为外网可访问的url，不允许带参数

如果参数中传了notify_url，则商户平台上配置的回调地址将不会生效。 */

// demo
// 初始化
// const payService = new wechatPayService({
//   appid: config.wechatPay.appid,
//   appkey: config.wechatPay.appkey,
//   mch_id: config.wechatPay.mch_id,
//   key: config.wechatPay.key,
//   notify_url: "https://game2.stackh.cn/apiv1//order/reactOrderNotify",
//   notify_refund_url: "https://game2.stackh.cn/apiv1//order/reactRefundNotify",
//   pfx: fs.readFileSync(
//     path.resolve(__dirname, "../../../plugin/cert/apiclient_cert.p12")
//   )
// });
// 退款
// let res = await payService.doRefund({
//   orderId: order._id,
//   refund_fee: 1,
//   total_fee: 1,
//   refund_desc: "時間錯誤i",
//   transaction_id: order.transaction_id
// });
// 下订单
// let pay_res = await payService.doOrder({
//   openid: body.openid,
//   body: "测试淘淘巴士body",
//   out_trade_no: body.order,
//   product_id: body.order,
//   total_fee: 1,
//   spbill_create_ip: ctx.ip.match(/\d+.\d+.\d+.\d+/)
// });
