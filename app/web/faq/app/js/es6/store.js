window.Api = {
  doMd5: id => {
    let timestamp = new Date().valueOf();
    let str = `actId=${id}&timestamp=${timestamp}`;
    let str2 = md5(str).toUpperCase();
    return {
      sig: str2,
      timestamp: timestamp
    };
  },
  doJavaPost: (url, actId, param) => {
    console.log(this)
    let sig = Api.doMd5(actId);
    let params = { actId: actId, ...sig, ...param };
    return new Promise((resolve, reject) => {
      axios({
        url: url,
        method: "post",
        data: params,
        transformRequest: [
          function(data) {
            let ret = "";
            for (let it in data) {
              ret +=
                encodeURIComponent(it) +
                "=" +
                encodeURIComponent(data[it]) +
                "&";
            }
            return ret;
          }
        ],
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
        .then(data => {
          resolve(data.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  
};
