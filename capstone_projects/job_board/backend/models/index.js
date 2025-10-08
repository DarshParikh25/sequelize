import { DataTypes } from "sequelize";

import userModel from "./user.js";
import jobModel from "./job.js";
import applicationModel from "./application.js";
import { sequelize } from "../config/db.js";

const User = userModel(sequelize, DataTypes);
const Job = jobModel(sequelize, DataTypes);
const Application = applicationModel(sequelize, DataTypes);

User.hasMany(Application, { foreignKey: "userId" });
Application.belongsTo(User, { foreignKey: "userId" });

Job.hasMany(Application, { foreignKey: "jobId" });
Application.belongsTo(Job, { foreignKey: "jobId" });

export { sequelize, User, Job, Application };
