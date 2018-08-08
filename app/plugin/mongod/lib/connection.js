const mongoose = require("mongoose");
function createConnection(config) {
  let uri = `mongodb://${config.username}:${config.password}@${config.host}:${
    config.port
  }/${config.db}`;
  let con = mongoose.createConnection(uri, {
    poolSize: config.poolSize || 10,
    useNewUrlParser: true
  });
  con.on("error", err => {
    console.error(err);
  });
  con.on("open", () => {
    console.info("mongodb connect success " + uri);
  });
  return con;
}

module.exports = createConnection;
