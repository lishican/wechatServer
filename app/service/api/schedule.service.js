const bus_order = require("../../plugin").busdb.model("bus_order");

class scheduleService {
  async fetchScheduleUser(body) {
    let all_user = await bus_order.aggregate([
      {
        $match: {
          $or: [
            {
              schedule_name: body.name
            },
            {
              schedule_back_name: body.name
            }
          ]
        }
      },
      {
        $lookup: {
          from: "bus_schedule",
          localField: "schedule",
          foreignField: "_id",
          as: "schedule"
        }
      },
      {
        $lookup: {
          from: "bus_user",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $addFields: {
          schedule: { $arrayElemAt: ["$schedule", 0] },
          user: { $arrayElemAt: ["$user", 0] }
        }
      }
    ]);
  }
}

let os = new scheduleService();

module.exports = os;
