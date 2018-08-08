"use strict";

const autocannon = require("autocannon");
autocannon(
  {
    url: "http://120.79.225.12:9180/tour/tour/qryFaqDetail",
    // url: 'http://127.0.0.1:3580/apiv1/schedule/getUpDownSite',
    connections: 230, //default
    pipelining: 120, // default
    // duration: 100, // default
    method: "POST",
    amount:1000,
    body: JSON.stringify({
      timestamp: "1234567098",
      sig: "D4244E58911003AE7D6DE0077E2DE5BB",
      actId: "A11"
    })
  },
  console.log
);
