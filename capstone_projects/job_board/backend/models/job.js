"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Job extends Model {}
  Job.init(
    {
      // No foreign key columns
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      company: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      location: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Job",
    }
  );
  return Job;
};
