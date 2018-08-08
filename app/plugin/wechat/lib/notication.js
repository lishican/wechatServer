const axios = require("axios");
class wechatPushMsg {
  constructor(opt) {
    this.appid = opt.appId;
    this.secret = opt.appSecret;
    this.redisClient = opt.redis;
  }
  /**
   *
   *获取推送信息token 一个钟
   * @param {any} appid
   * @param {any} appkey
   * @memberof wechatPushMsg
   */
  async getAccessToken(appid, secret) {
    let token = await redisClient.getAsync("wechat#access_token#" + appid);
    console.log(token);
    if (token) {
      return token;
    } else {
      let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
      console.log(url);
      let response = await axios.get(url);
      if (response.data.access_token) {
        redisClient.set(
          "wechat#access_token#" + appid,
          response.data.access_token,
          "EX",
          3600
        );
        return response.data.access_token;
      } else {
        console.error(response.data);
        return false;
      }
    }
  }

  async setFormId(uid, form_id) {
    let time = new Date().valueOf();
    await redisClient.zaddAsync("user#form_id#" + uid, time, form_id);
    return;
  }

  async getFormId(uid) {
    let time = parseInt(new Date().valueOf());
    let expire_time = time - 1000 * 60 * 60 * 24 * 7;
    let form_id = await redisClient
      .multi()
      .zremrangebyscore("user#form_id#" + uid, 0, expire_time)
      .zrange("user#form_id#" + uid, 0, 0)
      .zremrangebyrank("user#form_id#" + uid, 0, 0)
      .execAsync();

    return form_id[1][0];
  }

  /**
   *
   * @param {any} template_id 2kzXqg4KnZM5nYYN60-4gZv-cl1onlahf2LKmM6qJRA
   * @param {any} msg
   * @returns
   * @memberof wechatPushMsg
   */
  async sendTemplateMsg(msgContent) {
    let token = await this.getAccessToken(this.appid, this.secret);
    let form_id = await this.getFormId(msgContent.openId);
    if (!form_id) {
      return false;
    }
    let pushurl = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${token}`;
    let post_data = {
      touser: msgContent.openId,
      template_id: msgContent.templateId,
      page: msgContent.page,
      form_id: form_id,
      data: msgContent.data,
      emphasis_keyword: msgContent.emphasis_keyword
    };
    console.log(post_data);
    let res = await axios.post(pushurl, post_data);
    console.log("推送成功");
    console.log(res.data);
    return res.data;
  }
}

module.exports = wechatPushMsg;
