// common
const shortid = require("shortid");
const axios = require("axios");
const config = require("../../../config");

// util plugin

const validator = require("../../util/validator");
const parse = require("../../util/parse");
// model
const bus_schedule = require("../../plugin").busdb.model("bus_schedule");

class Controller {
  async index(ctx, next) {
    let body = validator(ctx, "user", "schedule", [
      "user",
      "schedule",
      "payType",
      "is_both",
      "ticket",
      "check_count"
    ]);
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    ctx.body = {
      code: 200,
      data: "data"
    };
  }
  async getUpDownSite(ctx, next) {
    let all_site = await bus_schedule.aggregate([
      {
        $match: {
          start_time: {
            $gt: new Date()
          },
          bus_status: {
            $nin: [3]
          }
        }
      },
      {
        $group: { _id: { start_site: "$start_site", down_site: "$end_site" } }
      },
      { $replaceRoot: { newRoot: "$_id" } }
    ]);
    let doc = all_site;
    ctx.body = {
      code: 200,
      data: doc
    };
  }

  async getScheduleBySite(ctx, next) {
    let match_param = parse(ctx, {
      start_site: {
        type: "eq"
      },
      end_site: {
        type: "eq"
      }
    });
    let doc = await bus_schedule.find({
      start_time: {
        $gte: new Date()
      },
      bus_status: {
        $nin: [3]
      },
      ...match_param
    });
    ctx.body = {
      code: 200,
      data: doc
    };
  }
  async getScheduleById(ctx, next) {
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
}

let ins = new Controller();
module.exports = ins;
