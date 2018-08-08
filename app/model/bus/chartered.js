const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const moment = require("moment");
const shortid = require("shortid");

const CharteredSchema = new Schema({
  start_site: {
    type: String,
    default: ""
  },
  end_site: {
    type: String,
    default: ""
  },
  date: {
    type: String,
    default: ""
  },
  time: {
    type: String,
    default: ""
  },
  name: {
    type: String,
    default: ""
  },
  phone: {
    type: String,
    default: ""
  },
  user: {
    type: ObjectId,
    ref: "bus_user"
  },
  // 包车状态  1 申请中 2 已联系通过 3 已取消 4 客户取消
  status:{
    type:Number,
    default:1
  },
  total: Number,
  // 是否双程
  is_both:{
    type:Boolean,
    default:false
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

CharteredSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});
CharteredSchema.set("toJSON", { getters: true, virtuals: true });

module.exports = CharteredSchema;
