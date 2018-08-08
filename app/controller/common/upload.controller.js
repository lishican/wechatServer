const qiniu = require("../../plugin/").qiniu;

// common upload api
class Controller {
  async upload(ctx, next) {
    let files = ctx.request.body.files;
    let file = files[Object.keys(files)[0]];
    let url = await qiniu.uploadStream(file.path);
    ctx.body = {
      data: [url],
      errno: 0
    };
  }
  async uploadToken(ctx, next) {
    let token = qiniu.getUploadToken();
    ctx.body = {
      code: 200,
      data: token
    };
  }
}
module.exports = new Controller();
