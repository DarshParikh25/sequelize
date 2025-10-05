import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import React from "react";

const Home = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("/jobs").then((res) => setJobs(res.data));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Latest Jobs</h2>
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};
export default Home;
