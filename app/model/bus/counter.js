const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const moment = require("moment");
const crypto = require("crypto");

// 计数集合
const CounterSchema = new Schema({
  cid: Number,
  problems: {
    type: Number,
    default: 0
  },
  products: {
    type: Number,
    default: 0
  },
  schedule: {
    type: Number,
    default: 0
  }
});
CounterSchema.path("schedule").get(function(val) {
  let str = val + "";
  let len = 5 - str.length;
  for (let i = 0; i < len; i++) {
    str = "0" + str;
  }
  return str;
});
CounterSchema.set("toJSON", { getters: true, setters: true, virtuals: true });

module.exports = CounterSchema;
