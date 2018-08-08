
```
./bin/cmd.js create -s bus2.api -k bus_admin.bus_user.bus_admins
./bin/cmd.js create -m quiz.record
```







http://h5.stackh.cn/

Response 别名
以下访问器和 Response 别名等效：
```
ctx.body
ctx.body=
ctx.status
ctx.status=
ctx.message
ctx.message=
ctx.length=
ctx.length
ctx.type=
ctx.type
ctx.headerSent
ctx.redirect()
ctx.attachment()
ctx.set()
ctx.append()
ctx.remove()
ctx.lastModified=
ctx.etag=
```

Request 别名
以下访问器和 Request 别名等效：
```
ctx.header
ctx.headers
ctx.method
ctx.method=
ctx.url
ctx.url=
ctx.originalUrl
ctx.origin
ctx.href
ctx.path
ctx.path=
ctx.query
ctx.query=
ctx.querystring
ctx.querystring=
ctx.host
ctx.hostname
ctx.fresh
ctx.stale
ctx.socket
ctx.protocol
ctx.secure
ctx.ip
ctx.ips
ctx.subdomains
ctx.is()
ctx.accepts()
ctx.acceptsEncodings()
ctx.acceptsCharsets()
ctx.acceptsLanguages()
ctx.get()
```

### 微信验证
``` 
http://127.0.0.1:3000/wechat/index



f6bc83a400cf869c6e43e71a10cebe69


伟哥 小程序
wx94f8714a4c642926
f6bc83a400cf869c6e43e71a10cebe69
game.stackh.cn


```
router.post("/user/fetchuser", async (ctx, next) => {
  // https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code

  let js_code = ctx.request.body.code;
  let authorization_code = "authorization_code";
  let req_url = `https://api.weixin.qq.com/sns/jscode2session?appid=${AppId}&secret=${AppKey}&js_code=${js_code}&grant_type=${authorization_code}`;

  let res = await axios.get(req_url);
  ctx.body = {
    code: 200,
    data: res.data
  };
});

/* 
is.array(arr)
is.boolean(bool)
is.null(null)
is.nullOrUndefined(null)
is.number(num)
is.string(str)
is.symbol(sym)
is.undefined(undef)
is.regExp(reg)
is.object(obj)
is.date(date)
is.error(err)
is.function(fn)
is.primitive(prim)
is.buffer(buf)
from is-stream
is.stream(stream)
is.readableStream(readable)
is.writableStream(writable)
is.duplexStream(duplex)
from is-class
is.class(obj)
Extend API
is.finite(num)
is.NaN(NaN)
is.generator(gen)
is.generatorFunction(fn)
is.promise(fn)
is.int(int)
is.double(double)
is.int32(int)
is.long(long)
is.Long(Long) */

```

```
model("sign")
  .aggregate()
  .lookup({ from: 'users', localField: 'user', foreignField: '_id', as: 'users' })
  .lookup({ from: 'courses', localField: 'course', foreignField: '_id', as: 'courses' })
  .match({
    "users.name":"黎世灿"
  })
  .exec((err, data) => {
    // console.log(data);
  });
  ```
