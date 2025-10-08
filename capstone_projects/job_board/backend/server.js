import app from "./app.js";
import { sequelize } from "./models/index.js";

const PORT = process.env.PORT || 5000;

// Database connection test
try {
  await sequelize.authenticate();
  console.log("Database connected successfully");
} catch (err) {
  console.error("DB connection failed:", err);
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
