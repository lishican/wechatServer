// 微信授权中间件
const queryString = require("query-string");
const web_oauth = require("../plugin").wechatOuth;
const config = require("../../config");
// auth=1 提示授权 2 静默授权
module.exports = opts => {
  return async function oauth(ctx, next) {
    try {
      let isAuth = ctx.params.auth;
      let type = null;
      console.log("isAuth");
      console.log(isAuth);
      if (isAuth != 0) {
        // 授权
        type = isAuth == 2 ? "snsapi_userinfo" : "snsapi_base";
        // 首次进来保存请求参数
        if (!ctx.query.code) {
          ctx.session.query = ctx.query;
          ctx.session.path = ctx.originalUrl.split("?")[0];
        }
        if (ctx.session.tokeninfo) {
          let jsapi = await web_oauth.getAuth(
            `https://${ctx.hostname}${ctx.originalUrl}`
          );
          ctx.session.jsapi = jsapi;
          // 是否过期
          if (
            web_oauth.checkIsExpire(
              ctx.session.tokeninfo.createTime,
              ctx.session.tokeninfo.expires_in * 1000
            )
          ) {
            if (type === "snsapi_userinfo") {
              let userInfo = await web_oauth.getUserInfo(
                ctx.session.tokeninfo.access_token,
                ctx.session.tokeninfo.openid
              );
              ctx.session.userInfo = userInfo;
              await next();
            } else {
              ctx.session.userInfo = {
                openid: ctx.session.tokeninfo.openid
              };
              await next();
            }
          } else {
            delete ctx.session.tokeninfo;
            ctx.session.query = ctx.query;
            let redirect_url = encodeURI(
              `https://${ctx.hostname}${ctx.session.path}`
            );
            let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
              config.wechatWeb.AppID
            }&redirect_uri=${redirect_url}&response_type=code&scope=${type}&state=1#wechat_redirect`;
            ctx.redirect(url);
          }
        } else {
          if (ctx.query.code) {
            let tokeninfo = await web_oauth.getWebToken(ctx.query.code);
            tokeninfo.createTime = new Date().valueOf();
            ctx.session.tokeninfo = tokeninfo;
            // 返回原链接
            let param = queryString.stringify(ctx.session.query);

            let url = param
              ? `https://${ctx.hostname}${ctx.session.path}?${param}`
              : `https://${ctx.hostname}${ctx.session.path}`;
            ctx.redirect(url);
          } else {
            // 重定向
            let redirect_url = encodeURI(
              `https://${ctx.hostname}${ctx.session.path}`
            );
            let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
              config.wechatWeb.AppID
            }&redirect_uri=${redirect_url}&response_type=code&scope=${type}&state=1#wechat_redirect`;
            ctx.redirect(url);
          }
        }
      } else {
        await next();
      }
    } catch (error) {
      ctx.throw(error);
    }
  };
};
