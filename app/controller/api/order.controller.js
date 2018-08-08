const validator = require("../../util/validator");
// model
let bus_order = require("../../plugin").busdb.model("bus_order");
let bus_chartered = require("../../plugin").busdb.model("bus_chartered");
// service
const orderService = require("../../service/api/order.service");

class Controller {
  async createOrder(ctx, next) {
    let body = validator(
      ctx,
      [
        "user",
        "phone",
        "userName",
        "schedule",
        "openid",
        "pay_type",
        "ticket_type",
        "ticket"
      ],
      [
        "user",
        "phone",
        "userName",
        "schedule",
        "openid",
        "pay_type",
        "ticket_type",
        "ticket"
      ]
    );
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }

    try {
      let doc = await orderService.createOrder(body);
      ctx.body = doc;
    } catch (error) {
      console.error(error);
      ctx.body = {
        code: 400,
        msg: error.message
      };
    }
  }

  async getOrderList(ctx, next) {
    let body = validator(ctx, ["openId"]);
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    try {
      let doc = await bus_order
        .find({ openid: body.openId, status: { $in: [2, 3, 4] } })
        .populate("user")
        .populate("schedule")
        .sort({ pay_time: -1 });
      ctx.body = {
        code: 200,
        data: doc
      };
    } catch (error) {
      console.error(error);
      ctx.body = {
        code: 400,
        msg: error.message
      };
    }
  }
  // 保存包车订单
  async saveChartered(ctx, next) {
    let body = validator(
      ctx,
      [
        "start_site",
        "end_site",
        "date",
        "time",
        "name",
        "phone",
        "user",
        "is_both",
        "total"
      ],
      [
        "start_site",
        "end_site",
        "date",
        "time",
        "name",
        "phone",
        "user",
        "is_both",
        "total"
      ]
    );
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    try {
      let doc = await bus_chartered.create({
        status: 1,
        ...body
      });
      ctx.body = {
        code: 200,
        data: doc
      };
    } catch (error) {
      console.error(error);
      ctx.body = {
        code: 400,
        msg: error.message
      };
    }
  }
  async getCharteredList(ctx, next) {
    let body = validator(ctx, ["userId"]);
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    try {
      let doc = await bus_chartered
        .find({ user: body.userId })
        .populate("user");
      ctx.body = {
        code: 200,
        data: doc
      };
    } catch (error) {
      console.error(error);
      ctx.body = {
        code: 400,
        msg: error.message
      };
    }
  }
  async cancelChartered(ctx, next) {
    let body = validator(ctx, ["charteredId"]);
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    try {
      let doc = await bus_chartered.findById(body.charteredId);

      if (!doc) {
        return (ctx.body = {
          code: 400,
          data: "订单不存在"
        });
      }

      if (doc.status == 2 || doc.status == 3 || doc.status == 4) {
        return (ctx.body = {
          code: 400,
          data: "该订单无法取消"
        });
      }
      let newdoc = await bus_chartered.findByIdAndUpdate(
        body.charteredId,
        {
          $set: { status: 4 }
        },
        { new: true }
      );

      ctx.body = {
        code: 200,
        data: newdoc
      };
    } catch (error) {
      console.error(error);
      ctx.body = {
        code: 400,
        msg: error.message
      };
    }
  }

  async getOrderById(ctx, next) {
    let body = validator(ctx, ["orderId"]);
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    try {
      let doc = await bus_order
        .findById(body.orderId)
        .populate("user")
        .populate("schedule");
      ctx.body = {
        code: 200,
        data: doc
      };
    } catch (error) {
      console.error(error);
      ctx.body = {
        code: 400,
        msg: error.message
      };
    }
  }
  async doPay(ctx, next) {
    let body = validator(ctx, ["orderId", "openId"]);
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    try {
      let doc = await orderService.doPay(
        body.orderId,
        body.openId,
        ctx.ip.match(/\d+.\d+.\d+.\d+/)
      );
      ctx.body = doc;
    } catch (error) {
      console.error(error);
      ctx.body = {
        code: 400,
        msg: error.message
      };
    }
  }
  // 退款通知
  async reactRefundNotify(ctx, next) {
    let body = validator(ctx, "xml");
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    let xml_ok = `<xml>
    <return_code><![CDATA[SUCCESS]]></return_code>
    <return_msg><![CDATA[OK]]></return_msg>
   </xml>`;
    ctx.type = "xml";
    ctx.body = xml_ok;
  }
  // 订单成功通知
  async reactOrderNotify(ctx, next) {
    let body = validator(ctx, "xml");
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    // TODO:签名验证
    let code = body.xml.result_code[0];
    let orderId = body.xml.out_trade_no[0];
    let transaction_id = body.xml.transaction_id[0];
    if (code != "SUCCESS") {
      return false;
    }
    await orderService.handleOrdeNotify(orderId, transaction_id);
    let xml_ok = `<xml>
    <return_code><![CDATA[SUCCESS]]></return_code>
    <return_msg><![CDATA[OK]]></return_msg>
   </xml>`;
    ctx.type = "xml";
    ctx.body = xml_ok;
  }

  // 退款 申请
  async reactRefund(ctx, next) {
    let body = validator(ctx, "order");
    if (body.error) {
      return (ctx.body = {
        code: 400,
        msg: body.error
      });
    }
    try {
      let doc = await orderService.handleRefund(body);
      ctx.body = doc;
    } catch (error) {
      ctx.body = {
        code: 400,
        msg: error.message
      };
    }
  }
}

let ins = new Controller();
module.exports = ins;
