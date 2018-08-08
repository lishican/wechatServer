const errorScheme = require("./error");
const requesetScheme = require("./requeset");
const recordScheme = require("./record");

function register(db) {
  let errorModel = db.model("logger_error", errorScheme, "logger_error");
  let requesetModel = db.model(
    "logger_requeset",
    requesetScheme,
    "logger_requeset"
  );
  let recordModel = db.model("logger_record", recordScheme, "logger_record");
  return { errorModel, requesetModel, recordModel };
}

module.exports = register;
