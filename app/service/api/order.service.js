const redisClient = require("../../plugin").busRedis;
const shortid = require("shortid");
const moment = require("moment");
const bus_order = require("../../plugin").busdb.model("bus_order");
const bus_schedule = require("../../plugin").busdb.model("bus_schedule");
const payPlugin = require("../../plugin").wechatPay;
class OrderService {
  constructor() {}

  /**
   *处理微信服务器返回来的订单信息
   *
   * @param {*} orderId
   * @param {*} transaction_id
   * @memberof OrderService
   */
  async handleOrdeNotify(orderId, transaction_id) {
    // TODO: 1 判断是否单双程 人数 2 单程的减少票数
    let order = await bus_order
      .findById(orderId)
      .populate("user")
      .populate("schedule");
    if (!order) {
      return {
        code: 400,
        msg: "订单不存在"
      };
    }
    if (order.status != 1) {
      return false;
    }
    // 如果是双程的
    if (order.ticket_type == 2) {
      let back_schedule = await bus_schedule.findOne({
        name: order.schedule.back_shcedule_name
      });
      if (!back_schedule) {
        return {
          code: 400,
          msg: "返程的车编号不存在"
        };
      }
      // 增加返程的已售票数
      let booked_back = await redisClient.incrbyAsync(
        "bus#schedule#booked#" + back_schedule._id,
        order.ticket
      );
      // // 剩余票数更新
      await bus_schedule.findByIdAndUpdate(back_schedule._id, {
        $set: {
          hava_saled: parseInt(booked_back)
        }
      });
    }
    // 增加单程的次数
    let booked = await redisClient.incrbyAsync(
      "bus#schedule#booked#" + order.schedule._id,
      order.ticket
    );
    // 剩余票数更新
    await bus_schedule.findByIdAndUpdate(order.schedule._id, {
      $set: {
        hava_saled: parseInt(booked)
      }
    });
    // 更改订单状态
    let orders = await bus_order.findByIdAndUpdate(orderId, {
      $set: {
        status: 2,
        transaction_id: transaction_id,
        pay_time: new Date()
      }
    });
    return orders;
  }
  // 查看订单详情
  async fetchOrderById(body) {
    try {
      let doc = await bus_order
        .findById(body.orderId)
        .populate("user")
        .populate("schedule");
      return {
        code: 200,
        data: doc
      };
    } catch (error) {
      return {
        code: 400,
        msg: error.message
      };
    }
  }

  async fetchOrderList(body) {
    try {
      let doc = await bus_order
        .find({
          openid: body.openid
        })
        .sort({
          pay_time: -1
        })
        .populate("user")
        .populate("schedule");

      return {
        code: 200,
        data: doc
      };
    } catch (error) {
      return {
        code: 400,
        msg: error.message
      };
    }
  }

  // 检票
  async checkTicket(body) {
    try {
      let order = await bus_order.findById(body.orderId);
      if (!order) {
        return {
          code: 400,
          msg: "订单不存在"
        };
      }
      if (order.is_checked) {
        return {
          code: 400,
          msg: "已检票",
          time: moment(order.check_time).format("YYYY-MM-DD HH:mm:ss")
        };
      }
      let order_add_check_type = await bus_order.findByIdAndUpdate(
        order._id,
        {
          $inc: {
            ticket_have_checked: 1
          }
        },
        { new: true }
      );

      // 如果是单程
      if (order_add_check_type.ticket_type == 1) {
        let bus_order_last = await bus_order.findByIdAndUpdate(
          order._id,
          {
            $set: {
              is_checked: true,
              check_time: new Date()
            }
          },
          { new: true }
        );

        return {
          code: 200,
          msg: "检票成功",
          data: bus_order_last
        };
      }

      // 如果双程
      if (
        order_add_check_type.ticket_type == 2 &&
        order_add_check_type.ticket_have_checked == 2
      ) {
        let bus_order_last = await bus_order.findByIdAndUpdate(
          order._id,
          {
            $set: {
              is_checked: true,
              check_time: new Date()
            }
          },
          { new: true }
        );
        return {
          code: 200,
          msg: "返程检票成功（双程票）",
          data: bus_order_last
        };
      } else {
        let bus_order_last = await bus_order.findByIdAndUpdate(
          order._id,
          {
            $set: {
              check_time_two: new Date()
            }
          },
          { new: true }
        );
        return {
          code: 200,
          msg: "第一程检票成功（双程票）",
          data: bus_order_last
        };
      }
    } catch (error) {
      return {
        code: 400,
        msg: error.message
      };
    }
  }

  // 退票处理
  async handleRefund(body) {
    let order = await bus_order.findById(body.order).populate("schedule");
    let start_time = order.schedule.start_time.valueOf();
    let currentTime = new Date().valueOf();
    // 1小时前不能退票
    let expire_time = start_time - 60 * 60 * 100;

    if (order.is_checked) {
      return {
        code: 400,
        msg: "已经检票，无法退回"
      };
    }
    if (currentTime > expire_time) {
      return {
        code: 400,
        msg: "发车前一个小时不能退票"
      };
    }
    let refund_res = await payPlugin.doRefund({
      orderId: order._id,
      refund_fee:
        order.ticket_type == 1
          ? order.schedule.price * 100 * order.ticket
          : order.schedule.both_price * 100 * order.ticket,
      total_fee:
        order.ticket_type == 1
          ? order.schedule.price * 100 * order.ticket
          : order.schedule.both_price * 100 * order.ticket,
      refund_desc: "购票退款",
      transaction_id: order.transaction_id
    });

    console.log(refund_res);
    if (refund_res == "OK") {
      let ticketsNum = parseInt(order.ticket);
      await redisClient.decrbyAsync(
        "bus#schedule#booked#" + order.schedule._id,
        ticketsNum
      );
      // 票数增加回来
      await bus_schedule.findByIdAndUpdate(order.schedule._id, {
        $inc: {
          hava_saled: -ticketsNum
        }
      });
      order = await bus_order.findByIdAndUpdate(
        order._id,
        {
          $set: {
            status: 4,
            refund_time: new Date().valueOf()
          }
        },
        { new: true }
      );
      return {
        code: 200,
        data: order,
        msg: "退票成功"
      };
    } else {
      return {
        code: 400,
        msg: refund_res
      };
    }
  }
  // 创建订单
  async createOrder(body) {
    let schedule = await bus_schedule.findById(body.schedule);
    if (!schedule) {
      return {
        code: 400,
        msg: "班次不存在"
      };
    }
    if (schedule.start_time.valueOf() < new Date().valueOf()) {
      return {
        code: 400,
        msg: "班次已结束"
      };
    }
    // 先判断票售完了没
    let total_go = await redisClient.getAsync(
      "bus#schedule#total#" + body.schedule
    );
    let booked_go =
      (await redisClient.getAsync("bus#schedule#booked#" + body.schedule)) || 0;
    console.log(total_go, booked_go);
    console.log(parseInt(booked_go) + parseInt(body.ticket));
    if (parseInt(total_go) < parseInt(booked_go) + parseInt(body.ticket)) {
      return {
        code: 400,
        msg: "单程票已售完"
      };
    }
    // 如果是双程的
    if (body.ticket_type == 2) {
      if (!schedule.is_both) {
        return {
          code: 400,
          msg: "该班次只支持单程"
        };
      }
      if (!schedule) {
        return {
          code: 400,
          msg: "班次不存在"
        };
      }
      let back_schedule_doc = await bus_schedule.findOne({
        name: schedule.back_shcedule_name
      });

      if (!back_schedule_doc) {
        return {
          code: 400,
          msg: "返程班次不存在"
        };
      }
      let total_back = await redisClient.getAsync(
        "bus#schedule#total#" + back_schedule_doc._id
      );
      let booked_back = await redisClient.getAsync(
        "bus#schedule#booked#" + back_schedule_doc._id
      );

      booked_back = booked_back || 0;
      // 如果已经售出的票加现在的票
      if (
        parseInt(total_back) <
        parseInt(booked_back) + parseInt(body.ticket)
      ) {
        return {
          code: 400,
          msg: "返程的票已售完"
        };
      }
    }

    let doc = await bus_order.create({
      order_time: new Date().valueOf(),
      uuid: shortid(),
      schedule_name: schedule.name,
      schedule_back_name: schedule.back_shcedule_name,
      status: 1,
      fee: schedule.price,
      both_fee: schedule.both_price,
      ...body
    });
    return {
      code: 200,
      data: doc
    };
  }
  // 预支付参数
  async doPay(orderId, openId, ip) {
    let order = await bus_order.findById(orderId).populate("schedule");
    if (!order) {
      return {
        code: 400,
        msg: "订单不存在"
      };
    }

    let fee =
      order.ticket_type == 1
        ? order.schedule.price * 100 * order.ticket
        : order.schedule.both_price * 100 * order.ticket;

    console.log("fee");
    console.log(fee);

    // 调用订单支付
    let pay_res = await payPlugin.doOrder({
      openid: openId,
      body: "测试淘淘巴士body",
      out_trade_no: order._id,
      product_id: order._id,
      total_fee:
        order.ticket_type == 1
          ? order.schedule.price * 100 * order.ticket
          : order.schedule.both_price * 100 * order.ticket,
      spbill_create_ip: ip
    });

    // 把订单转成预支付状态
    await bus_order.findByIdAndUpdate(order._od, {
      $set: {
        status: 1,
        prepay_id: pay_res.package
      }
    });
    return {
      code: 200,
      data: pay_res,
      order: order
    };
  }
}

let os = new OrderService();
// os.fetchOrderList({openid:'o9KtV4xkMJteOgsKPiUwRMuJi5yk'}).then(data=>{
//   console.log(data)
// })
// os.handleOrdeNotify("5b1fc6cc5002f3207ce77af8", "5b1f24de4a39cc52acb8793a");
// os.fetchOrderById({ orderId: "5b1fc6cc5002f3207ce77af8" }).then(data=>{
//   console.log(data)
// })
module.exports = os;
