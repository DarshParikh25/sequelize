import { useState } from "react";
import { api } from "../services/api";
import React from "react";

const JobForm = () => {
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
    await api.post("/jobs", form);
    alert("Job Posted!");
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
