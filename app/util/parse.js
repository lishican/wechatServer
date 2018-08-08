const is = require("is-type-of");
const rules = {
  regex: (name, who) => {
    return {
      [name]: {
        $regex: who,
        $options: "$ig"
      }
    };
  },
  eq: (name, who) => {
    return {
      [name]: {
        $eq: who
      }
    };
  },
  ne: (name, who) => {
    return {
      [name]: {
        $ne: who
      }
    };
  },
  beteewn: (name, arr) => {
    return {
      [name]: {
        $gt: arr[0],
        $lt: arr[1]
      }
    };
  },
  beteewn: (name, arr) => {
    return {
      [name]: {
        $gt: arr[0],
        $lt: arr[1]
      }
    };
  },
  in: (name, arr) => {
    return {
      [name]: {
        $in: arr
      }
    };
  },
  nin: (name, arr) => {
    return {
      [name]: {
        $nin: arr
      }
    };
  },
  gt: (name, who) => {
    return {
      [name]: {
        $gt: who
      }
    };
  },
  lt: (name, who) => {
    return {
      [name]: {
        $lt: who
      }
    };
  },
  gte: (name, who) => {
    return {
      [name]: {
        $gt: who
      }
    };
  },
  lte: (name, who) => {
    return {
      [name]: {
        $lt: who
      }
    };
  }
};

// console.log(Object.keys(is))
// [ 'array',
//   'boolean',
//   'null',
//   'nullOrUndefined',
//   'number',
//   'string',
//   'symbol',
//   'undefined',
//   'regExp',
//   'object',
//   'date',
//   'error',
//   'function',
//   'primitive',
//   'buffer',
//   'herits',
//   'stream',
//   'readableStream',
//   'writableStream',
//   'duplexStream',
//   'class',
//   'finite',
//   'NaN',
//   'generator',
//   'generatorFunction',
//   'asyncFunction',
//   'promise',
//   'int',
//   'int32',
//   'long',
//   'Long',
//   'double',
//   'regexp' ]

module.exports = (ctx, options) => {
  let match_param = {};
  for (let item in options) {
    let type = options[item].type;
    let param = null;
    if (is.nullOrUndefined(options[item].params)) {
      if (ctx.request.body[item] == "") {
        continue;
      } else {
        param = ctx.request.body[item];
      }
    }
    if (is.array(options[item].params)) {
      param = options[item].params.map(v => {
        return ctx.request.body[v] ? ctx.request.body[v] : null;
      });
      // beteewn 特殊用法
      if (!param[0] && param[1]) {
        param = param[1];
        type = "lte";
      } else if (!param[1] && param[0]) {
        param = param[0];
        type = "gte";
      } else if (!param[1] && !param[0]) {
        param = null;
      } else {
        type = "beteewn";
      }
    } else {
      param = ctx.request.body[item] ? ctx.request.body[item] : null;
    }
    if (is.nullOrUndefined(param)) {
      continue;
    } else {
      let rule = rules[type](item, param);
      match_param = { ...match_param, ...rule };
    }
  }

  console.log(match_param);
  return match_param;
};
