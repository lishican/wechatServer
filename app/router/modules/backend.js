const router = require("koa-router")();
const scheduleController = require("../../controller/backend/schedule.controller");
const admin_auth = require("../../middleware/admin_auth");

router.use(admin_auth());
router.post("/schedule", scheduleController.list);
router.post("/schedule/add", scheduleController.add);
router.post("/schedule/upd", scheduleController.upd);
router.post("/schedule/del", scheduleController.del);
router.post("/schedule/findById", scheduleController.findById);

module.exports = router;
