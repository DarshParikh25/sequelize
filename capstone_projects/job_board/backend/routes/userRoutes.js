import express from "express";
import {
  _getAllUsers,
  getUser,
  login,
  register,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/", _getAllUsers);
userRouter.get("/:id", getUser);

export default userRouter;
