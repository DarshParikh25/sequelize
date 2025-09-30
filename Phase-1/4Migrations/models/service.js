"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Service.init(
    {
      name: DataTypes.STRING,
      plans: DataTypes.INTEGER,
      price: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Service",
    }
  );
  return Service;
};
