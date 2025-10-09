import { Job } from "../models/index.js";

// Create a new job
export const createJob = async (req, res) => {
  try {
    const { title, description, location, company } = req.body;

    if (!title || !description || !location || !company) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }

    const newJob = await Job.create({
      title,
      description,
      company,
      location,
    });

    return res.status(201).json({
      message: "Job created successfully!",
      job: {
        title: newJob.title,
        description: newJob.description,
        company: newJob.company,
        location: newJob.location,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

// Get all jobs
export const getAllJobs = async (_req, res) => {
  try {
    const jobs = await Job.findAll({
      attributes: ["id", "title", "description", "company", "location"],
    });

    if (jobs.length === 0) {
      return res.status(200).json({
        message: "No jobs found!",
      });
    }

    return res.status(200).json(jobs);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

// Get a job by id
export const getJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id, {
      attributes: ["id", "title", "company", "description", "location"],
    });

    if (!job) {
      return res.status(404).json({
        message: "Job does not exist!",
      });
    }

    res.status(200).json(job);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

// Update a job
export const _updateJob = async (req, res) => {
  try {
    const { title, description, company, location } = req.body;
    const { id } = req.params;

    if (!title || !description || !company || !location) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found!",
      });
    }

    await Job.update(
      {
        title,
        description,
        company,
        location,
      },
      { where: { id } }
    );

    res.status(200).json({
      message: "Job updated successfully!",
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

// Delete a job
export const _deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found!",
      });
    }

    await Job.destroy({ where: { id } });

    res.status(200).json({
      message: "Job deleted successfully!",
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      error: error.message,
    });
  }
};
