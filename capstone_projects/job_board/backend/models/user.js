"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      // No foreign key columns
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          len: [8, 15],
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
