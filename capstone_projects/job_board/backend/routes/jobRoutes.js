import express from "express";

import {
  createJob,
  _deleteJob,
  getAllJobs,
  getJob,
  _updateJob,
} from "../controllers/jobController.js";

const jobRouter = express.Router();

jobRouter.post("/post", createJob);
jobRouter.get("/", getAllJobs);
jobRouter.get("/:id", getJob);
jobRouter.put("/update/:id", _updateJob);
jobRouter.delete("/delete/:id", _deleteJob);

export default jobRouter;
