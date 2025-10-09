import { Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import { Bounce, ToastContainer } from "react-toastify";

import Home from "./pages/Home";
import JobDetails from "./pages/JobDetails";
import PostJob from "./pages/PostJob";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <ToastContainer position="top-center" transition={Bounce} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post-job" element={<PostJob loggedIn={isLoggedIn} />} />
        <Route
          path="/jobs/:id"
          element={<JobDetails loggedIn={isLoggedIn} />}
        />
      </Routes>
    </>
  );
}
export default App;
