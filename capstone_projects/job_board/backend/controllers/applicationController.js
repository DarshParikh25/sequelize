import { Application } from "../models/index.js";

// Create a new application
export const createApplication = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { id } = req.user;

    await Application.create({
      userId: id,
      jobId,
      status: "applied",
    });

    return res.status(201).json({
      message: "Application created successfully!",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      message: error.message,
    });
  }
};

// Get all applications of the user
export const getAllUserApplications = async (req, res) => {
  try {
    const { id } = req.user;

    const applications = await Application.findAll(
      { attributes: ["userId", "jobId", "status"] },
      { where: { userId: id } }
    );

    if (applications.length === 0) {
      return res.status(404).json({
        message: "Application not found!",
      });
    }

    return res.status(200).json(applications);
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      message: error.message,
    });
  }
};

// Get all applications
export const _getAllApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      attributes: ["userId", "jobId", "status"],
    });

    if (applications.length === 0) {
      return res.status(404).json({
        message: "Application not found!",
      });
    }

    return res.status(200).json(applications);
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      message: error.message,
    });
  }
};
