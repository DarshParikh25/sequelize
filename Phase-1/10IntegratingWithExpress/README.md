# Integrating Sequelize with Express (Simple REST)

## Project Setup

Assume we already have Sequelize initialized (`sequelize init` → models, migrations, config).
Now, we’ll integrate it with Express.

### Project structure (simplified):<hr/>

```pgsql
project/
 ├── models/
 │    └── user.js
 ├── migrations/
 │    └── <timestamp>-create-user.js
 ├── controllers/
 │    └── userController.js
 ├── routes/
 │    └── userRoutes.js
 ├── app.js
 └── server.js
```

## User Model (`models/user.js`)

```js
"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // associations if needed
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      age: {
        type: DataTypes.INTEGER,
        defaultValue: 18,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
```

## Controller (`controllers/userController.js`)

```js
import { User } from "../models/index.js";

// CREATE
export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
export const getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

// READ ONE
export const getUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

// UPDATE
export const updateUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  await user.update(req.body);
  res.json(user);
};

// DELETE
export const deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  await user.destroy();
  res.json({ message: "User deleted" });
};
```

## Routes (`routes/userRoutes.js`)

```js
import express from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
```

## App Setup (`app.js`)

```js
import express from "express";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json()); // parse JSON body
app.use("/users", userRoutes);

export default app;
```

## Server (server.js)

```js
import app from "./app.js";
import { sequelize } from "./models/index.js";

const PORT = 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to DB:", error);
  }
})();
```

## Usage (REST Endpoints)

- **POST** `/users` → create user
- **GET** `/users` → get all users
- **GET** `/users/:id` → get one user
- **PUT** `/users/:id` → update user
- **DELETE** `/users/:id` → delete user
