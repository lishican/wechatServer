const router = require("koa-router")();
const koaBody = require("koa-body");
const admin_auth = require("../../middleware/admin_auth");
const uploadController = require("../../controller/common/upload.controller");
const authController = require("../../controller/common/auth.controller");
const wechatController = require("../../controller/common/wechat.controller");
// 后台权限
router.post("/login", authController.login);
router.post("/loginOut", admin_auth(), authController.loginOut);

// 文件上传
router.get("/upload", koaBody({ multipart: true }), uploadController.upload);
router.get("/uploadToken", uploadController.uploadToken);

// 微信授权
router.get("/wechat", wechatController.signature);
router.post("/jsapi", wechatController.jsapi);

module.exports = router;
