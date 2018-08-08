const router = require("koa-router")();
const orderController = require("../../controller/api/order.controller");
const userController = require("../../controller/api/user.controller");
const scheduleController = require("../../controller/api/schedule.controller");
const adminController = require("../../controller/api/admin.controller");
// 乘客端====================================================start
// 登录
router.post("/user/getOpenId", userController.getOpenId);
router.post("/user/login", userController.login);
router.post("/user/saveFormId", userController.saveFormId);
router.post("/schedule/getUpDownSite", scheduleController.getUpDownSite);
router.post(
  "/schedule/getScheduleBySite",
  scheduleController.getScheduleBySite
);
router.post("/schedule/getScheduleById", scheduleController.getScheduleById);
// 下订单接口
router.post("/order/createOrder", orderController.createOrder);
router.post("/order/doPay", orderController.doPay);
router.post("/order/reactOrderNotify", orderController.reactOrderNotify);
router.post("/order/getOrderById", orderController.getOrderById);
router.post("/order/getOrderList", orderController.getOrderList);
router.post("/order/reactRefund", orderController.reactRefund);
router.post("/order/reactRefundNotify", orderController.reactRefundNotify);
// 包车的订单
router.post("/order/saveChartered", orderController.saveChartered);
router.post("/order/getCharteredList", orderController.getCharteredList);
router.post("/order/cancelChartered", orderController.cancelChartered);
// 乘客端====================================================end

// 管理员端====================================================start
router.post("/manage/login", adminController.login);
router.post("/manage/getScheduleList", adminController.getScheduleList);
router.post("/manage/getScheduleById", adminController.getScheduleById);
router.post("/manage/checkTicket", adminController.checkTicket);
router.post("/manage/fetchTicketInfo", adminController.fetchTicketInfo);
// 更新发车状态
router.post("/manage/updateTickets", adminController.updateTickets);
// 更新车票号
router.post("/manage/updateCarNum", adminController.updateCarNum);
router.post("/manage/pushMessage", adminController.pushMessage);

// 管理员端====================================================end

module.exports = router;
