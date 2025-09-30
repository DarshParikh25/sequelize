import { Sequelize, Model, DataTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const database = process.env.DB_NAME;
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect: "postgres",
  logging: console.log, // to watch the raw SQL logs during connection
});

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.FLOAT,
      validate: {
        isNaN: false,
      },
    },
  },
  {
    sequelize,
    modelName: "Product",
    freezeTableName: "items",
  }
);
