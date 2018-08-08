
const bus_order = require("../../plugin").busdb.model("bus_order");
const bus_schedule = require("../../plugin").busdb.model("bus_schedule");


class userService {
  constructor() {}


  /**
   *处理微信服务器返回来的订单信息
   *
   * @param {*} orderId
   * @param {*} transaction_id
   * @memberof userService
   */
  handleOrdeNotify(orderId,transaction_id){
    await orderModel.findByIdAndUpdate(orderId, {
      $set: {
        status: 1,
        pay_time: new Date().valueOf(),
        transaction_id: transaction_id
      }
    });
  }


  handleRefund(order){

  }


}

let os = new userService();

module.exports = os;
