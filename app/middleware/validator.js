const is = require("is-type-of");
module.exports = (params, filter) => {
  return async function validator(ctx, next) {
    let body = {};
    if (ctx.method == "POST") {
      body = ctx.request.body;
    } else {
      body = ctx.request.query;
    }
    if (filter && is.array(filter)) {
      Object.keys(body).forEach(v => {
        if (!v.indexOf(filter)) {
          delete body[v];
        }
      });
    }
    params = is.array(params) ? params : [params];
    for (let param of params) {
      if (is.object(param)) {
        if (!body[param.name] || body[param.name] == "") {
          return (ctx.body = {
            code: 400,
            msg: param.name + " is require"
          });
        } else {
          if (!is[param.type](body[param.name])) {
            return {
              code: 400,
              msg: param.name + " is require"
            };
          }
        }
      } else {
        if (!body[param] || body[param] == "") {
          return (ctx.body = {
            code: 400,
            msg: param + " is require"
          });
        }
      }
    }

    ctx.vb = body;

    await next();
  };
};
