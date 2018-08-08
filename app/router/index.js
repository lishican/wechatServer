const router = require("koa-router")();

const apiv1 = require("./modules/apiv1");
const common = require("./modules/common");
const backend = require("./modules/backend");
const web = require("./web");

router.use("/apiv1", apiv1.routes(), apiv1.allowedMethods({ throw: true }));
router.use("/common", common.routes(), common.allowedMethods({ throw: true }));
router.use(
  "/backend",
  backend.routes(),
  backend.allowedMethods({ throw: true })
);
router.use("/web", web.routes(), web.allowedMethods({ throw: true }));

module.exports = router;
