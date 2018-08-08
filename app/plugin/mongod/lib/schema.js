function addMeta(schema, options) {
  schema.add({
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

  schema.pre("save", function(next) {
    if (this.isNew) {
      this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
      this.meta.updateAt = Date.now();
    }
    next();
  });

  if (options && options.index) {
    schema.path("meta").index(options.index);
  }
}

module.exports = {
  addMeta
};
