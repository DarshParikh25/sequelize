import { useState } from "react";
import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";

const JobForm = ({ loggedIn }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (loggedIn) {
        await API.post("/jobs/post", form);
        toast.success("Job Posted!");
        navigate("/");
      } else {
        toast.error("Please login first.");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Please try again!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      {["title", "company", "location"].map((field) => (
        <input
          key={field}
          name={field}
          value={form[field]}
          onChange={handleChange}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          className="w-full border p-2 rounded"
          required
        />
      ))}
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Job Description"
        className="w-full border p-2 rounded"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Post Job
      </button>
    </form>
  );
};
export default JobForm;
