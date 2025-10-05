import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./models/index.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Basic route to check API
app.get("/", (req, res) => {
  res.send("Job Board API is running...");
});

// Database connection test
try {
  await sequelize.authenticate();
  console.log("Database connected successfully");
} catch (err) {
  console.error("DB connection failed:", err);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
