// common

const validator = require("../../util/validator");

// model
let bus_user = require("../../plugin").busdb.model("bus_user");
let bus_schedule = require("../../plugin").busdb.model("bus_schedule");
const adminService = require("../../service/api/admin.service");

class Controller {
  async updateCarNum(ctx, next) {}
  async pushMessage(ctx, next) {
    let body = validator(ctx, ["scheduleId", "ids"]);
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    try {
      let doc = await adminService.pushMessage(body);
      ctx.body = doc;
    } catch (error) {
      ctx.body = {
        code: 400,
        data: error.message
      };
    }
    // let alldoc = await bus_or
  }
  async updateTickets(ctx, next) {
    let body = validator(ctx, ["scheduleId", "status"]);
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    try {
      let doc = await adminService.updateTickets(body);
      ctx.body = doc;
    } catch (error) {
      ctx.body = {
        code: 400,
        data: error.message
      };
    }
  }

  async fetchTicketInfo(ctx, next) {
    let body = validator(ctx, ["orderId", "scheduleId"]);
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    try {
      let doc = await adminService.fetchTicketInfo(body);
      ctx.body = doc;
    } catch (error) {
      ctx.body = {
        code: 400,
        data: error.message
      };
    }
  }
  async checkTicket(ctx, next) {
    let body = validator(ctx, ["orderId"]);
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    try {
      let doc = await adminService.checkTicket(body);
      ctx.body = doc;
    } catch (error) {
      ctx.body = {
        code: 400,
        data: error.message
      };
    }
  }
  async getScheduleList(ctx, next) {
    try {
      let doc = await bus_schedule.find({}).sort({
        "meta.createAt": 1
      });
      ctx.body = {
        code: 200,
        data: doc
      };
    } catch (error) {
      ctx.body = {
        code: 400,
        data: error.message
      };
    }
  }
  async getScheduleById(ctx, next) {
    let body = validator(ctx, "scheduleId");
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    try {
      let doc = await adminService.getScheduleById(body);
      ctx.body = doc;
    } catch (error) {
      ctx.body = {
        code: 400,
        data: error.message
      };
    }
  }
  async login(ctx, next) {
    let body = validator(ctx, "openid");
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    let user = await bus_user.findOneAndUpdate(
      { openid: body.openid },
      { $set: body },
      { new: true, upsert: true }
    );
    ctx.body = {
      code: 200,
      data: user
    };
  }
}

let ins = new Controller();
module.exports = ins;
