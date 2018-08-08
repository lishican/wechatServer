const axios = require("axios");
const sha1 = require("sha1");
const randomize = require("randomatic");

class SdkService {
  constructor(opts) {
    this.wechat = opts.wechat;
    this.redisClient = opts.redis;
  }
  /**
   * @param {any} refresh_token
   * @returns
   * @memberof SdkService
   */
  async refreshToke(refresh_token) {
    let url = "https://api.weixin.qq.com/sns/oauth2/refresh_token";
    let params = {
      appid: this.wechat.AppID,
      grant_type: "refresh_token",
      refresh_token: refresh_token
    };
    let response = await axios.get(url, { params });
    if (response.data.errcode) {
      return;
    }
    return response.data.access_token;
  }
  /**
   * 获取全局access_token
   *
   * @returns
   * @memberof SdkService
   */
  async getAccessToken() {
    try {
      let token = await redisClient.getAsync(
        "wechat#access_token#" + this.wechat.AppID
      );
      console.log("token");
      console.log(token);
      if (token) {
        return token;
      }

      let url = "https://api.weixin.qq.com/cgi-bin/token";
      let params = {
        grant_type: "client_credential",
        appid: this.wechat.AppID,
        secret: this.wechat.AppSecret
      };
      let response = await axios.get(url, { params });
      redisClient.set(
        "wechat#access_token#" + this.wechat.AppID,
        response.data.access_token,
        "EX",
        3600
      );
      return response.data.access_token;
    } catch (error) {}
  }
  /**
   * 获取顽网页分享签名
   *
   * @param {any} url
   * @returns
   * @memberof SdkService
   */
  async getAuth(url) {
    let ticket = await this.getJsTicket();
    if (!ticket) {
      return false;
    }
    var noncestr = randomize("abcde1234567890", 30);
    var timestamp = new Date("2017-10-10").valueOf();
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
      appId: this.wechat.AppID,
      signature: signature
    };
    return jsapiInfo;
  }

  /**
   * 获取网页分享凭证
   *
   * @returns
   * @memberof SdkService
   */
  async getJsTicket() {
    try {
      let jsTicket = await redisClient.getAsync(
        "wechat#jsticket#" + this.wechat.AppID
      );
      if (jsTicket) {
        return jsTicket;
      }
      let token = await this.getAccessToken();
      if (!token) {
        return false;
      }
      let url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket";
      let params = {
        access_token: token,
        type: "jsapi"
      };
      let response = await axios.get(url, { params });
      if (response.data.errcode) {
        return false;
      }
      redisClient.set(
        "wechat#jsticket#" + this.wechat.AppID,
        response.data.ticket,
        "EX",
        3600
      );

      return response.data.ticket;
    } catch (error) {}
  }
  /**
   * 后去网页授权accessToken
   *
   * @param {any} code
   * @returns
   * @memberof SdkService
   */
  async getWebToken(code) {
    let url = "https://api.weixin.qq.com/sns/oauth2/access_token";
    let params = {
      appid: this.wechat.AppID,
      secret: this.wechat.AppSecret,
      code: code,
      grant_type: "authorization_code"
    };
    let res = await axios.get(url, { params });
    return res.data;
  }

  checkIsExpire(createTime, expires_in) {
    let currentTime = new Date().valueOf();
    if (parseInt(expires_in + createTime) > currentTime) {
      // 还法没过期
      return true;
    } else {
      // 已过期
      return false;
    }
  }

  /**
   * 根据token获取userinfo
   *
   * @param {any} access_token
   * @param {any} openid
   * @returns
   * @memberof SdkService
   */
  async getUserInfo(access_token, openid) {
    let url = "https://api.weixin.qq.com/sns/userinfo";
    let params = {
      access_token: access_token,
      openid: openid,
      lang: "zh_CN"
    };
    let res = await axios.get(url, { params });
    if (res.data.errcode) {
      return false;
    }
    return res.data;
  }
}

module.exports = SdkService;
