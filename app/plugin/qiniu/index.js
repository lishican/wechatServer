const qiniu = require("qiniu");
const path = require("path");
const fs = require("fs");
const qn = require("qn");

class Qiniu {
  constructor(config) {
    this.config = config;
    this.client = qn.create({
      accessKey: config.ak,
      secretKey: config.sk,
      bucket: config.bucket,
      origin: config.domin,
      uploadURL: "http://up-z2.qiniup.com"
    });
    this.mac = new qiniu.auth.digest.Mac(config.ak, config.sk);
    let options = {
      scope: config.bucket,
      deleteAfterDays: 50
    };
    this.putPolicy = new qiniu.rs.PutPolicy(options);
    this.bucketManager = new qiniu.rs.BucketManager(this.mac, null);
  }
  getUploadToken() {
    let token = this.putPolicy.uploadToken(this.mac);
    return token;
  }
  uploadStream(stream) {
    return new Promise((resolve, reject) => {
      this.client.upload(fs.createReadStream(stream), function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result.url);
        }
      });
    });
  }
}

module.exports = Qiniu;
