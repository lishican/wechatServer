let bus_schedule = require("../../plugin").busdb.model("bus_schedule");

const shortid = require("shortid");
const validator = require("../../util/validator");
const parse = require("../../util/parse");
const redisClient = require("../../plugin").busRedis;
const scheduleService = require("../../service/api/schedule.service");
class Controller {
  async list(ctx, next) {
    let match_param = parse(ctx, {
      start_site: {
        type: "regex"
      },
      price: {
        type: "in"
      },
      end_site: {
        type: "regex"
      },
      "meta.updateAt": {
        type: "beteewn",
        params: ["start_time", "end_time"]
      }
    });
    let skip = parseInt(ctx.request.body.skip) || 0;
    let limit = parseInt(ctx.request.body.limit) || 0;
    let sort = parseInt(ctx.request.body.sort) || "meta.updateAt";
    console.log(match_param);
    let count = await bus_schedule.count(match_param);
    let doc = await bus_schedule
      .find(match_param)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
    ctx.body = {
      code: 200,
      data: doc,
      count: count
    };
  }
  async add(ctx, next) {
    let body = validator(ctx, ["up_site", "down_site"]);
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    let count = await redisClient.incrAsync("bus#schedule#counter");
    let name = "GD_" + count;
    let doc = await bus_schedule.create({
      name,
      ...ctx.request.body
    });
    redisClient.set("bus#schedule#total#" + doc._id, doc.ticket);
    ctx.body = {
      code: 200,
      data: doc
    };
  }
  async findById(ctx, next) {
    let body = validator(ctx, ["id"]);
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }

    let doc = await bus_schedule.findById(body.id);

    ctx.body = {
      code: 200,
      data: doc
    };
  }
  async upd(ctx, next) {
    let body = validator(ctx, ["id"]);
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }

    let doc = await bus_schedule.findByIdAndUpdate(
      body.id,
      {
        $set: {
          ...body
        }
      },
      { new: true }
    );
    redisClient.set("bus#schedule#total#" + doc._id, doc.ticket);
    ctx.body = {
      code: 200,
      data: doc
    };
  }
  async del(ctx, next) {
    let body = validator(ctx, ["id"]);
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    redisClient.del("bus#schedule#total#" + body.id);
    let doc = await bus_schedule.findOneAndRemove(body.id);
    ctx.body = {
      code: 200,
      data: doc
    };
  }
}

let ins = new Controller();
module.exports = ins;
