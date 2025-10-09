import Navbar from "../components/Navbar";
import JobForm from "../components/JobForm";
import React from "react";

const PostJob = ({ loggedIn }) => {
  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Post a New Job
        </h2>
        <JobForm loggedIn={loggedIn} />
      </div>
    </div>
  );
};

export default PostJob;
