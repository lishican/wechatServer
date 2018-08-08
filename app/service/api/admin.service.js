const bus_order = require("../../plugin").busdb.model("bus_order");
const bus_schedule = require("../../plugin").busdb.model("bus_schedule");
const moment = require("moment");
const wmn = require("../../plugin").wechatMessage;
class adminService {
  constructor() {}
  async _promiseAll(problem_list) {
    let doc_list = await Promise.all(problem_list);
    return doc_list;
  }
  async pushMessage(body) {
    let { scheduleId, ids } = body;

    let orders = await bus_order
      .find({ schedule: scheduleId, _id: { $in: ids } })
      .populate("schedule");

    //  schedule_name: 'GD_1',
    //  schedule_back_name: '',
    //  openid: 'o9KtV4xkMJteOgsKPiUwRMuJi5yk',
    //  phone: '18826252073',
    //  userName: '落地撒阿斯达',
    //  pay_type: 1,
    //  status: 2,
    //  is_checked: true,
    //  ticket_have_checked: 1,
    //  ticket: 1,
    //  ticket_type: 1,
    //  transaction_id: '4200000111201806163494817459',
    //  prepay_id: '',
    //  check_time: 2018-06-16T15:18:36.568Z,
    //  check_time_two: null,
    //  pay_time: 2018-06-16T15:07:47.086Z,
    //  refund_time: null,
    //  order_time: 2018-06-16T15:07:30.935Z,
    //  _id: 5b2527b2e910983db873d591,
    //  uuid: 'BysnDsMbQ',
    //  user: 5b1a935c66822c36b2b7f747,
    //  schedule: 5b23e229d60e2320082d6728,
    //  __v: 0

    let failCount = [];
    for (let item in orders) {
      let ticket = orders[item];
      let msgContent = {
        openId: ticket.openid,
        page: "pages/index/check?orderId=" + ticket._id,
        templateId: "ZhmqASY7exUktNNhcSqXoPa3l9hFL7oikZ7UOp6IdkM",
        data: {
          keyword1: {
            value: ticket.schedule.start_site + "-" + ticket.schedule.end_site
          },
          keyword2: {
            value: ticket.uuid
          },
          keyword3: {
            value: ticket.schedule.up_site
          },
          keyword4: {
            value: ticket._id
          },
          keyword5: {
            value: ticket.pay_time
          },
          keyword6: {
            value: ticket.schedule.start_time
          }
        },
        emphasis_keyword: "keyword1.DATA"
      };
      let doc = await wmn.sendTemplateMsg(msgContent);
      if (!doc) {
        failCount.push({
          user: ticket.userName,
          phone: ticket.phone
        });
      }
    }

    return {
      code: 200,
      msg: "推送成功",
      failCount: failCount
    };
  }
  async updateTickets(body) {
    let { scheduleId, status } = body;

    let doc = await bus_schedule.findByIdAndUpdate(
      scheduleId,
      {
        $set: { bus_status: parseInt(status) }
      },
      {
        new: true
      }
    );
    return {
      code: 200,
      data: doc
    };
  }
  async fetchTicketInfo(body) {
    let doc = await bus_order.findById(body.orderId).populate("schedule");
    if (!doc) {
      return {
        code: 400,
        msg: "订单不存在"
      };
    }

    if (doc.schedule._id != body.scheduleId) {
      return {
        code: 400,
        msg: "订单班次不对应"
      };
    }

    return {
      code: 200,
      data: doc
    };
  }
  async checkTicket(body) {
    try {
      let order = await bus_order.findById(body.orderId).populate("schedule");
      if (!order) {
        return {
          code: 400,
          msg: "订单不存在"
        };
      }
      if (order.is_checked) {
        return {
          code: 400,
          msg: "错误，已检票",
          time: moment(order.check_time).format("YYYY-MM-DD HH:mm:ss")
        };
      }

      // 已检票数增加
      await bus_schedule.findByIdAndUpdate(order.schedule._id, {
        $inc: {
          hava_checked_count: order.ticket
        }
      });

      console.log(order.schedule.bus_status);
      if (order.schedule.bus_status != 2) {
        return {
          code: 400,
          msg: "该班次尚未开启检票"
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

  async getScheduleById(body) {
    let { scheduleId } = body;
    let schedules_doc = await bus_schedule.findById(scheduleId);
    let order_list = await bus_order.find({
      $or: [
        {
          schedule: scheduleId
        },
        {
          schedule_back_name: schedules_doc.back_shcedule_name
        }
      ]
    });

    let countCheck = schedules_doc.hava_checked_count;
    let booked = schedules_doc.hava_saled;

    return {
      code: 200,
      data: {
        schedules_doc,
        order_list,
        booked,
        countCheck
      }
    };
  }
}

let os = new adminService();
// os.getScheduleById()
module.exports = os;
