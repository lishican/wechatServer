const is = require("is-type-of");
const queryString = require("query-string");
module.exports = function(ctx, params, filter) {
  let body = {};
  if (ctx.method == "POST") {
    body = ctx.request.body;
  } else {
    body = ctx.request.query;
  }
  // 如果设置了过滤参数
  if (filter && is.array(filter)) {
    Object.keys(body).forEach(v => {
      if (!v.indexOf(filter)) {
        delete body[v];
      }
    });
  }
  params = is.array(params) ? params : [params];
  
  if (params.length == 0) {
    return body;
  }
  for (let param of params) {
    if (is.object(param)) {
      if (!body[param.name] || body[param.name] == "") {
        return {
          error: param.name + " is require"
        };
      } else {
        if (!is[param.type](body[param.name])) {
          return {
            error: param.name + "is require type " + param.type
          };
        }
      }
    } else {
      if (!body[param] || body[param] == "") {
        return {
          error: param + " is require"
        };
      }
    }
  }

  return body;
};
