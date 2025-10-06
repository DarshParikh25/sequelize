"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Application extends Model {}
  Application.init(
    {
      // No foreign key columns
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
