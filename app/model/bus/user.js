const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const moment = require("moment");

const UserSchema = new Schema({
  user_name: {
    type: String,
    default: ""
  },
  user_phone: {
    type: String,
    default: ""
  },
  nickname: {
    type: String,
    default: ""
  },
  head_img: {
    type: String,
    default: ""
  },
  openid: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: Number,
    default: 1
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

UserSchema.index({ openid: 1 });
UserSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});

UserSchema.set("toJSON", { getters: true, virtuals: true });

module.exports = UserSchema;
