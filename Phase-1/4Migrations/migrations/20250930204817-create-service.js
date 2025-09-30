"use strict";
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Services", {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    plans: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    price: {
      allowNull: false,
      type: Sequelize.FLOAT,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Services");
}
