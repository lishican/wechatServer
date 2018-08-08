const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const moment = require("moment");
const crypto = require("crypto");

// 管理员集合
const AdminSchema = new Schema({
  // 用户名
  username: {
    type: String,
    default: "",
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    default: "",
    required: true
  },
  // 状态
  last_login: {
    type: Date,
    default: Date.now
  },
  auth: [
    {
      type: Number,
      default: 100
    }
  ],
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
AdminSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});

AdminSchema.virtual("password")
  .set(function(password) {
    this._password = password;
    this.hashedPassword = this.md5(password);
  })
  .get(function() {
    return this._password;
  });

AdminSchema.methods = {
  verifyPass(password) {
    return this.md5(password) == this.hashedPassword;
  },
  md5(str) {
    console.log(str);
    let md5 = crypto.createHash("md5");
    md5.update(str + "");
    let raw = md5.digest("hex");
    let s = raw.toUpperCase();
    console.log(s);
    return s;
  }
};

AdminSchema.set("toJSON", { getters: true, setters: true, virtuals: true });

module.exports = AdminSchema;
