const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const moment = require("moment");

const ScheduleSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  // 上车点
  up_site: {
    type: String,
    default: ""
  },
  down_site: {
    type: String,
    default: ""
  },
  start_site: {
    type: String,
    default: ""
  },
  end_site: {
    type: String,
    default: ""
  },
  start_time: {
    type: Date,
    default: Date.now
  },
  price: {
    type: Number,
    default: 0.01
  },
  // 双城价格
  both_price: {
    type: Number,
    default: 0.01
  },
  car_num: {
    type: String,
    default: ""
  },
  // 备注
  remark: {
    type: String,
    default: ""
  },
  // 是否往返
  is_both: {
    type: Boolean,
    default: false
  },
  // 如果支持双程，则需要加上回程的id
  back_shcedule_name: {
    type: String,
    default: ""
  },
  hava_checked_count: {
    type: Number,
    default: 0
  },

  //1未发车 2 检票中 3 已完成
  bus_status: {
    type: Number,
    default: 1
  },
  hava_saled: {
    type: Number,
    default: 0
  },
  // 1 微信 2 到付 3 微信+到付
  pay_type: {
    type: Number,
    default: 1
  },
  is_end: {
    type: Boolean,
    default: false
  },
  //票数
  ticket: {
    type: Number,
    default: 10
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

ScheduleSchema.path("start_time").get(function(v) {
  return moment(v).format("YYYY-MM-DD HH:mm:ss");
});
ScheduleSchema.index({ start_site: 1, end_site: 1 });
ScheduleSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});

ScheduleSchema.set("toJSON", { getters: true, virtuals: true });

module.exports = ScheduleSchema;
