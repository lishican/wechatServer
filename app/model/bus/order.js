const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const moment = require("moment");
const shortid = require("shortid");

const OrderSchema = new Schema({
  uuid: {
    unique: true,
    required: true,
    type: String
  },

  // 班次名称
  schedule_name: {
    type: String,
    default: ""
  },
  // 返回班次名称
  schedule_back_name: {
    type: String,
    default: ""
  },
  user: {
    type: ObjectId,
    ref: "bus_user",
    index: true
  },
  // 用户openid
  openid: {
    type: String,
    default: ""
  },
  //价格
  fee:{
    type:Number,
    default:0.01
  },
  both_fee:{
    type:Number,
    default:0.01
  },
  phone: {
    type: String,
    default: ""
  },
  userName: {
    type: String,
    default: ""
  },

  schedule: {
    type: ObjectId,
    ref: "bus_schedule"
  },
  pay_type: {
    type: Number,
    default: 1
  },
  //0 默认新创建  1 预支付创建 2 已支付  3 申请退款中 4 退款完成
  status: {
    type: Number,
    default: 0
  },
  is_checked: {
    type: Boolean,
    default: false
  },
  // 已检票的次数 一般1一次 双城的2次
  ticket_have_checked: {
    type: Number,
    default: 0
  },
  //票数
  ticket: {
    type: Number,
    default: 1
  },
  // 票类型 1单程 2双程
  ticket_type: {
    type: Number,
    default: 1
  },

  // 微信的订单id 退款用到
  transaction_id: {
    type: String,
    default: ""
  },
  // 预支付的id
  prepay_id: {
    type: String,
    default: ""
  },
  // 检票时间
  check_time: {
    type: Date,
    default: null
  },
  // 双程票第第一次交
  check_time_two: {
    type: Date,
    default: null
  },
  // 支付时间
  pay_time: {
    type: Date,
    default: null
  },
  // 退款时间
  refund_time: {
    type: Date,
    default: null
  },
  // 下订单时间
  order_time: {
    type: Date,
    default: null
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now
    },
    updateAt: {
      type: Date,
      default: Date.now
    }
  }
});

// OrderSchema.index({ user: 1, schedule: 1 });
OrderSchema.path('pay_time').get(function(v){
  return moment(v).format('YYYY-MM-DD HH:mm:ss')
})
OrderSchema.path('order_time').get(function(v){
  return moment(v).format('YYYY-MM-DD HH:mm:ss')
})
OrderSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});

OrderSchema.set("toJSON", { getters: true, virtuals: true });

module.exports = OrderSchema;
