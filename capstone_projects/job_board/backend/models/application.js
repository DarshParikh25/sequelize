"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Application extends Model {}
  Application.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Application",
    }
  );
  return Application;
};
