const redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(redis);

function createConnection(config) {
  const redis_config = config.password
    ? {
        port: config.port,
        no_ready_check: true,
        password: config.password
      }
    : {
        port: config.port,
        no_ready_check: true
      };
  const client = redis.createClient(config.uri, redis_config);
  client.select(config.db, null);
  client.on("connect", function() {
    console.log("redis connect ok");
  });
  client.on("error", function(err) {
    console.error(err);
  });
  return client;
}

module.exports = {
  createConnection
};
