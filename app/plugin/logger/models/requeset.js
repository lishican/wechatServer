const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;

const RequestSchema = new Schema({
  name: {
    type: String,
    default: ""
  },
  message: {
    type: String,
    default: ""
  },
  stack: {
    type: String,
    default: ""
  },
  ip: {
    type: String,
    default: ""
  },
  url: {
    type: String,
    default: ""
  },
  method: {
    type: String,
    default: ""
  },
  query: {
    type: Mixed,
    default: ""
  },
  body: {
    type: Mixed,
    default: ""
  },
  response: {
    type: Mixed,
    default: ""
  },
  status: {
    type: Number,
    default: 0
  },
  useTime: {
    type: String,
    default: 0
  },
  contentType: {
    type: Mixed,
    default: ""
  },
  userAgent: {
    type: String,
    default: ""
  },
  headers: {
    type: Mixed,
    default: ""
  },
  protocol: {
    type: String,
    default: ""
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
RequestSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});

RequestSchema.set("toJSON", { getters: true, setters: true, virtuals: true });

module.exports = RequestSchema;
