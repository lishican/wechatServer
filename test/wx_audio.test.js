let ffmpeg = require("fluent-ffmpeg");
const qn = require("qn");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const request = require("request");
const CONFIG = {
  accessKey: "abiFs-ClecYzdqd3Gx2768qMpvgcOjoD-0KLBtF7",
  secretKey: "2IWtPGLGuUe9yDs8O1XQf-IFiUa--3RyZiduBEZz",
  bucket: "91marryu",
  origin: "http://ofvbasfrz.bkt.clouddn.com",
  ACCESS_TOKEN: ""
};
const client = qn.create({
  accessKey: CONFIG.accessKey,
  secretKey: CONFIG.secretKey,
  bucket: CONFIG.bucket,
  origin: CONFIG.origin,
  uploadURL: "http://up-z2.qiniup.com"
});

function getMp3ByMediaId(mediaId) {
  let token = "231";
  let url = `https://api.weixin.qq.com/cgi-bin/media/get?access_token=${token}&media_id=${mediaId}`;
  return new Promise((resolve, reject) => {
    let tempFileName = path.resolve(__dirname, "./" + uuid() + ".mp3");
    ffmpeg(request(url))
      .on("error", function(err) {
        console.log("An error occurred: " + err.message);
        reject("An error occurred: " + err.message);
      })
      .on("end", function() {
        client.upload(fs.createReadStream(tempFileName), (err, data) => {
          fs.unlinkSync(tempFileName);
          console.log(data);
          resolve(data.url);
        });
      })
      .save(tempFileName);
  });
}

module.exports = getMp3ByMediaId;
