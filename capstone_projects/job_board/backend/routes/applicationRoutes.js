import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createApplication,
  _getAllApplications,
  getAllUserApplications,
} from "../controllers/applicationController.js";

const applicationRouter = express.Router();

applicationRouter.post("/job/:jobId/apply", authMiddleware, createApplication);
applicationRouter.get(
  "/user/applications",
  authMiddleware,
  getAllUserApplications
);
applicationRouter.get("/applications", _getAllApplications);

export default applicationRouter;
