import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../services/api";
import React from "react";

const JobDetails = () => {
  const { id } = useParams(); // get job ID from the URL
  const [job, setJob] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (error) {
        console.log(error?.message);
      }
    })();
  }, [id]);

  if (!job) return <p className="text-center mt-10">Loading job details...</p>;

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">{job.title}</h1>
        <p className="text-gray-700 text-lg mb-1">{job.company}</p>
        <p className="text-gray-500 mb-4">{job.location}</p>
        <p className="text-gray-800 leading-relaxed">{job.description}</p>

        <button className="mt-6 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobDetails;
