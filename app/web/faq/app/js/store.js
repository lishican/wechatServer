"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

window.Api = {
  doMd5: function doMd5(id) {
    var timestamp = new Date().valueOf();
    var str = "actId=" + id + "&timestamp=" + timestamp;
    var str2 = md5(str).toUpperCase();
    return {
      sig: str2,
      timestamp: timestamp
    };
  },
  doJavaPost: function doJavaPost(url, actId, param) {
    console.log(undefined);
    var sig = Api.doMd5(actId);
    var params = _extends({ actId: actId }, sig, param);
    return new Promise(function (resolve, reject) {
      axios({
        url: url,
        method: "post",
        data: params,
        transformRequest: [function (data) {
          var ret = "";
          for (var it in data) {
            ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
          }
          return ret;
        }],
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(function (data) {
        resolve(data.data);
      }).catch(function (err) {
        reject(err);
      });
    });
  }

};