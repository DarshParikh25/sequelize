import { Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import JobDetails from "./pages/JobDetails";
import PostJob from "./pages/PostJob";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/post-job" element={<PostJob />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
    </Routes>
  );
}
export default App;
