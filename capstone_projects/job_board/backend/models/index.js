import User from "./user";
import Job from "./job";
import Application from "./application";
import { sequelize } from "../config/db";

User.hasMany(Application, { foreignKey: "userId" });
Application.belongsTo(User, { foreignKey: "userId" });

Job.hasMany(Application, { foreignKey: "jobId" });
Application.belongsTo(Job, { foreignKey: "jobId" });

export { sequelize, User, Job, Application };
