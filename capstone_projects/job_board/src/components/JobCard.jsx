import { Link } from "react-router-dom";
import React from "react";

const JobCard = ({ job }) => (
  <div className="bg-gray-100 rounded p-4 flex justify-between items-center">
    <div>
      <h3 className="text-xl font-semibold">{job.title}</h3>
      <p className="text-gray-600">{job.company}</p>
      <p className="text-sm text-gray-500">{job.location}</p>
    </div>
    <Link
      to={`/jobs/${job.id}`}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      View
    </Link>
  </div>
);
export default JobCard;
